import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

export interface LocationPayload {
  technicianId: string;
  technicianName?: string;
  latitude: number;
  longitude: number;
  speed?: number;
  timestamp?: string;
}

export interface ChatPayload {
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId?: string;
  room?: string;
  message: string;
  timestamp?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(RealtimeGateway.name);
  private connectedClients: Map<string, { socketId: string; room?: string; role?: string; joinedAt: Date }> = new Map();

  afterInit(server: Server) {
    this.logger.log('⚡ Realtime WebSocket Gateway initialized successfully');
  }

  handleConnection(client: Socket) {
    this.logger.log(`[WebSocket] Client connected: ${client.id}`);
    this.connectedClients.set(client.id, {
      socketId: client.id,
      joinedAt: new Date(),
    });

    // Send welcome handshake
    client.emit('connected', {
      status: 'CONNECTED',
      socketId: client.id,
      serverTime: new Date().toISOString(),
      message: 'Welcome to AUDIRA NET & BILLING Realtime Gateway',
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`[WebSocket] Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; role?: string; userId?: string },
  ) {
    const room = typeof payload === 'string' ? payload : payload?.room;
    if (!room) return { status: 'error', message: 'Room name required' };

    client.join(room);
    const clientData = this.connectedClients.get(client.id);
    if (clientData) {
      clientData.room = room;
      if (typeof payload === 'object') {
        clientData.role = payload.role;
      }
    }

    this.logger.log(`[WebSocket] Client ${client.id} joined room: ${room}`);
    return {
      status: 'success',
      room,
      message: `Joined room ${room}`,
    };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    if (!room) return;
    client.leave(room);
    this.logger.log(`[WebSocket] Client ${client.id} left room: ${room}`);
    return { status: 'success', room, message: `Left room ${room}` };
  }

  @SubscribeMessage('tech_location_update')
  handleTechLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LocationPayload,
  ) {
    const enriched = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
      socketId: client.id,
    };
    // Relay to admin monitoring dashboard room
    this.server.to('admin_room').emit('technician_location', enriched);
    return { status: 'received', timestamp: enriched.timestamp };
  }

  @SubscribeMessage('chat_message')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatPayload,
  ) {
    const enriched = {
      ...payload,
      timestamp: payload.timestamp || new Date().toISOString(),
    };

    if (payload.room) {
      this.server.to(payload.room).emit('chat_message', enriched);
    } else {
      this.server.to('admin_room').emit('chat_message', enriched);
    }

    return { status: 'sent', timestamp: enriched.timestamp };
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', timestamp: new Date().toISOString() };
  }

  getConnectedStats() {
    return {
      totalConnected: this.connectedClients.size,
      clients: Array.from(this.connectedClients.values()),
    };
  }
}
