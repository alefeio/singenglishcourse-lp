// app/admin/HeaderAdmin.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HeaderAdmin() {
  const router = useRouter()

  function handleLogout() {
    // signOut(auth) ...
    router.push('/login')
  }

  return (
    <header className="bg-white shadow p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Image
          src="/images/logo.png"
          alt="Logo"
          width={120}
          height={40}
          className="object-contain"
        />
        <span className="font-bold text-xl">Admin Panel</span>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className="text-blue-600 hover:underline">
          Ir para o site
        </Link>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Sair
        </button>
      </div>
    </header>
  )
}
