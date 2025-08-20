import { CosmosClient, Container, Database } from '@azure/cosmos';
import config from '../config';

export class CosmosDbService {
  private client: CosmosClient;
  private database: Database;

  constructor() {
    this.client = new CosmosClient({
      endpoint: config.cosmosDb.endpoint!,
      key: config.cosmosDb.key!
    });
    this.database = this.client.database(config.cosmosDb.databaseId);
  }

  async getContainer(containerName: string): Promise<Container> {
    const container = this.database.container(containerName);
    await container.read();
    return container;
  }

  async createItem<T>(containerName: string, item: T): Promise<T> {
    const container = await this.getContainer(containerName);
    const { resource } = await container.items.create(item);
    return resource as T;
  }

  async getItem<T>(containerName: string, id: string, partitionKey?: string): Promise<T | undefined> {
    const container = await this.getContainer(containerName);
    try {
      const { resource } = await container.item(id, partitionKey || id).read();
      return resource as T;
    } catch (error) {
      return undefined;
    }
  }

  async queryItems<T>(containerName: string, query: string, parameters?: any[]): Promise<T[]> {
    const container = await this.getContainer(containerName);
    const { resources } = await container.items.query<T>({ query, parameters });
    return resources;
  }

  async updateItem<T>(containerName: string, id: string, item: T, partitionKey?: string): Promise<T> {
    const container = await this.getContainer(containerName);
    const { resource } = await container.item(id, partitionKey || id).replace(item);
    return resource as T;
  }

  async deleteItem(containerName: string, id: string, partitionKey?: string): Promise<void> {
    const container = await this.getContainer(containerName);
    await container.item(id, partitionKey || id).delete();
  }
}

export const cosmosDbService = new CosmosDbService();
