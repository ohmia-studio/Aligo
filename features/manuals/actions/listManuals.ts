'use server';

import { requireServerAuth } from '@/lib/auth/requireServerAuth';
import { getManuals } from '../manualRepository';

export async function getAllManuals() {
  const auth = await requireServerAuth({ allowedRoles: ['admin', 'empleado'] });
  if (!auth.ok) {
    return { data: [], status: 401, message: 'Unauthorized' };
  }

  const { data, error, status, message } = await getManuals();
  return { data: data ?? [], status: status ?? (error ? 500 : 200), message };
}
