import './globals.css';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer'; // Importando Footer

export const metadata: Metadata = {
  title: 'Minha Landing Page',
  description: 'A melhor página de vendas, com foco em conversão',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-800">
        <Header />
        {children}
        <Footer /> {/* Usa o Footer dinâmico aqui */}
      </body>
    </html>
  );
}
