import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import config from '../config';
import { NotificationEvent } from '../types';

export class ServiceBusService {
  private client: ServiceBusClient;
  private documentEventsSender: ServiceBusSender;
  private userEventsSender: ServiceBusSender;

  constructor() {
    this.client = new ServiceBusClient(config.serviceBus.connectionString!);
    this.documentEventsSender = this.client.createSender(config.serviceBus.topics.documentEvents);
    this.userEventsSender = this.client.createSender(config.serviceBus.topics.userEvents);
  }

  async sendDocumentEvent(event: NotificationEvent): Promise<void> {
    await this.documentEventsSender.sendMessages({
      body: event,
      contentType: 'application/json'
    });
  }

  async sendUserEvent(event: NotificationEvent): Promise<void> {
    await this.userEventsSender.sendMessages({
      body: event,
      contentType: 'application/json'
    });
  }

  async close(): Promise<void> {
    await this.documentEventsSender.close();
    await this.userEventsSender.close();
    await this.client.close();
  }
}

export const serviceBusService = new ServiceBusService();
