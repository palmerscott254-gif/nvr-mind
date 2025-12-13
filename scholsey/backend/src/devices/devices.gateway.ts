import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class DevicesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Clean up user socket mapping
    for (const [userId, sockets] of this.userSockets.entries()) {
      sockets.delete(client.id);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  @SubscribeMessage('subscribe-device-updates')
  handleSubscribe(client: Socket, payload: { userId: string }) {
    if (!this.userSockets.has(payload.userId)) {
      this.userSockets.set(payload.userId, new Set());
    }
    this.userSockets.get(payload.userId).add(client.id);
    client.join(`user-${payload.userId}`);
  }

  notifyDeviceUpdate(userId: string, device: any) {
    this.server.to(`user-${userId}`).emit('device-updated', device);
  }

  notifyLocationUpdate(userId: string, data: any) {
    this.server.to(`user-${userId}`).emit('location-updated', data);
  }
}
