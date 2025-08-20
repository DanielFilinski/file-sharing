# File Sharing MS Teams App

Приложение для обмена документами в Microsoft Teams с системой одобрения и реалтайм уведомлениями.

## Архитектура

### Frontend
- **React 18** с TypeScript
- **Fluent UI** для интерфейса в стиле Microsoft
- **React Router** для навигации
- **Feature-Sliced Design** архитектура

### Backend
- **Azure Functions v4** с TypeScript
- **Cosmos DB** для хранения данных
- **Azure Blob Storage** для файлов
- **Azure Service Bus** для уведомлений
- **Azure SignalR** для реалтайм коммуникации
- **Azure AD B2C** для аутентификации

## Быстрый старт

### Предварительные требования

1. **Node.js 18+**
2. **Azure Functions Core Tools**
3. **Azure CLI**
4. **Teams Toolkit** (опционально)

### Установка

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd file-sharing
```

2. **Установка зависимостей**
```bash
# Frontend
npm install

# Backend
cd api
npm install
cd ..
```

3. **Настройка переменных окружения**

Создайте файл `.env` в корне проекта:
```env
REACT_APP_API_URL=http://localhost:7071/api
```

Настройте `api/local.settings.json`:
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
    "COSMOS_DB_ENDPOINT": "your-cosmos-endpoint",
    "COSMOS_DB_KEY": "your-cosmos-key",
    "AZURE_STORAGE_CONNECTION_STRING": "your-storage-connection-string",
    "SERVICE_BUS_CONNECTION_STRING": "your-service-bus-connection-string",
    "SIGNALR_CONNECTION_STRING": "your-signalr-connection-string"
  }
}
```

### Запуск

1. **Запуск API**
```bash
cd api
npm run dev
```

2. **Запуск Frontend**
```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

## Функциональность

### Управление пользователями
- ✅ Создание сотрудников и клиентов
- ✅ Управление отделами
- ✅ Роли и классификации

### Управление документами
- ✅ Загрузка и скачивание файлов
- ✅ Система одобрения документов
- ✅ Статусы документов (черновик, на рассмотрении, одобрен, отклонен)
- ✅ Поиск и фильтрация

### Чат документов
- ✅ Реалтайм обсуждение документов
- ✅ История сообщений
- ✅ Удаление сообщений

### Уведомления
- ✅ Реалтайм уведомления через SignalR
- ✅ Уведомления о загрузке документов
- ✅ Уведомления об одобрении/отклонении
- ✅ Уведомления о новых пользователях

### Безопасность
- ✅ Аутентификация через Azure AD
- ✅ Авторизация на основе ролей
- ✅ Валидация JWT токенов

## API Endpoints

### Аутентификация
- `GET /api/getUserProfile` - Профиль пользователя

### Пользователи
- `GET /api/users` - Список пользователей
- `POST /api/users/employees` - Создать сотрудника
- `POST /api/users/clients` - Создать клиента
- `PUT /api/users/{id}` - Обновить пользователя
- `DELETE /api/users/{id}` - Удалить пользователя

### Документы
- `GET /api/documents` - Список документов
- `POST /api/documents` - Создать документ
- `POST /api/documents/{id}/upload` - Загрузить файл
- `GET /api/documents/{id}/download` - Скачать файл
- `POST /api/documents/approve` - Одобрить/отклонить

### Чат
- `GET /api/chat/{documentId}/messages` - Сообщения чата
- `POST /api/chat/messages` - Отправить сообщение

### Уведомления
- `POST /api/notifications/document-uploaded` - Уведомление о загрузке
- `POST /api/notifications/document-approved` - Уведомление об одобрении
- `GET /api/notifications/signalr-url` - URL для SignalR

## Развертывание в Azure

### 1. Создание ресурсов

```bash
# Группа ресурсов
az group create --name file-sharing-rg --location eastus

# Storage Account
az storage account create --name filesharingstorage --resource-group file-sharing-rg --location eastus --sku Standard_LRS

# Cosmos DB
az cosmosdb create --name file-sharing-cosmos --resource-group file-sharing-rg --capabilities EnableServerless

# Service Bus
az servicebus namespace create --name file-sharing-sb --resource-group file-sharing-rg --location eastus --sku Standard

# SignalR
az signalr create --name file-sharing-signalr --resource-group file-sharing-rg --location eastus --sku Standard_S1

# Function App
az functionapp create --name file-sharing-api --resource-group file-sharing-rg --consumption-plan-location eastus --runtime node --runtime-version 18 --functions-version 4 --storage-account filesharingstorage --os-type Linux
```

### 2. Настройка переменных окружения

```bash
az functionapp config appsettings set --name file-sharing-api --resource-group file-sharing-rg --settings COSMOS_DB_ENDPOINT="your-cosmos-endpoint" COSMOS_DB_KEY="your-cosmos-key" AZURE_STORAGE_CONNECTION_STRING="your-storage-connection-string" SERVICE_BUS_CONNECTION_STRING="your-service-bus-connection-string" SIGNALR_CONNECTION_STRING="your-signalr-connection-string"
```

### 3. Развертывание

```bash
# Backend
cd api
npm run build
func azure functionapp publish file-sharing-api

# Frontend
npm run build
# Развернуть в Azure Static Web Apps или другой хостинг
```

## Разработка

### Структура проекта

```
file-sharing/
├── api/                    # Azure Functions Backend
│   ├── src/
│   │   ├── functions/      # HTTP триггеры
│   │   ├── services/       # Сервисы Azure
│   │   ├── middleware/     # Middleware
│   │   └── types/          # TypeScript типы
│   └── package.json
├── src/
│   ├── entities/           # Бизнес-сущности
│   ├── features/           # Функциональные модули
│   ├── pages/              # Страницы приложения
│   ├── components/         # UI компоненты
│   └── shared/             # Общие утилиты
└── package.json
```

### Добавление новой функции

1. Создайте функцию в `api/src/functions/`
2. Добавьте соответствующий хук в `src/entities/`
3. Создайте UI компоненты
4. Добавьте страницу в `src/pages/`

### Тестирование

```bash
# Backend тесты
cd api
npm test

# Frontend тесты
npm test
```

## Лицензия

MIT License

## Поддержка

Для вопросов и поддержки создайте issue в репозитории.
