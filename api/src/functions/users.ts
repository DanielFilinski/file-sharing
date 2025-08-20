import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { cosmosDbService } from "../services/cosmosDb";
import { User, Employee, Client, Department } from "../types";
import { v4 as uuidv4 } from 'uuid';

// Получить всех пользователей
export async function getUsers(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const users = await cosmosDbService.queryItems<User>(
      'users',
      'SELECT * FROM c WHERE c.type = "user"'
    );

    return {
      status: 200,
      body: JSON.stringify(users)
    };
  } catch (error) {
    context.error('Error getting users:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get users' })
    };
  }
}

// Получить пользователя по ID
export async function getUserById(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const userId = req.params.id;
    const user = await cosmosDbService.getItem<User>('users', userId);

    if (!user) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    return {
      status: 200,
      body: JSON.stringify(user)
    };
  } catch (error) {
    context.error('Error getting user:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get user' })
    };
  }
}

// Создать сотрудника
export async function createEmployee(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'> = await req.json();
    
    const employee: Employee = {
      ...employeeData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdEmployee = await cosmosDbService.createItem<Employee>('users', employee);

    return {
      status: 201,
      body: JSON.stringify(createdEmployee)
    };
  } catch (error) {
    context.error('Error creating employee:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to create employee' })
    };
  }
}

// Создать клиента
export async function createClient(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'> = await req.json();
    
    const client: Client = {
      ...clientData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdClient = await cosmosDbService.createItem<Client>('users', client);

    return {
      status: 201,
      body: JSON.stringify(createdClient)
    };
  } catch (error) {
    context.error('Error creating client:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to create client' })
    };
  }
}

// Обновить пользователя
export async function updateUser(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const userId = req.params.id;
    const updateData = await req.json();
    
    const existingUser = await cosmosDbService.getItem<User>('users', userId);
    if (!existingUser) {
      return {
        status: 404,
        body: JSON.stringify({ error: 'User not found' })
      };
    }

    const updatedUser = {
      ...existingUser,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    const result = await cosmosDbService.updateItem<User>('users', userId, updatedUser);

    return {
      status: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    context.error('Error updating user:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to update user' })
    };
  }
}

// Удалить пользователя
export async function deleteUser(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const userId = req.params.id;
    await cosmosDbService.deleteItem('users', userId);

    return {
      status: 204
    };
  } catch (error) {
    context.error('Error deleting user:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to delete user' })
    };
  }
}

// Получить все отделы
export async function getDepartments(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const departments = await cosmosDbService.queryItems<Department>(
      'users',
      'SELECT * FROM c WHERE c.type = "department"'
    );

    return {
      status: 200,
      body: JSON.stringify(departments)
    };
  } catch (error) {
    context.error('Error getting departments:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to get departments' })
    };
  }
}

// Создать отдел
export async function createDepartment(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const departmentData: Omit<Department, 'id' | 'createdAt' | 'updatedAt'> = await req.json();
    
    const department: Department = {
      ...departmentData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdDepartment = await cosmosDbService.createItem<Department>('users', department);

    return {
      status: 201,
      body: JSON.stringify(createdDepartment)
    };
  } catch (error) {
    context.error('Error creating department:', error);
    return {
      status: 500,
      body: JSON.stringify({ error: 'Failed to create department' })
    };
  }
}

// Регистрация HTTP триггеров
app.http("getUsers", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "users",
  handler: getUsers,
});

app.http("getUserById", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "users/{id}",
  handler: getUserById,
});

app.http("createEmployee", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "users/employees",
  handler: createEmployee,
});

app.http("createClient", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "users/clients",
  handler: createClient,
});

app.http("updateUser", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "users/{id}",
  handler: updateUser,
});

app.http("deleteUser", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "users/{id}",
  handler: deleteUser,
});

app.http("getDepartments", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "departments",
  handler: getDepartments,
});

app.http("createDepartment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "departments",
  handler: createDepartment,
});
