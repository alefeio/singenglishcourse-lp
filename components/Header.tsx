'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiMenu, FiX } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoUrl, setLogoUrl] = useState('/images/logo.png'); // Fallback padrão
  const [menuLinks, setMenuLinks] = useState<{ name: string; url: string }[]>([]);
  const [highlightName, setHighlightName] = useState('');
  const [highlightUrl, setHighlightUrl] = useState('#matricula');
  const [highlightBgColor, setHighlightBgColor] = useState('#ea428e');
  const [highlightTextColor, setHighlightTextColor] = useState('#ffffff');

  const router = useRouter();

  // Verifica autenticação do usuário
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  // Carrega configurações (logomarca e menu)
  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations');
        if (!res.ok) throw new Error('Erro ao buscar configurações');

        const data = await res.json();

        console.log('data', data)

        if (data.logoUrl) setLogoUrl(data.logoUrl);
        if (data.menuLinks) setMenuLinks(data.menuLinks);

        setHighlightName(data.highlightName);
        setHighlightUrl(data.highlightUrl || '#matricula');
        setHighlightBgColor(data.highlightBgColor || '#ea428e');
        setHighlightTextColor(data.highlightTextColor || '#ffffff');
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    fetchConfigurations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo dinâmico */}
        <div className="flex items-center gap-2">
          <Link
            href='/'
          >
            <Image
              src={logoUrl}
              alt="Logo"
              width={120}
              height={40}
              className="object-contain"
              quality={100} // ✅ Mantém a qualidade original da imagem
              unoptimized // ❌ Desativa otimizações automáticas do Next.js
            />
          </Link>
        </div>

        {/* Menu Desktop dinâmico */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          {menuLinks.length > 0 && (
            menuLinks.map((link, index) => (
              <Link key={index} href={link.url} scroll={false} className="hover:text-blue-600">
                {link.name}
              </Link>
            ))
          )}
        </nav>

        {/* Botão CTA fixo */}
        <a
          href={highlightUrl}
          className="px-4 py-2 rounded text-sm font-semibold hidden md:inline-block"
          style={{
            backgroundColor: highlightBgColor,
            color: highlightTextColor,
          }}
        >
          {highlightName}
        </a>

        {/* Botão de menu hambúrguer para mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menu Mobile dinâmico */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-md p-4 space-y-4">
          {menuLinks.length > 0 && (
            menuLinks.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                scroll={false}
                className="block text-sm font-semibold hover:text-blue-600"
                onClick={toggleMobileMenu}
              >
                {link.name}
              </Link>
            ))
          )}
          <a
            href={highlightUrl}
            className="px-4 py-2 rounded text-sm font-semibold block text-center"
            style={{
              backgroundColor: highlightBgColor,
              color: highlightTextColor,
            }}
          >
            {highlightName}
          </a>
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
