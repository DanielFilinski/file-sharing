# AZURE FUNCTIONS ARCHITECTURE OVERVIEW

Статус: 10% — базовая структура `api/` (Functions v4, TypeScript) есть; остальная реализация отсутствует

## Стек (адаптация под Node/TS Azure Functions)

- Frontend (React, уже в `src/`)
- Azure Functions (HTTP Triggers, Service Bus Triggers, Durable Orchestrations) — каталог `api/`
- Cosmos DB (документы/чаты) + Azure SQL (пользователи/роли)
- Azure Blob Storage (файлы) + CDN
- Azure Service Bus (асинхронные события)
- Azure SignalR Service (реалтайм)
- Redis Cache (кэширование, опционально)
- Application Insights (логирование/метрики)

## Ключевые решения

- Бэкенд только на Azure Functions (без выделенных VM/K8s)
- HTTP-триггеры для API, выходные биндинги для SignalR/Service Bus, SDK для Blob/Cosmos/SQL
- Durable Functions (пакет `durable-functions`) для согласований
- Аутентификация: Azure AD B2C + валидация JWT в каждом HTTP-триггере

## Высокоуровневый поток

Frontend → HTTP Trigger (Functions) → CosmosDB/Azure SQL → Blob Storage → Service Bus → SignalR


