'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para verificar se o usuário está logado
  const router = useRouter();

  // Simula a verificação de login (substitua com sua lógica real)
  useEffect(() => {
    // Aqui você pode verificar o estado de autenticação, como um token no localStorage ou contexto
    const token = localStorage.getItem('authToken'); // Substitua pela lógica real
    setIsLoggedIn(!!token); // Define o estado com base no token
  }, []);

  const handleLogout = () => {
    // Lógica para deslogar o usuário
    localStorage.removeItem('authToken'); // Substitua pelo seu método de logout
    setIsLoggedIn(false);
    router.push('/login'); // Redireciona para a página de login
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Menu para desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <Link href="#features" scroll={false} className="hover:text-blue-600">
            Recursos
          </Link>
          <Link href="#pricing" scroll={false} className="hover:text-blue-600">
            Preços
          </Link>
          <Link href="#testimonials" scroll={false} className="hover:text-blue-600">
            Depoimentos
          </Link>
        </nav>

        {/* Botão CTA para desktop */}
        {/* <Link
          href="#cta-final"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold hidden md:inline-block"
        > */}
        <a
          href="#matricula"
          className="bg-[#ea428e] text-white px-4 py-2 rounded hover:bg-[#cb2570] text-sm font-semibold hidden md:inline-block"
        >
          Reserve sua Matrícula
        </a>
        {/* </Link> */}

        {/* Botão de menu hambúrguer para mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md p-4 space-y-4">
          <Link
            href="#features"
            scroll={false}
            className="block text-sm font-semibold hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Recursos
          </Link>
          <Link
            href="#pricing"
            scroll={false}
            className="block text-sm font-semibold hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Preços
          </Link>
          <Link
            href="#testimonials"
            scroll={false}
            className="block text-sm font-semibold hover:text-blue-600"
            onClick={toggleMobileMenu}
          >
            Depoimentos
          </Link>
          <Link
            href="#cta-final"
            className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
            onClick={toggleMobileMenu}
          >
            Fale Conosco
          </Link>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
            >
              Sair
            </button>
          )}
        </nav>
      )}
    </header>
  );
}
