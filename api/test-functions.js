const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:7071/api';

async function testAPI() {
  console.log('🧪 Тестирование File Sharing API...\n');

  try {
    // Тест 1: Создать отдел
    console.log('1. Создание отдела...');
    const departmentResponse = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'IT Department',
        description: 'Information Technology Department'
      })
    });
    
    if (departmentResponse.ok) {
      const department = await departmentResponse.json();
      console.log('✅ Отдел создан:', department.name);
    } else {
      console.log('❌ Ошибка создания отдела:', departmentResponse.status);
    }

    // Тест 2: Получить отделы
    console.log('\n2. Получение отделов...');
    const departmentsResponse = await fetch(`${API_BASE_URL}/departments`);
    
    if (departmentsResponse.ok) {
      const departments = await departmentsResponse.json();
      console.log('✅ Получено отделов:', departments.length);
    } else {
      console.log('❌ Ошибка получения отделов:', departmentsResponse.status);
    }

    // Тест 3: Создать сотрудника
    console.log('\n3. Создание сотрудника...');
    const employeeResponse = await fetch(`${API_BASE_URL}/users/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@company.com',
        classification: 'Senior',
        office: 'New York',
        role: 'Software Engineer',
        department: 'IT'
      })
    });
    
    if (employeeResponse.ok) {
      const employee = await employeeResponse.json();
      console.log('✅ Сотрудник создан:', `${employee.firstName} ${employee.lastName}`);
    } else {
      console.log('❌ Ошибка создания сотрудника:', employeeResponse.status);
    }

    // Тест 4: Создать клиента
    console.log('\n4. Создание клиента...');
    const clientResponse = await fetch(`${API_BASE_URL}/users/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '+1234567890',
        email: 'jane.smith@client.com',
        firmName: 'Smith & Associates',
        firmAddress: '123 Business St, New York, NY'
      })
    });
    
    if (clientResponse.ok) {
      const client = await clientResponse.json();
      console.log('✅ Клиент создан:', `${client.firstName} ${client.lastName}`);
    } else {
      console.log('❌ Ошибка создания клиента:', clientResponse.status);
    }

    // Тест 5: Получить пользователей
    console.log('\n5. Получение пользователей...');
    const usersResponse = await fetch(`${API_BASE_URL}/users`);
    
    if (usersResponse.ok) {
      const users = await usersResponse.json();
      console.log('✅ Получено пользователей:', users.length);
    } else {
      console.log('❌ Ошибка получения пользователей:', usersResponse.status);
    }

    // Тест 6: Создать документ
    console.log('\n6. Создание документа...');
    const documentResponse = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Document',
        content: 'This is a test document content',
        authorId: 'test-author-id',
        approverId: 'test-approver-id'
      })
    });
    
    if (documentResponse.ok) {
      const document = await documentResponse.json();
      console.log('✅ Документ создан:', document.title);
    } else {
      console.log('❌ Ошибка создания документа:', documentResponse.status);
    }

    // Тест 7: Получить документы
    console.log('\n7. Получение документов...');
    const documentsResponse = await fetch(`${API_BASE_URL}/documents`);
    
    if (documentsResponse.ok) {
      const documents = await documentsResponse.json();
      console.log('✅ Получено документов:', documents.length);
    } else {
      console.log('❌ Ошибка получения документов:', documentsResponse.status);
    }

    // Тест 8: Получить SignalR URL
    console.log('\n8. Получение SignalR URL...');
    const signalRResponse = await fetch(`${API_BASE_URL}/notifications/signalr-url?userId=test-user-id`);
    
    if (signalRResponse.ok) {
      const signalRData = await signalRResponse.json();
      console.log('✅ SignalR URL получен:', signalRData.url ? 'Да' : 'Нет');
    } else {
      console.log('❌ Ошибка получения SignalR URL:', signalRResponse.status);
    }

    console.log('\n✅ Тестирование завершено!');

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error.message);
  }
}

// Запуск тестов
testAPI();
