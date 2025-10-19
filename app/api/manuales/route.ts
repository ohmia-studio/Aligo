'use server';

import { getAllManuals } from '@/features/manuals/actions/listManuals';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await getAllManuals();
    const manuals = res.data ?? [];
    return NextResponse.json({ manuals }, { status: res.status ?? 200 });
  } catch (err) {
    console.error('API /api/manuales GET error:', err);
    return NextResponse.json(
      { error: 'Error obteniendo manuales' },
      { status: 500 }
    );
  }
}
