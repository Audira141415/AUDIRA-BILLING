import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ReferralService {
  constructor(private prisma: PrismaService) {}

  // Generate unique referral code
  generateReferralCode(customerName: string): string {
    const randomString = crypto.randomBytes(4).toString('hex').toUpperCase();
    const namePrefix = customerName.substring(0, 3).toUpperCase();
    return `${namePrefix}${randomString}`;
  }

  // Create referral when new customer signs up with referral code
  async createReferral(referralCode: string, newCustomerId: string) {
    // Find referrer by code
    const existingReferral = await this.prisma.referral.findUnique({
      where: { code: referralCode },
      include: { referrer: true },
    });

    if (!existingReferral) {
      throw new Error('Invalid referral code');
    }

    const referrerId = existingReferral.referrerId;

    // Create referral record
    const referral = await this.prisma.referral.create({
      data: {
        referrerId,
        referredId: newCustomerId,
        code: this.generateReferralCode(existingReferral.referrer.name),
        status: 'pending',
        commission: 50000, // Rp 50,000 per referral
        commissionType: 'fixed',
        level: 1,
      },
    });

    // Award points to referrer
    await this.awardPoints(referrerId, 100, 'referral', `Referral bonus for ${newCustomerId}`);

    // Award welcome points to new customer
    await this.awardPoints(newCustomerId, 50, 'signup', 'Welcome bonus');

    return referral;
  }

  // Award loyalty points
  async awardPoints(customerId: string, points: number, source: string, description: string) {
    // Calculate expiry (1 year from now)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    const loyaltyPoint = await this.prisma.loyaltyPoint.create({
      data: {
        customerId,
        points,
        source,
        description,
        expiresAt,
      },
    });

    // Update customer tier based on total points
    await this.updateCustomerTier(customerId);

    return loyaltyPoint;
  }

  // Calculate total points for customer
  async getTotalPoints(customerId: string): Promise<number> {
    const points = await this.prisma.loyaltyPoint.findMany({
      where: {
        customerId,
        expiresAt: { gte: new Date() }, // Only non-expired points
      },
    });

    return points.reduce((total, point) => total + point.points, 0);
  }

  // Update customer tier based on points
  async updateCustomerTier(customerId: string) {
    const totalPoints = await this.getTotalPoints(customerId);

    let tier = 'bronze';
    if (totalPoints >= 10000) tier = 'platinum';
    else if (totalPoints >= 5000) tier = 'gold';
    else if (totalPoints >= 2000) tier = 'silver';

    // Update all points records to reflect new tier
    await this.prisma.loyaltyPoint.updateMany({
      where: { customerId },
      data: { tier },
    });

    return tier;
  }

  // Get customer referral statistics
  async getReferralStats(customerId: string) {
    const referrals = await this.prisma.referral.findMany({
      where: { referrerId: customerId },
      include: { referred: true },
    });

    const totalReferrals = referrals.length;
    const completedReferrals = referrals.filter((r) => r.status === 'completed').length;
    const pendingReferrals = referrals.filter((r) => r.status === 'pending').length;
    const totalCommission = referrals.reduce((sum, r) => sum + r.commission, 0);

    return {
      totalReferrals,
      completedReferrals,
      pendingReferrals,
      totalCommission,
      referrals,
    };
  }

  // Get customer loyalty points summary
  async getLoyaltyPointsSummary(customerId: string) {
    const points = await this.prisma.loyaltyPoint.findMany({
      where: {
        customerId,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalPoints = points.reduce((sum, p) => sum + p.points, 0);
    const tier = points.length > 0 ? points[0].tier : 'bronze';

    // Calculate points by source
    const pointsBySource = {
      signup: 0,
      referral: 0,
      payment: 0,
      cashback: 0,
    };

    points.forEach((p) => {
      if (pointsBySource[p.source] !== undefined) {
        pointsBySource[p.source] += p.points;
      }
    });

    return {
      totalPoints,
      tier,
      pointsBySource,
      recentPoints: points.slice(0, 10),
    };
  }

  // Process referral completion (called when referred customer makes first payment)
  async completeReferral(referredCustomerId: string) {
    const referral = await this.prisma.referral.findFirst({
      where: {
        referredId: referredCustomerId,
        status: 'pending',
      },
    });

    if (!referral) {
      return null;
    }

    // Mark as completed
    const updated = await this.prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
    });

    // Award completion bonus points
    await this.awardPoints(
      referral.referrerId,
      200,
      'referral',
      `Referral completed: ${referredCustomerId}`,
    );

    // Process MLM commission (if applicable)
    await this.processMLMCommission(referral.referrerId, referral.commission, 2);

    return updated;
  }

  // MLM Commission Distribution (multi-level)
  async processMLMCommission(referrerId: string, baseCommission: number, maxLevel: number) {
    let currentReferrerId = referrerId;
    let level = 1;
    const commissionRate = [0.5, 0.3, 0.2]; // Level 1: 50%, Level 2: 30%, Level 3: 20%

    while (level <= maxLevel && currentReferrerId) {
      // Find who referred this customer
      const parentReferral = await this.prisma.referral.findFirst({
        where: { referredId: currentReferrerId },
      });

      if (!parentReferral) break;

      // Award commission to parent referrer
      const commission = baseCommission * (commissionRate[level - 1] || 0.1);
      await this.awardPoints(
        parentReferral.referrerId,
        Math.floor(commission / 1000), // Convert to points (Rp 1000 = 1 point)
        'referral',
        `Level ${level} MLM commission`,
      );

      currentReferrerId = parentReferral.referrerId;
      level++;
    }
  }

  // Redeem points (convert to discount or rewards)
  async redeemPoints(customerId: string, pointsToRedeem: number) {
    const totalPoints = await this.getTotalPoints(customerId);

    if (totalPoints < pointsToRedeem) {
      throw new Error('Insufficient points');
    }

    // Deduct points (by creating negative point record)
    await this.prisma.loyaltyPoint.create({
      data: {
        customerId,
        points: -pointsToRedeem,
        source: 'redemption',
        description: `Redeemed ${pointsToRedeem} points`,
        tier: 'bronze', // Will be updated by updateCustomerTier
      },
    });

    // Update tier after redemption
    await this.updateCustomerTier(customerId);

    // Calculate discount value (100 points = Rp 10,000)
    const discountValue = (pointsToRedeem / 100) * 10000;

    return {
      pointsRedeemed: pointsToRedeem,
      discountValue,
      remainingPoints: totalPoints - pointsToRedeem,
    };
  }

  // Get customer's referral code
  async getOrCreateReferralCode(customerId: string) {
    // Check if customer already has a referral code
    let referral = await this.prisma.referral.findFirst({
      where: { referrerId: customerId },
    });

    if (referral) {
      return referral.code;
    }

    // Create new referral code
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    const code = this.generateReferralCode(customer.name);

    // Create a self-referral record to store the code
    await this.prisma.referral.create({
      data: {
        referrerId: customerId,
        referredId: customerId, // Self-reference
        code,
        status: 'completed',
        commission: 0,
        level: 0,
      },
    });

    return code;
  }

  // Award payment points (called after successful payment)
  async awardPaymentPoints(customerId: string, paymentAmount: number) {
    // Award 1 point per Rp 10,000 spent
    const points = Math.floor(paymentAmount / 10000);

    if (points > 0) {
      await this.awardPoints(customerId, points, 'payment', `Payment of Rp ${paymentAmount}`);
    }

    return points;
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 10) {
    const customers = await this.prisma.customer.findMany({
      include: {
        loyaltyPoints: {
          where: { expiresAt: { gte: new Date() } },
        },
      },
    });

    const leaderboard = customers
      .map((customer) => ({
        id: customer.id,
        name: customer.name,
        totalPoints: customer.loyaltyPoints.reduce((sum, p) => sum + p.points, 0),
        tier:
          customer.loyaltyPoints.length > 0 ? customer.loyaltyPoints[0].tier : 'bronze',
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);

    return leaderboard;
  }
}
