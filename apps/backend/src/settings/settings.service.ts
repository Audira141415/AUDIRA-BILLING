import { Injectable } from '@nestjs/common';

@Injectable()
export class SettingsService {
  private settings = {
    company: {
      name: 'PT Audira Nusantara',
      email: 'info@audira.net',
      phone: '021-1234567',
      address: 'Jl. Contoh No. 123, Jakarta',
      logo: '/logo.png',
      website: 'https://audira.net',
    },
    billing: {
      invoicePrefix: 'INV',
      invoiceDueDay: 5,
      lateFeePercentage: 2,
      reminderDaysBefore: 3,
      autoGenerateInvoices: true,
      taxPercentage: 11,
    },
    notification: {
      emailEnabled: true,
      whatsappEnabled: true,
      smsEnabled: false,
      invoiceReminder: true,
      paymentConfirmation: true,
      ticketUpdates: true,
    },
    technical: {
      mikrotikDefaultPort: 8728,
      mikrotikDefaultUsername: 'admin',
      radiusServerEnabled: false,
      radiusServerPort: 1812,
      genieacsUrl: 'http://localhost:7547',
      genieacsEnabled: false,
    },
    appearance: {
      theme: 'light',
      primaryColor: '#4F46E5',
      logoPosition: 'left',
      showNotifications: true,
    },
  };

  async getSettings() {
    return this.settings;
  }

  async getSetting(key: string) {
    const [category, setting] = key.split('.');
    if (category && setting && this.settings[category]) {
      return {
        key,
        value: this.settings[category][setting],
      };
    }
    return this.settings[key] || null;
  }

  async updateSettings(newSettings: Record<string, any>) {
    Object.keys(newSettings).forEach(category => {
      if (this.settings[category]) {
        this.settings[category] = {
          ...this.settings[category],
          ...newSettings[category],
        };
      }
    });

    return { success: true, message: 'Settings updated successfully' };
  }

  async updateSetting(key: string, value: any) {
    const [category, setting] = key.split('.');
    if (category && setting && this.settings[category]) {
      this.settings[category][setting] = value;
      return { success: true, message: `Setting ${key} updated successfully` };
    }

    throw new Error(`Setting ${key} not found`);
  }

  async getCategories() {
    return [
      { id: 'company', name: 'Company Information', icon: 'building' },
      { id: 'billing', name: 'Billing & Invoicing', icon: 'credit-card' },
      { id: 'notification', name: 'Notifications', icon: 'bell' },
      { id: 'technical', name: 'Technical Settings', icon: 'settings' },
      { id: 'appearance', name: 'Appearance', icon: 'palette' },
    ];
  }
}
