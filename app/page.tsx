'use client'

import Image from 'next/image'

export default function LandingPage() {
  return (
    <main className="flex flex-col">

      {/* Sessão 1 */}
      <section
        id="sessao-1"
        className="relative w-full h-screen flex items-center justify-center bg-gray-100"
      >
        {/* Imagem de fundo (exemplo) */}
        <Image
          src="/images/sessao1.jpg"       // AJUSTE para o nome real do arquivo
          alt="Sessão 1"
          fill
          className="object-cover object-center"
        />
        {/* Overlay (opcional) para melhor contraste de texto */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Legenda (texto) */}
        <div className="relative z-10 max-w-3xl text-center p-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Nossa equipe especializada desenvolveu um método inovador para ensinar inglês com música para crianças
          </h2>
        </div>
      </section>

      {/* Sessão 2 */}
      <section
        id="sessao-2"
        className="relative w-full h-screen flex items-center justify-center bg-gray-100"
      >
        <Image
          src="/images/sessao2.jpg"       // AJUSTE para o nome real do arquivo
          alt="Sessão 2"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10 max-w-3xl text-center p-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Nossa abordagem única utiliza o universo melódico, cultural e poético da canção para envolver emocionalmente os alunos e proporcionar aprendizado eficaz
          </h2>
        </div>
      </section>

      {/* Sessão 3 */}
      <section
        id="sessao-3"
        className="relative w-full h-screen flex items-center justify-center bg-gray-100"
      >
        <Image
          src="/images/sessao3.jpg"       // AJUSTE para o nome real do arquivo
          alt="Sessão 3"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10 max-w-3xl text-center p-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Através de atividades que exploram o universo poético das canções, seus filhos serão imersos num contexto significativo onde a memorização rápida é desencadeada graças à identificação sentimental e às multi-dimensões que a linguagem musical proporciona
          </h2>
        </div>
      </section>

      {/* Sessão 4 */}
      <section
        id="sessao-4"
        className="relative w-full h-screen flex items-center justify-center bg-gray-100"
      >
        <Image
          src="/images/sessao4.jpg"       // AJUSTE para o nome real do arquivo
          alt="Sessão 4"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10 max-w-3xl text-center p-4 text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Material Didático: Nosso material didático foi pensado de maneira contextualizada, com canções de autoria própria da idealizadora do curso e grandes hits internacionais, com atividades de envolvimento nos contextos que cada poesia traz, adaptadas às faixas etárias
          </h2>
        </div>
      </section>

    </main>
  )
}
