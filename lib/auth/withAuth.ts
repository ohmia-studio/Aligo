import { NextResponse } from 'next/server';
import { requireServerAuth } from './requireServerAuth';

type Handler = (
  req: any,
  auth: { user: any; appUser?: any }
) => Promise<Response> | Response;

export function withAuth(
  handler: Handler,
  opts?: { roles?: string[] | string }
) {
  return async function (req: Request) {
    const auth = await requireServerAuth({ allowedRoles: opts?.roles });
    if (!auth.ok) return auth.response as unknown as Response;

    try {
      const result = await handler(req, {
        user: auth.user,
        appUser: auth.appUser,
      });
      return result;
    } catch (err: any) {
      console.error('withAuth handler error:', err);
      return NextResponse.json(
        { error: err?.message || 'Server error' },
        { status: 500 }
      ) as unknown as Response;
    }
  };
}
