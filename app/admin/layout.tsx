'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX, FiHome, FiImage, FiFileText, FiLogOut, FiSettings } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const router = useRouter();

  function handleLogout() {
    router.push('/login');
  }

  const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

  return (
    <div className="bg-gray-100">
      <div className="min-h-screen flex">
        {/* Menu lateral */}
        <aside
          className={`${isMenuCollapsed ? 'w-16' : 'w-64'
            } bg-white hidden md:flex flex-col transition-all duration-300`}
        >
          {/* Cabeçalho do menu */}
          <div className="flex items-center justify-between px-4 py-4 border-b">
            {!isMenuCollapsed && <h1 className="text-lg font-bold">Admin</h1>}
            <button
              onClick={toggleMenu}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
            >
              {isMenuCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          {/* Links do menu */}
          <nav className="flex-1 px-2 py-4 space-y-2">
            <Link
              href="/admin"
              className="flex items-center gap-4 px-2 py-2 rounded hover:bg-gray-100"
            >
              <FiHome size={20} />
              {!isMenuCollapsed && <span>Dashboard</span>}
            </Link>
            <Link
              href="/admin/banners"
              className="flex items-center gap-4 px-2 py-2 rounded hover:bg-gray-100"
            >
              <FiImage size={20} />
              {!isMenuCollapsed && <span>Banners</span>}
            </Link>
            <Link
              href="/admin/pages"
              className="flex items-center gap-4 px-2 py-2 rounded hover:bg-gray-100"
            >
              <FiFileText size={20} />
              {!isMenuCollapsed && <span>Páginas</span>}
            </Link>
            <Link
              href="/admin/configurations"
              className="flex items-center gap-4 px-2 py-2 rounded hover:bg-gray-100"
            >
              <FiSettings size={20} />
              {!isMenuCollapsed && <span>Configurações</span>}
            </Link>

            {/* Botão de logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-4 py-2 text-white bg-red-600 hover:bg-red-700 transition-colors w-full"
            >
              <FiLogOut size={20} />
              {!isMenuCollapsed && <span>Sair</span>}
            </button>
          </nav>
        </aside>

        {/* Conteúdo principal */}
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
