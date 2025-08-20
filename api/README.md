# File Sharing API

Azure Functions API для системы обмена документами в MS Teams.

## Архитектура

- **Azure Functions v4** с TypeScript
- **Cosmos DB** для хранения пользователей, документов и чатов
- **Azure Blob Storage** для хранения файлов
- **Azure Service Bus** для асинхронных уведомлений
- **Azure SignalR** для реалтайм коммуникации
- **Azure AD B2C** для аутентификации

## Установка и запуск

### Предварительные требования

1. Node.js 18+ 
2. Azure Functions Core Tools
3. Azure CLI
4. Локальные ресурсы Azure (для разработки)

### Установка зависимостей

```bash
npm install
```

### Настройка переменных окружения

Скопируйте `local.settings.json` и заполните необходимые переменные:

```json
{
  "IsEncrypted": false,
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "M365_CLIENT_ID": "your-app-client-id",
    "M365_CLIENT_SECRET": "your-app-client-secret",
    "M365_TENANT_ID": "your-tenant-id",
    "M365_AUTHORITY_HOST": "https://login.microsoftonline.com",
    "COSMOS_DB_ENDPOINT": "your-cosmos-db-endpoint",
    "COSMOS_DB_KEY": "your-cosmos-db-key",
    "COSMOS_DB_DATABASE_ID": "file-sharing-db",
    "AZURE_STORAGE_CONNECTION_STRING": "your-storage-connection-string",
    "BLOB_CONTAINER_NAME": "documents",
    "SERVICE_BUS_CONNECTION_STRING": "your-service-bus-connection-string",
    "SIGNALR_CONNECTION_STRING": "your-signalr-connection-string"
  }
}
```

### Локальный запуск

```bash
npm run dev
```

API будет доступен по адресу: `http://localhost:7071`

## API Endpoints

### Аутентификация
- `GET /api/getUserProfile` - Получить профиль пользователя

### Пользователи
- `GET /api/users` - Получить всех пользователей
- `GET /api/users/{id}` - Получить пользователя по ID
- `POST /api/users/employees` - Создать сотрудника
- `POST /api/users/clients` - Создать клиента
- `PUT /api/users/{id}` - Обновить пользователя
- `DELETE /api/users/{id}` - Удалить пользователя

### Отделы
- `GET /api/departments` - Получить все отделы
- `POST /api/departments` - Создать отдел

### Документы
- `GET /api/documents` - Получить все документы
- `GET /api/documents/{id}` - Получить документ по ID
- `POST /api/documents` - Создать документ
- `POST /api/documents/{id}/upload` - Загрузить файл документа
- `GET /api/documents/{id}/download` - Скачать файл документа
- `POST /api/documents/approve` - Одобрить/отклонить документ
- `GET /api/documents/status/{status}` - Получить документы по статусу
- `GET /api/documents/user/{userId}` - Получить документы пользователя
- `DELETE /api/documents/{id}` - Удалить документ

### Чат
- `GET /api/chat/{documentId}/messages` - Получить сообщения чата
- `POST /api/chat/messages` - Отправить сообщение
- `DELETE /api/chat/messages/{messageId}` - Удалить сообщение
- `GET /api/chat/{documentId}/messages/recent` - Получить последние сообщения

### Уведомления
- `POST /api/notifications/document-uploaded` - Уведомление о загрузке документа
- `POST /api/notifications/document-approved` - Уведомление об одобрении документа
- `POST /api/notifications/user-added` - Уведомление о добавлении пользователя
- `GET /api/notifications/signalr-url` - Получить URL для SignalR

## Развертывание в Azure

### 1. Создание ресурсов Azure

```bash
# Создать группу ресурсов
az group create --name file-sharing-rg --location eastus

# Создать Storage Account
az storage account create --name filesharingstorage --resource-group file-sharing-rg --location eastus --sku Standard_LRS

# Создать Cosmos DB
az cosmosdb create --name file-sharing-cosmos --resource-group file-sharing-rg --capabilities EnableServerless

# Создать Service Bus
az servicebus namespace create --name file-sharing-sb --resource-group file-sharing-rg --location eastus --sku Standard

# Создать SignalR
az signalr create --name file-sharing-signalr --resource-group file-sharing-rg --location eastus --sku Standard_S1
```

### 2. Настройка Function App

```bash
# Создать Function App
az functionapp create --name file-sharing-api --resource-group file-sharing-rg --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --storage-account filesharingstorage --os-type Linux

# Настроить переменные окружения
az functionapp config appsettings set --name file-sharing-api --resource-group file-sharing-rg --settings COSMOS_DB_ENDPOINT="your-cosmos-endpoint" COSMOS_DB_KEY="your-cosmos-key" AZURE_STORAGE_CONNECTION_STRING="your-storage-connection-string" SERVICE_BUS_CONNECTION_STRING="your-service-bus-connection-string" SIGNALR_CONNECTION_STRING="your-signalr-connection-string"
```

### 3. Развертывание

```bash
# Сборка проекта
npm run build

# Развертывание
func azure functionapp publish file-sharing-api
```

## Структура проекта

```
api/
├── src/
│   ├── functions/          # Azure Functions
│   │   ├── getUserProfile.ts
│   │   ├── users.ts
│   │   ├── documents.ts
│   │   ├── chat.ts
│   │   └── notifications.ts
│   ├── services/           # Сервисы для работы с Azure
│   │   ├── cosmosDb.ts
│   │   ├── blobStorage.ts
│   │   ├── serviceBus.ts
│   │   └── signalR.ts
│   ├── middleware/         # Middleware
│   │   └── auth.ts
│   ├── types/              # TypeScript типы
│   │   └── index.ts
│   └── config.ts           # Конфигурация
├── package.json
├── tsconfig.json
└── local.settings.json
```

## Безопасность

- Все endpoints (кроме getUserProfile) требуют аутентификации
- Используется Azure AD B2C для аутентификации
- JWT токены валидируются в каждом запросе
- CORS настроен для работы с MS Teams

## Мониторинг

- Application Insights автоматически включен
- Логирование всех операций
- Метрики производительности
- Алерты на ошибки

## Разработка

### Добавление новой функции

1. Создайте файл в `src/functions/`
2. Экспортируйте функцию
3. Зарегистрируйте HTTP триггер
4. Добавьте аутентификацию если необходимо

### Тестирование

```bash
# Запуск тестов
npm test

# Локальное тестирование
curl -X GET http://localhost:7071/api/users
```
