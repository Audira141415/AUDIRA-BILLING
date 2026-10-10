import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ReferralService } from './referral.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('referral')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  // Get or create customer's referral code
  @Get('code/:customerId')
  async getReferralCode(@Param('customerId') customerId: string) {
    const code = await this.referralService.getOrCreateReferralCode(customerId);
    return {
      success: true,
      code,
    };
  }

  // Create referral when new customer signs up
  @Post('create')
  async createReferral(
    @Body() data: { referralCode: string; newCustomerId: string },
  ) {
    try {
      const referral = await this.referralService.createReferral(
        data.referralCode,
        data.newCustomerId,
      );
      return {
        success: true,
        message: 'Referral created successfully',
        referral,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get referral statistics for customer
  @Get('stats/:customerId')
  async getReferralStats(@Param('customerId') customerId: string) {
    const stats = await this.referralService.getReferralStats(customerId);
    return {
      success: true,
      stats,
    };
  }

  // Get loyalty points summary
  @Get('loyalty/:customerId')
  async getLoyaltyPoints(@Param('customerId') customerId: string) {
    const summary = await this.referralService.getLoyaltyPointsSummary(customerId);
    return {
      success: true,
      summary,
    };
  }

  // Complete referral (called after first payment)
  @Post('complete/:customerId')
  async completeReferral(@Param('customerId') customerId: string) {
    const referral = await this.referralService.completeReferral(customerId);
    return {
      success: true,
      message: 'Referral completed',
      referral,
    };
  }

  // Award payment points
  @Post('award-payment-points')
  async awardPaymentPoints(
    @Body() data: { customerId: string; amount: number },
  ) {
    const points = await this.referralService.awardPaymentPoints(
      data.customerId,
      data.amount,
    );
    return {
      success: true,
      message: `Awarded ${points} points`,
      points,
    };
  }

  // Redeem points
  @Post('redeem')
  async redeemPoints(@Body() data: { customerId: string; points: number }) {
    try {
      const result = await this.referralService.redeemPoints(
        data.customerId,
        data.points,
      );
      return {
        success: true,
        message: 'Points redeemed successfully',
        result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // Get leaderboard
  @Get('leaderboard')
  async getLeaderboard() {
    const leaderboard = await this.referralService.getLeaderboard(10);
    return {
      success: true,
      leaderboard,
    };
  }

  // Award custom points (admin)
  @Post('award-points')
  async awardPoints(
    @Body()
    data: {
      customerId: string;
      points: number;
      source: string;
      description: string;
    },
  ) {
    const result = await this.referralService.awardPoints(
      data.customerId,
      data.points,
      data.source,
      data.description,
    );
    return {
      success: true,
      message: 'Points awarded successfully',
      result,
    };
  }
}
