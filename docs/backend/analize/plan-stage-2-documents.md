## Этап 2 — Документы

Статус: 0% выполнено

### Компоненты и страницы:
- **API документов:** `/src/entities/document/api/documentsApi.ts`
- **Хук документов:** `/src/entities/document/model/useDocuments.ts`
- **Страницы документов:** `/src/pages/documents/ui/FirmSide2Page.tsx`, `/src/pages/documents/ui/BaseDocumentsPage.tsx`
- **Компоненты:** `/src/pages/documents/components/UploadForm.tsx`, `/src/pages/documents/components/DocumentsTable.tsx`
- **Виджеты:** `/src/widgets/documentList/ui/DocumentList.tsx`

- [ ] API `documentsApi` (CRUD, фильтры)
- [ ] Загрузка/скачивание файлов
- [ ] Хук `useDocuments`
- [ ] Интеграция в `FirmSide2Page`
- [ ] Drag&Drop загрузка и прогресс

### 2.2 Документы API
```typescript
// /src/entities/document/api/documentsApi.ts
// см. спецификацию в общем плане: методы getDocuments/getDocument/create/update/delete/approve/reject/sign/history/chat
```

### 2.3 Хук для документов
```typescript
// /src/entities/document/model/useDocuments.ts
// см. общий план: состояние, загрузка, error, fetch/create/update/delete/approve/reject
```

### 2.4 Интеграция страницы документов
```typescript
// /src/pages/documents/ui/FirmSide2Page.tsx
// подключение useDocuments, замена моков, обработка загрузки/ошибок
```

Источник: детали и примеры — `api-integration-plan.md`.


