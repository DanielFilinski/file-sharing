const config = {
  authorityHost: process.env.M365_AUTHORITY_HOST,
  tenantId: process.env.M365_TENANT_ID,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,
  
  // Azure Cosmos DB
  cosmosDb: {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY,
    databaseId: process.env.COSMOS_DB_DATABASE_ID || 'file-sharing-db',
    containers: {
      users: 'users',
      documents: 'documents',
      chats: 'chats'
    }
  },
  
  // Azure Blob Storage
  blobStorage: {
    connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
    containerName: process.env.BLOB_CONTAINER_NAME || 'documents'
  },
  
  // Azure Service Bus
  serviceBus: {
    connectionString: process.env.SERVICE_BUS_CONNECTION_STRING,
    topics: {
      documentEvents: 'document-events',
      userEvents: 'user-events'
    }
  },
  
  // Azure SignalR
  signalR: {
    connectionString: process.env.SIGNALR_CONNECTION_STRING
  }
};

export default config;
