import { getWorkers } from './employeeRepository';
export async function getAllWorkers() {
  const { data, status, message } = await getWorkers();
  return { data, status, message };
}
