import './globals.css'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

// Metadados base (title, description etc.)
export const metadata: Metadata = {
  title: 'Minha Landing Page',
  description: 'A melhor página de vendas, com foco em conversão',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-800">
        {/* Header / Navbar */}
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
            {/* Menu de navegação (caso precise) */}
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
            {/* CTA do Header */}
            <Link
              href="#cta-final"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
            >
              Fale Conosco
            </Link>
          </div>
        </header>

        {/* Conteúdo principal (Landing) */}
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
  )
}
