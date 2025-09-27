import { NextResponse } from "next/server";
import { registrarEmpleadoPersona } from "@/features/auth/empleado"; // tu modelo

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validación mínima
    const { dni, email, nombre, apellido } = body;
    if (!dni || !email || !nombre || !apellido) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Llamada al modelo para insertar en Supabase
    const empleadoCreado = await registrarEmpleadoPersona({
      dni,
      email,
      nombre,
      apellido,
    });

    return NextResponse.json({ ok: true, empleado: empleadoCreado }, { status: 200 });
  } catch (error: any) {
    console.error("Error en alta-empleado route:", error);
    return NextResponse.json({ error: error.message || "Error interno" }, { status: 500 });
  }
}
