import './globals.css';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
// Header importado como componente cliente
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Minha Landing Page',
  description: 'A melhor página de vendas, com foco em conversão',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-800">
        {/* Header */}
        <Header />
        {/* Conteúdo principal */}
        {children}
        {/* Rodapé */}
        <footer className="bg-gray-900 text-gray-200 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6 text-sm flex flex-col md:flex-row md:justify-between">
            <p className="mb-2 md:mb-0">
              &copy; {new Date().getFullYear()} Minha Empresa. Todos os direitos reservados.
            </p>
            <nav className="flex flex-col md:flex-row gap-2 md:gap-4">
              <Link href="#" className="hover:text-white">
                Política de Privacidade
              </Link>
              <Link href="#" className="hover:text-white">
                Termos de Uso
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
