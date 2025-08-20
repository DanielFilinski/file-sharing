import { WebPubSubServiceClient } from '@azure/web-pubsub';
import config from '../config';

export class SignalRService {
  private serviceClient: WebPubSubServiceClient;

  constructor() {
    this.serviceClient = new WebPubSubServiceClient(config.signalR.connectionString!, 'default');
  }

  async sendToUser(userId: string, message: any): Promise<void> {
    await this.serviceClient.sendToUser(userId, {
      data: message,
      dataType: 'json'
    });
  }

  async sendToGroup(groupName: string, message: any): Promise<void> {
    await this.serviceClient.sendToGroup(groupName, {
      data: message,
      dataType: 'json'
    });
  }

  async addUserToGroup(userId: string, groupName: string): Promise<void> {
    await this.serviceClient.addUserToGroup(userId, groupName);
  }

  async removeUserFromGroup(userId: string, groupName: string): Promise<void> {
    await this.serviceClient.removeUserFromGroup(userId, groupName);
  }

  async broadcast(message: any): Promise<void> {
    await this.serviceClient.sendToAll({
      data: message,
      dataType: 'json'
    });
  }
}

export const signalRService = new SignalRService();
