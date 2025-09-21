import { NextRequest, NextResponse } from 'next/server'
import { registrarEmpleado } from '@/features/auth/empleado'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre } = body

  try {
    await registrarEmpleado({ nombre })
    return NextResponse.json({ message: 'Empleado registrado correctamente' })
  } catch (error) {
    return NextResponse.json({ message: 'Error al registrar empleado' }, { status: 500 })
  }
}
