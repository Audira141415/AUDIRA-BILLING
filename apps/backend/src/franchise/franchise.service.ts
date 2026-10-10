import { Injectable } from '@nestjs/common';

@Injectable()
export class FranchiseService {
  // Mock data - Franchise model not yet in schema
  private franchises = [
    {
      id: '1',
      name: 'Franchise Jakarta Pusat',
      ownerName: 'Budi Santoso',
      ownerPhone: '081234567890',
      ownerEmail: 'budi@franchise.com',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      status: 'ACTIVE',
      revenue: 50000000,
      commissionRate: 15,
      totalCustomers: 150,
      createdAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      name: 'Franchise Bandung',
      ownerName: 'Siti Rahayu',
      ownerPhone: '082234567890',
      ownerEmail: 'siti@franchise.com',
      address: 'Jl. Asia Afrika No. 456',
      city: 'Bandung',
      province: 'Jawa Barat',
      status: 'ACTIVE',
      revenue: 35000000,
      commissionRate: 15,
      totalCustomers: 100,
      createdAt: new Date('2024-02-01'),
    },
  ];

  async findAll() {
    return this.franchises;
  }

  async getStats() {
    return {
      total: this.franchises.length,
      active: this.franchises.filter(f => f.status === 'ACTIVE').length,
      inactive: this.franchises.filter(f => f.status === 'INACTIVE').length,
      totalCustomers: this.franchises.reduce((sum, f) => sum + f.totalCustomers, 0),
      totalRevenue: this.franchises.reduce((sum, f) => sum + f.revenue, 0),
    };
  }

  async findOne(id: string) {
    return this.franchises.find(f => f.id === id);
  }

  async create(data: any) {
    const newFranchise = {
      id: Date.now().toString(),
      ...data,
      totalCustomers: 0,
      createdAt: new Date(),
    };
    this.franchises.push(newFranchise);
    return newFranchise;
  }

  async update(id: string, data: any) {
    const index = this.franchises.findIndex(f => f.id === id);
    if (index !== -1) {
      this.franchises[index] = { ...this.franchises[index], ...data };
      return this.franchises[index];
    }
    throw new Error('Franchise not found');
  }

  async remove(id: string) {
    const index = this.franchises.findIndex(f => f.id === id);
    if (index !== -1) {
      this.franchises.splice(index, 1);
      return { success: true, message: 'Franchise deleted successfully' };
    }
    throw new Error('Franchise not found');
  }

  async getFranchiseCustomers(id: string) {
    return []; // Return empty array for now
  }

  async getFranchiseRevenue(id: string) {
    const franchise = this.franchises.find(f => f.id === id);
    return {
      totalRevenue: franchise?.revenue || 0,
      monthlyRevenue: franchise?.revenue || 0,
      payments: 0,
    };
  }
}
