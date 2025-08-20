import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDbService } from "../services/cosmosDb";
import { blobStorageService } from "../services/blobStorage";
import { Document, DocumentUploadRequest, DocumentApprovalRequest } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Получить все документы
export async function getDocuments(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documents = await cosmosDbService.queryItems<Document>(
      'documents',
      'SELECT * FROM c ORDER BY c.createdAt DESC'
    );

    return {
      status: 200,
      body: JSON.stringify(documents)
    };
  } catch (error) {
    context.error('Error getting documents:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get documents' })
    };
  }
}

// Получить документ по ID
export async function getDocumentById(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.id;
    const document = await cosmosDbService.getItem<Document>('documents', documentId);

    if (!document) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'Document not found' })
      };
    }

    return {
      status: 200,
      body: JSON.stringify(document)
    };
  } catch (error) {
    context.error('Error getting document:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get document' })
    };
  }
}

// Создать документ
export async function createDocument(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentData: DocumentUploadRequest = await req.json();
    
    const document: Document = {
      id: uuidv4(),
      title: documentData.title,
      content: documentData.content,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      authorId: documentData.authorId,
      approverId: documentData.approverId
    };

    const createdDocument = await cosmosDbService.createItem<Document>('documents', document);

    return {
      status: 201,
      body: JSON.stringify(createdDocument)
    };
  } catch (error) {
    context.error('Error creating document:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to create document' })
    };
  }
}

// Загрузить файл документа
export async function uploadDocumentFile(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.id;
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return {
        status: 400,
        body: JSON.stringify({ error: 'No file provided' })
      };
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${documentId}/${file.name}`;
    
    const fileUrl = await blobStorageService.uploadFile(
      fileName,
      fileBuffer,
      file.type
    );

    // Обновить документ с информацией о файле
    const existingDocument = await cosmosDbService.getItem<Document>('documents', documentId);
    if (!existingDocument) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'Document not found' })
      };
    }

    const updatedDocument = {
      ...existingDocument,
      fileName: file.name,
      fileUrl: fileUrl,
      fileSize: file.size,
      mimeType: file.type,
      updatedAt: new Date().toISOString()
    };

    const result = await cosmosDbService.updateItem<Document>('documents', documentId, updatedDocument);

    return {
      status: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    context.error('Error uploading document file:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to upload document file' })
    };
  }
}

// Скачать файл документа
export async function downloadDocumentFile(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.id;
    const document = await cosmosDbService.getItem<Document>('documents', documentId);

    if (!document || !document.fileName) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'Document or file not found' })
      };
    }

    const fileName = `${documentId}/${document.fileName}`;
    const fileBuffer = await blobStorageService.downloadFile(fileName);

    return {
      status: 200,
      headers: {
        'Content-Type': document.mimeType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.fileName}"`
      },
      body: fileBuffer.toString('base64')
    };
  } catch (error) {
    context.error('Error downloading document file:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to download document file' })
    };
  }
}

// Одобрить/отклонить документ
export async function approveDocument(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const approvalData: DocumentApprovalRequest = await req.json();
    
    const existingDocument = await cosmosDbService.getItem<Document>('documents', approvalData.documentId);
    if (!existingDocument) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'Document not found' })
      };
    }

    const updatedDocument = {
      ...existingDocument,
      status: approvalData.status,
      approverId: approvalData.approverId,
      updatedAt: new Date().toISOString()
    };

    const result = await cosmosDbService.updateItem<Document>('documents', approvalData.documentId, updatedDocument);

    return {
      status: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    context.error('Error approving document:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to approve document' })
    };
  }
}

// Получить документы по статусу
export async function getDocumentsByStatus(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const status = req.params.status;
    const documents = await cosmosDbService.queryItems<Document>(
      'documents',
      'SELECT * FROM c WHERE c.status = @status ORDER BY c.createdAt DESC',
      [{ name: '@status', value: status }]
    );

    return {
      status: 200,
      body: JSON.stringify(documents)
    };
  } catch (error) {
    context.error('Error getting documents by status:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get documents by status' })
    };
  }
}

// Получить документы пользователя
export async function getUserDocuments(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const userId = req.params.userId;
    const documents = await cosmosDbService.queryItems<Document>(
      'documents',
      'SELECT * FROM c WHERE c.authorId = @userId ORDER BY c.createdAt DESC',
      [{ name: '@userId', value: userId }]
    );

    return {
      status: 200,
      body: JSON.stringify(documents)
    };
  } catch (error) {
    context.error('Error getting user documents:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get user documents' })
    };
  }
}

// Удалить документ
export async function deleteDocument(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.id;
    
    // Удалить файл из blob storage если есть
    const document = await cosmosDbService.getItem<Document>('documents', documentId);
    if (document?.fileName) {
      const fileName = `${documentId}/${document.fileName}`;
      await blobStorageService.deleteFile(fileName);
    }

    await cosmosDbService.deleteItem('documents', documentId);

    return {
      status: 204
    };
  } catch (error) {
    context.error('Error deleting document:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to delete document' })
    };
  }
}

// Регистрация HTTP триггеров
app.http("getDocuments", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "documents",
  handler: getDocuments,
});

app.http("getDocumentById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "documents/{id}",
  handler: getDocumentById,
});

app.http("createDocument", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "documents",
  handler: createDocument,
});

app.http("uploadDocumentFile", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "documents/{id}/upload",
  handler: uploadDocumentFile,
});

app.http("downloadDocumentFile", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "documents/{id}/download",
  handler: downloadDocumentFile,
});

app.http("approveDocument", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "documents/approve",
  handler: approveDocument,
});

app.http("getDocumentsByStatus", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "documents/status/{status}",
  handler: getDocumentsByStatus,
});

app.http("getUserDocuments", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "documents/user/{userId}",
  handler: getUserDocuments,
});

app.http("deleteDocument", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "documents/{id}",
  handler: deleteDocument,
});
