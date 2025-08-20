import { useState, useEffect, useCallback } from 'react';
import type { Employee, Client, Department } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:7071/api';

export const useUsers = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка данных при инициализации
  useEffect(() => {
    loadUsers();
    loadDepartments();
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [employeesResponse, clientsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/users?type=employee`),
        fetch(`${API_BASE_URL}/users?type=client`)
      ]);

      if (employeesResponse.ok) {
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData);
      }

      if (clientsResponse.ok) {
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
      }
    } catch (err) {
      setError('Ошибка загрузки пользователей');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDepartments = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      if (response.ok) {
        const departmentsData = await response.json();
        setDepartments(departmentsData);
      }
    } catch (err) {
      console.error('Error loading departments:', err);
    }
  }, []);

  const addEmployee = async (employee: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees(prev => [...prev, newEmployee]);
        return newEmployee;
      } else {
        throw new Error('Ошибка создания сотрудника');
      }
    } catch (err) {
      setError('Ошибка создания сотрудника');
      console.error('Error adding employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, updates: Partial<Employee>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedEmployee = await response.json();
        setEmployees(prev => prev.map(emp => emp.id === id ? updatedEmployee : emp));
        return updatedEmployee;
      } else {
        throw new Error('Ошибка обновления сотрудника');
      }
    } catch (err) {
      setError('Ошибка обновления сотрудника');
      console.error('Error updating employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
      } else {
        throw new Error('Ошибка удаления сотрудника');
      }
    } catch (err) {
      setError('Ошибка удаления сотрудника');
      console.error('Error deleting employee:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });

      if (response.ok) {
        const newClient = await response.json();
        setClients(prev => [...prev, newClient]);
        return newClient;
      } else {
        throw new Error('Ошибка создания клиента');
      }
    } catch (err) {
      setError('Ошибка создания клиента');
      console.error('Error adding client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedClient = await response.json();
        setClients(prev => prev.map(client => client.id === id ? updatedClient : client));
        return updatedClient;
      } else {
        throw new Error('Ошибка обновления клиента');
      }
    } catch (err) {
      setError('Ошибка обновления клиента');
      console.error('Error updating client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClients(prev => prev.filter(client => client.id !== id));
      } else {
        throw new Error('Ошибка удаления клиента');
      }
    } catch (err) {
      setError('Ошибка удаления клиента');
      console.error('Error deleting client:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addDepartment = async (department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(department),
      });

      if (response.ok) {
        const newDepartment = await response.json();
        setDepartments(prev => [...prev, newDepartment]);
        return newDepartment;
      } else {
        throw new Error('Ошибка создания отдела');
      }
    } catch (err) {
      setError('Ошибка создания отдела');
      console.error('Error adding department:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    employees,
    clients,
    departments,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addClient,
    updateClient,
    deleteClient,
    addDepartment,
    refreshUsers: loadUsers,
    refreshDepartments: loadDepartments
  };
}; 