import * as signalR from '@microsoft/signalr';
import { SIGNALR_HUB_URL } from './api';

class SignalRService {
  private connection: signalR.HubConnection | null = null;

  public async startConnection(userId: string): Promise<signalR.HubConnection> {
    if (this.connection) return this.connection;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${SIGNALR_HUB_URL}?userId=${userId}`, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    try {
      await this.connection.start();
      console.log('SignalR WebSocket connected successfully over local network / cloud.');
    } catch (err) {
      console.warn('SignalR fallback mode active (Mock mode enabled):', err);
    }

    return this.connection;
  }

  public async joinChannel(channelId: string) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('JoinChannel', channelId);
    }
  }

  public async sendMessage(channelId: string, userId: string, content: string, parentMessageId?: string) {
    if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
      await this.connection.invoke('SendMessage', channelId, userId, content, parentMessageId);
    }
  }

  public onReceiveMessage(callback: (message: any) => void) {
    if (this.connection) {
      this.connection.on('ReceiveMessage', callback);
    }
  }

  public onUserPresence(callback: (data: { userId: string; status: string }) => void) {
    if (this.connection) {
      this.connection.on('UserPresenceChanged', callback);
    }
  }
}

export const signalRService = new SignalRService();
