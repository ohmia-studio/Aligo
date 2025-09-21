'use client'

import { useState } from 'react'

export default function AltaEmpleadoPage() {
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('http://localhost:3000/api/empleados/alta-empleado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    })

    const data = await res.json()
    setMensaje(data.message)
    if (res.ok) setNombre('')
  }

  return (
    <div className="p-8">
      <h1>Alta de Empleado</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          required
        />
        <button type="submit">Guardar</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  )
}
