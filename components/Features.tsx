'use client'

import React from 'react'

export default function Features() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-semibold mb-8">Principais Recursos</h2>

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Velocidade</h3>
          <p>Aproveite o melhor desempenho do Next.js.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Escalabilidade</h3>
          <p>Arquitetura poderosa para crescer o seu projeto.</p>
        </div>
        <div className="p-4 border border-gray-200 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Tailwind</h3>
          <p>Estilize tudo de forma rápida e fácil.</p>
        </div>
      </div>
    </section>
  )
}
