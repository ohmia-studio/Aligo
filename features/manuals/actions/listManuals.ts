import { getManuals } from '../manualRepository';

export async function getAllManuals() {
  const { data, error, status, message } = await getManuals();
  return { data: data ?? [], status: status ?? (error ? 500 : 200), message };
}
