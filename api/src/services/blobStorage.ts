import { BlobServiceClient, ContainerClient, BlockBlobClient } from '@azure/storage-blob';
import config from '../config';

export class BlobStorageService {
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(config.blobStorage.connectionString!);
    this.containerClient = this.blobServiceClient.getContainerClient(config.blobStorage.containerName);
  }

  async uploadFile(fileName: string, fileBuffer: Buffer, contentType?: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    
    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType || 'application/octet-stream'
      }
    });

    return blockBlobClient.url;
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    const downloadResponse = await blockBlobClient.download();
    
    if (!downloadResponse.readableStreamBody) {
      throw new Error('File not found');
    }

    const chunks: Buffer[] = [];
    for await (const chunk of downloadResponse.readableStreamBody) {
      chunks.push(chunk);
    }
    
    return Buffer.concat(chunks);
  }

  async deleteFile(fileName: string): Promise<void> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    await blockBlobClient.delete();
  }

  async getFileUrl(fileName: string): Promise<string> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    return blockBlobClient.url;
  }

  async listFiles(prefix?: string): Promise<string[]> {
    const files: string[] = [];
    
    for await (const blob of this.containerClient.listBlobsFlat({ prefix })) {
      files.push(blob.name);
    }
    
    return files;
  }

  async fileExists(fileName: string): Promise<boolean> {
    const blockBlobClient = this.containerClient.getBlockBlobClient(fileName);
    try {
      await blockBlobClient.getProperties();
      return true;
    } catch {
      return false;
    }
  }
}

export const blobStorageService = new BlobStorageService();
