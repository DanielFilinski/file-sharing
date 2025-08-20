#!/bin/bash

# Базовый URL API
API_URL="http://localhost:7071/api"

echo "🧪 Тестирование File Sharing API"
echo "=================================="

# Тест 1: Получить профиль пользователя (требует токен)
echo "1. Тест getUserProfile (требует токен):"
curl -X GET "$API_URL/getUserProfile" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 2: Создать отдел
echo "2. Тест создания отдела:"
curl -X POST "$API_URL/departments" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "IT Department",
    "description": "Information Technology Department"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 3: Получить все отделы
echo "3. Тест получения отделов:"
curl -X GET "$API_URL/departments" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 4: Создать сотрудника
echo "4. Тест создания сотрудника:"
curl -X POST "$API_URL/users/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "classification": "Senior",
    "office": "New York",
    "role": "Software Engineer",
    "department": "IT"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 5: Создать клиента
echo "5. Тест создания клиента:"
curl -X POST "$API_URL/users/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "email": "jane.smith@client.com",
    "firmName": "Smith & Associates",
    "firmAddress": "123 Business St, New York, NY"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 6: Получить всех пользователей
echo "6. Тест получения пользователей:"
curl -X GET "$API_URL/users" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 7: Создать документ
echo "7. Тест создания документа:"
curl -X POST "$API_URL/documents" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Document",
    "content": "This is a test document content",
    "authorId": "test-author-id",
    "approverId": "test-approver-id"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 8: Получить все документы
echo "8. Тест получения документов:"
curl -X GET "$API_URL/documents" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 9: Отправить сообщение в чат
echo "9. Тест отправки сообщения в чат:"
curl -X POST "$API_URL/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "test-document-id",
    "senderId": "test-sender-id",
    "content": "Hello, this is a test message!"
  }' \
  -w "\nHTTP Status: %{http_code}\n\n"

# Тест 10: Получить URL для SignalR
echo "10. Тест получения SignalR URL:"
curl -X GET "$API_URL/notifications/signalr-url?userId=test-user-id" \
  -H "Content-Type: application/json" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo "✅ Тестирование завершено!"
