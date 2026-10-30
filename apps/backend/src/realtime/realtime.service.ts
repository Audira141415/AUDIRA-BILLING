import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

export interface PaymentEventData {
  invoiceId: string;
  invoiceNumber?: string;
  customerName: string;
  amount: number;
  paymentMethod?: string;
  paymentTime?: string;
  customerId?: string;
  coaLatencyMs?: number;
}

export interface InvoiceEventData {
  invoiceId: string;
  invoiceNumber?: string;
  customerName: string;
  amount: number;
  dueDate: string;
  customerId?: string;
}

export interface TicketEventData {
  ticketId: string;
  ticketNumber?: string;
  title: string;
  status: string;
  priority?: string;
  customerName?: string;
  technicianId?: string;
  technicianName?: string;
}

export interface WorkOrderEventData {
  workOrderId: string;
  ticketId?: string;
  customerId?: string;
  technicianId?: string;
  type?: string;
  priority?: string;
  status: string;
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  scheduledAt?: string | Date;
  startedAt?: string | Date;
  completedAt?: string | Date;
  checkInPhoto?: string;
  notes?: string;
}

export interface NetworkAlertData {
  device: string;
  type: 'MIKROTIK' | 'OLT' | 'GENIEACS' | 'SYSTEM';
  status: 'DOWN' | 'WARNING' | 'UP';
  message: string;
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly gateway: RealtimeGateway) {}

  /**
   * Broadcast real-time payment success event
   */
  broadcastPaymentReceived(data: PaymentEventData) {
    const payload = {
      ...data,
      event: 'PAYMENT_RECEIVED',
      timestamp: data.paymentTime || new Date().toISOString(),
    };

    this.logger.log(`[Realtime] Emitting PAYMENT_RECEIVED for invoice ${data.invoiceNumber || data.invoiceId}`);
    // Broadcast to Admin web dashboard
    this.gateway.server?.to('admin_room').emit('payment_received', payload);

    // Also notify specific customer room if provided
    if (data.customerId) {
      this.gateway.server?.to(`customer_${data.customerId}`).emit('payment_received', payload);
    }

    // Trigger auto-refresh for web admin statistics
    this.broadcastDashboardRefresh('payment_received');
  }

  /**
   * Broadcast newly generated invoice
   */
  broadcastInvoiceCreated(data: InvoiceEventData) {
    const payload = {
      ...data,
      event: 'INVOICE_CREATED',
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`[Realtime] Emitting INVOICE_CREATED for invoice ${data.invoiceNumber || data.invoiceId}`);
    this.gateway.server?.to('admin_room').emit('invoice_created', payload);

    if (data.customerId) {
      this.gateway.server?.to(`customer_${data.customerId}`).emit('invoice_created', payload);
    }
  }

  /**
   * Broadcast trouble ticket status update
   */
  broadcastTicketUpdated(data: TicketEventData) {
    const payload = {
      ...data,
      event: 'TICKET_UPDATED',
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`[Realtime] Emitting TICKET_UPDATED for ticket ${data.ticketNumber || data.ticketId}`);
    // Emit to admin web and technician mobile
    this.gateway.server?.to('admin_room').emit('ticket_updated', payload);
    this.gateway.server?.to('technician_room').emit('ticket_updated', payload);
    this.gateway.server?.emit('ticket_updated', payload);

    if (data.technicianId) {
      this.gateway.server?.to(`technician_${data.technicianId}`).emit('ticket_assigned', payload);
    }

    this.broadcastDashboardRefresh('ticket_updated');
  }

  /**
   * Broadcast work order lifecycle event (created, assigned, in-progress, completed)
   */
  broadcastWorkOrderUpdated(data: any) {
    const payload = {
      ...data,
      workOrderId: data.id || data.workOrderId,
      event: 'WORK_ORDER_UPDATED',
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`[Realtime] Emitting WORK_ORDER_UPDATED for workOrder ${payload.workOrderId} [${payload.status}]`);
    // Broadcast to web admin and technician room
    this.gateway.server?.to('admin_room').emit('work_order_updated', payload);
    this.gateway.server?.to('technician_room').emit('work_order_updated', payload);
    this.gateway.server?.emit('work_order_updated', payload);

    if (data.technicianId) {
      this.gateway.server?.to(`technician_${data.technicianId}`).emit('work_order_assigned', payload);
    }

    this.broadcastDashboardRefresh('work_order_updated');
  }

  /**
   * Broadcast Technician Live GPS location to Web Admin Radar
   */
  broadcastTechnicianLocation(payload: {
    technicianId: string;
    technicianName?: string;
    latitude: number;
    longitude: number;
    status?: string;
    timestamp?: string;
  }) {
    const data = {
      ...payload,
      event: 'TECHNICIAN_LOCATION',
      timestamp: payload.timestamp || new Date().toISOString(),
    };

    this.logger.log(`[Realtime] Emitting TECHNICIAN_LOCATION: ${payload.technicianId} at [${payload.latitude}, ${payload.longitude}]`);
    this.gateway.server?.to('admin_room').emit('technician_location', data);
    this.gateway.server?.emit('technician_location', data);
  }

  /**
   * Broadcast network telemetry alert (MikroTik / OLT / GenieACS)
   */
  broadcastNetworkAlert(data: NetworkAlertData) {
    const payload = {
      ...data,
      event: 'NETWORK_ALERT',
      timestamp: new Date().toISOString(),
    };

    this.logger.warn(`[Realtime] Emitting NETWORK_ALERT: [${data.status}] ${data.device} - ${data.message}`);
    this.gateway.server?.to('admin_room').emit('network_alert', payload);
  }

  /**
   * Trigger dashboard widgets to re-fetch freshest metrics
   */
  broadcastDashboardRefresh(reason = 'manual_refresh') {
    this.gateway.server?.to('admin_room').emit('dashboard_refresh', {
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send custom event to any specific room
   */
  sendToRoom(room: string, event: string, payload: any) {
    this.gateway.server?.to(room).emit(event, {
      ...payload,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Inspect current realtime gateway health & connections
   */
  getStatus() {
    return {
      status: 'ONLINE',
      gateway: 'AUDIRA Realtime Gateway (Socket.io)',
      ...this.gateway.getConnectedStats(),
      serverTime: new Date().toISOString(),
    };
  }
}
