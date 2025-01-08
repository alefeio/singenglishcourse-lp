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
    <html lang="pt-BR">
      <body className="bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={100}
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-xl">Admin Panel</span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:underline">
              Voltar ao site
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Layout com menu lateral e conteúdo */}
        <div className="min-h-screen flex">
          <aside className="w-64 bg-white hidden md:flex flex-col">
            <nav className="flex-1 p-4 space-y-2">
              <Link
                href="/admin"
                className="block px-2 py-2 rounded hover:bg-gray-200"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/banners"
                className="block px-2 py-2 rounded hover:bg-gray-200"
              >
                Banners
              </Link>
            </nav>
          </aside>

          <main className="flex-1 p-4">{children}</main>
        </div>
      </body>
    </html>
  )
}
