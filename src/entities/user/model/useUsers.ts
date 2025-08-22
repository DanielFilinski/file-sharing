import { useState } from 'react';
import type { Employee, Client, Department } from './types';

export const useUsers = () => {
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, firstName: 'John', lastName: 'Smith', classification: 'Manager', office: 'New York', role: 'Operations Manager', department: 'Operations' },
    { id: 2, firstName: 'Sarah', lastName: 'Johnson', classification: 'Senior', office: 'Chicago', role: 'Senior Analyst', department: 'Finance' },
    { id: 3, firstName: 'Mike', lastName: 'Davis', classification: 'Associate', office: 'Los Angeles', role: 'Developer', department: 'IT' }
  ]);

  const [clients, setClients] = useState<Client[]>([
    { id: 1, firstName: 'Robert', lastName: 'Wilson', phone: '(555) 123-4567', email: 'robert.wilson@example.com', firmName: 'Wilson & Associates', firmAddress: '123 Main St, Boston, MA' },
    { id: 2, firstName: 'Lisa', lastName: 'Anderson', phone: '(555) 987-6543', email: 'lisa.anderson@techcorp.com', firmName: 'TechCorp Inc.', firmAddress: '456 Tech Ave, Seattle, WA' }
  ]);

  const [departments, setDepartments] = useState<Department[]>([
    { id: 1, name: 'Operations', description: 'Operations department' },
    { id: 2, name: 'Finance', description: 'Finance department' },
    { id: 3, name: 'IT', description: 'Information Technology department' },
    { id: 4, name: 'HR', description: 'Human Resources department' }
  ]);

  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: Math.max(...employees.map(e => e.id)) + 1 };
    setEmployees(prev => [...prev, newEmployee]);
  };

  const updateEmployee = (id: number, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updates } : emp));
  };

  const deleteEmployee = (id: number) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const addClient = (client: Omit<Client, 'id'>) => {
    const newClient = { ...client, id: Math.max(...clients.map(c => c.id)) + 1 };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: number, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => client.id === id ? { ...client, ...updates } : client));
  };

  const deleteClient = (id: number) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  const addDepartment = (department: Omit<Department, 'id'>) => {
    const newDepartment = { ...department, id: Math.max(...departments.map(d => d.id)) + 1 };
    setDepartments(prev => [...prev, newDepartment]);
  };

  return {
    employees,
    clients,
    departments,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addClient,
    updateClient,
    deleteClient,
    addDepartment
  };
}; 