import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDbService } from "../services/cosmosDb";
import { ChatMessage } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Получить сообщения чата документа
export async function getChatMessages(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.documentId;
    const messages = await cosmosDbService.queryItems<ChatMessage>(
      'chats',
      'SELECT * FROM c WHERE c.documentId = @documentId ORDER BY c.createdAt ASC',
      [{ name: '@documentId', value: documentId }]
    );

    return {
      status: 200,
      body: JSON.stringify(messages)
    };
  } catch (error) {
    context.error('Error getting chat messages:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get chat messages' })
    };
  }
}

// Отправить сообщение в чат
export async function sendChatMessage(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const { documentId, senderId, content } = await req.json();
    
    if (!documentId || !senderId || !content) {
      return {
        status: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const message: ChatMessage = {
      id: uuidv4(),
      documentId,
      senderId,
      content,
      createdAt: new Date().toISOString()
    };

    const createdMessage = await cosmosDbService.createItem<ChatMessage>('chats', message);

    return {
      status: 201,
      body: JSON.stringify(createdMessage)
    };
  } catch (error) {
    context.error('Error sending chat message:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to send chat message' })
    };
  }
}

// Удалить сообщение из чата
export async function deleteChatMessage(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const messageId = req.params.messageId;
    await cosmosDbService.deleteItem('chats', messageId);

    return {
      status: 204
    };
  } catch (error) {
    context.error('Error deleting chat message:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to delete chat message' })
    };
  }
}

// Получить последние сообщения чата
export async function getRecentChatMessages(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const documentId = req.params.documentId;
    const limit = parseInt(req.query.get('limit') || '50');
    
    const messages = await cosmosDbService.queryItems<ChatMessage>(
      'chats',
      'SELECT * FROM c WHERE c.documentId = @documentId ORDER BY c.createdAt DESC OFFSET 0 LIMIT @limit',
      [
        { name: '@documentId', value: documentId },
        { name: '@limit', value: limit }
      ]
    );

    // Вернуть в правильном порядке (от старых к новым)
    const sortedMessages = messages.reverse();

    return {
      status: 200,
      body: JSON.stringify(sortedMessages)
    };
  } catch (error) {
    context.error('Error getting recent chat messages:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get recent chat messages' })
    };
  }
}

// Регистрация HTTP триггеров
app.http("getChatMessages", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "chat/{documentId}/messages",
  handler: getChatMessages,
});

app.http("sendChatMessage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "chat/messages",
  handler: sendChatMessage,
});

app.http("deleteChatMessage", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "chat/messages/{messageId}",
  handler: deleteChatMessage,
});

app.http("getRecentChatMessages", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "chat/{documentId}/messages/recent",
  handler: getRecentChatMessages,
});
