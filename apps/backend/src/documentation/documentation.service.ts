import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentationService {
  private docs = [
    {
      id: '1',
      title: 'Getting Started',
      category: 'introduction',
      content: '# Getting Started\n\nWelcome to Audira Billing System...',
      tags: ['introduction', 'setup'],
      createdAt: new Date('2025-01-01'),
      updatedAt: new Date('2025-01-01'),
    },
    {
      id: '2',
      title: 'Managing Customers',
      category: 'features',
      content: '# Managing Customers\n\nLearn how to add, edit, and manage customers...',
      tags: ['customers', 'pelanggan', 'management'],
      createdAt: new Date('2025-01-05'),
      updatedAt: new Date('2025-01-05'),
    },
    {
      id: '3',
      title: 'Invoice Configuration',
      category: 'billing',
      content: '# Invoice Configuration\n\nConfigure automatic invoice generation...',
      tags: ['billing', 'invoices', 'configuration'],
      createdAt: new Date('2025-01-10'),
      updatedAt: new Date('2025-01-10'),
    },
    {
      id: '4',
      title: 'Mikrotik Integration',
      category: 'technical',
      content: '# Mikrotik Integration\n\nConnect and manage Mikrotik routers...',
      tags: ['mikrotik', 'router', 'integration'],
      createdAt: new Date('2025-01-15'),
      updatedAt: new Date('2025-01-15'),
    },
  ];

  async findAll(category?: string) {
    if (category) {
      return this.docs.filter(doc => doc.category === category);
    }
    return this.docs;
  }

  async getCategories() {
    return [
      { id: 'introduction', name: 'Introduction', icon: 'book-open', count: 1 },
      { id: 'features', name: 'Features', icon: 'star', count: 1 },
      { id: 'billing', name: 'Billing', icon: 'credit-card', count: 1 },
      { id: 'technical', name: 'Technical', icon: 'code', count: 1 },
      { id: 'api', name: 'API Reference', icon: 'terminal', count: 0 },
      { id: 'troubleshooting', name: 'Troubleshooting', icon: 'alert-circle', count: 0 },
    ];
  }

  async search(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.docs.filter(doc =>
      doc.title.toLowerCase().includes(lowerQuery) ||
      doc.content.toLowerCase().includes(lowerQuery) ||
      doc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  async findOne(id: string) {
    return this.docs.find(doc => doc.id === id);
  }

  async create(data: any) {
    const newDoc = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.docs.push(newDoc);
    return newDoc;
  }

  async update(id: string, data: any) {
    const index = this.docs.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.docs[index] = {
        ...this.docs[index],
        ...data,
        updatedAt: new Date(),
      };
      return this.docs[index];
    }
    throw new Error('Document not found');
  }

  async remove(id: string) {
    const index = this.docs.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.docs.splice(index, 1);
      return { success: true, message: 'Document deleted successfully' };
    }
    throw new Error('Document not found');
  }
}
