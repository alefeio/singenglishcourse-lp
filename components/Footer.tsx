'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Footer() {
  const [footerText, setFooterText] = useState<string>('');
  const [footerLinks, setFooterLinks] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations', { method: 'GET' });

        if (!res.ok) throw new Error('Erro ao buscar configurações');

        const data = await res.json();
        setFooterText(data.footerText || '© 2025 Minha Empresa. Todos os direitos reservados.');
        setFooterLinks(data.footerLinks || []);
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
      }
    };

    fetchConfigurations();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row md:justify-between">
        <p className="mb-2 md:mb-0">{footerText}</p>
        <nav className="flex flex-col md:flex-row gap-2 md:gap-4">
          {footerLinks.length > 0 && (
            footerLinks.map((link, index) => (
              <Link key={index} href={link.url} className="hover:text-white">
                {link.name}
              </Link>
            ))
          )}
        </nav>
      </div>
    </footer>
  );
}
