// app/admin/layout.tsx
'use client' // Se quiser incluir botões interativos (como "Sair"), use client

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  function handleLogout() {
    // Exemplo de logout
    router.push('/login')
  }

  return (
    <div className="bg-gray-100">
      {/* Layout com menu lateral e conteúdo */}
      <div className="min-h-screen flex">
        <aside className="w-64 bg-white hidden md:flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/admin"
              className="block px-2 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/banners"
              className="block px-2 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Banners
            </Link>
            <Link
              href="/admin/lp"
              className="block px-2 py-2 rounded bg-gray-100 hover:bg-gray-200"
            >
              Landing Page
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              Sair
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  )
}
