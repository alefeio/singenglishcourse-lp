'use client' // Se for usar React hooks (estado, etc.) dentro do componente

import React from 'react'

export default function Hero() {
  return (
    <section className="bg-blue-600 text-white py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Bem-vindo à Melhor Landing Page
      </h1>
      <p className="text-xl mb-8">
        Desenvolvida com o poderoso Next.js e Tailwind CSS!
      </p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-100">
        Saiba Mais
      </button>
    </section>
  )
}
