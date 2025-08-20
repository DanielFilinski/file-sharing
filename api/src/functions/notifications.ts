import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { serviceBusService } from "../services/serviceBus";
import { signalRService } from "../services/signalR";
import { NotificationEvent } from "../types";

// Отправить уведомление о загрузке документа
export async function notifyDocumentUploaded(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { documentId, authorId, approverId, title } = await req.json();
    
    const event: NotificationEvent = {
      type: 'document_uploaded',
      userId: approverId,
      data: {
        documentId,
        authorId,
        title,
        message: `Новый документ "${title}" требует вашего одобрения`
      },
      timestamp: new Date().toISOString()
    };

    // Отправить в Service Bus
    await serviceBusService.sendDocumentEvent(event);
    
    // Отправить через SignalR
    await signalRService.sendToUser(approverId, event);

    return {
      status: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    context.error('Error sending document upload notification:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
}

// Отправить уведомление об одобрении документа
export async function notifyDocumentApproved(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { documentId, authorId, approverId, title, status } = await req.json();
    
    const event: NotificationEvent = {
      type: status === 'approved' ? 'document_approved' : 'document_rejected',
      userId: authorId,
      data: {
        documentId,
        approverId,
        title,
        status,
        message: status === 'approved' 
          ? `Документ "${title}" одобрен`
          : `Документ "${title}" отклонен`
      },
      timestamp: new Date().toISOString()
    };

    // Отправить в Service Bus
    await serviceBusService.sendDocumentEvent(event);
    
    // Отправить через SignalR
    await signalRService.sendToUser(authorId, event);

    return {
      status: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    context.error('Error sending document approval notification:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
}

// Отправить уведомление о добавлении пользователя
export async function notifyUserAdded(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { userId, userData, addedBy } = await req.json();
    
    const event: NotificationEvent = {
      type: 'user_added',
      userId: addedBy,
      data: {
        userId,
        userData,
        message: `Пользователь ${userData.firstName} ${userData.lastName} добавлен в систему`
      },
      timestamp: new Date().toISOString()
    };

    // Отправить в Service Bus
    await serviceBusService.sendUserEvent(event);
    
    // Отправить через SignalR всем администраторам
    await signalRService.sendToGroup('admins', event);

    return {
      status: 200,
      body: JSON.stringify({ message: 'Notification sent successfully' })
    };
  } catch (error) {
    context.error('Error sending user added notification:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to send notification' })
    };
  }
}

// Получить URL для подключения к SignalR
export async function getSignalRConnectionUrl(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const userId = req.query.get('userId');
    
    if (!userId) {
      return {
        status: 400,
        body: JSON.stringify({ error: 'userId is required' })
      };
    }

    const url = await signalRService.serviceClient.getClientAccessUrl({
      userId: userId,
      expiresAfterSeconds: 3600 // 1 час
    });

    return {
      status: 200,
      body: JSON.stringify({ url })
    };
  } catch (error) {
    context.error('Error getting SignalR connection URL:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get connection URL' })
    };
  }
}

// Регистрация HTTP триггеров
app.http("notifyDocumentUploaded", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "notifications/document-uploaded",
  handler: notifyDocumentUploaded,
});

app.http("notifyDocumentApproved", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "notifications/document-approved",
  handler: notifyDocumentApproved,
});

app.http("notifyUserAdded", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "notifications/user-added",
  handler: notifyUserAdded,
});

app.http("getSignalRConnectionUrl", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "notifications/signalr-url",
  handler: getSignalRConnectionUrl,
});
