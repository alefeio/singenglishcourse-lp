'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebaseClient'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SignupPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log('Usuário cadastrado:', userCredential.user)

      // Redireciona para login ou outra página (ex.: /dashboard)
      router.push('/login')
    } catch (err: any) {
      console.error('Erro ao criar usuário:', err)
      setError(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen bg-gray-100">
      {/* Coluna Esquerda (desktop) - Pode conter imagem/ilustração */}
      <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center relative">
        {/* Se tiver uma imagem de fundo */}
        <div className="absolute inset-0 bg-[url('/images/background.jpg')] bg-cover bg-center opacity-30" />
        
        <div className="z-10 text-center p-10">
          <h2 className="text-white text-4xl font-bold mb-4">
            Bem-vindo(a)!
          </h2>
          <p className="text-white text-lg max-w-md mx-auto">
            Cadastre-se para ter acesso aos nossos cursos e conteúdos exclusivos.
          </p>
        </div>
      </div>

      {/* Coluna Direita: Formulário de Cadastro */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md m-4">
          {/* Logo (exemplo) */}
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo.png"
              alt="Logo da Empresa"
              width={150}
              height={70}
              className="object-contain"
            />
          </div>

          <h1 className="text-2xl font-bold mb-6 text-center">Criar Conta</h1>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Senha
              </label>
              <input
                id="password"
                type="password"
                className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full font-semibold transition-colors"
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          {/* Link para a página de login */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Já tem uma conta?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Entrar
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
