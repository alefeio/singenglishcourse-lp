'use client'

import React, { useState, useEffect } from 'react'
import { db } from '@/lib/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'
import Image from 'next/image'

// Tipagem para os banners
interface Banner {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaColor: string
  ctaLink: string
  imageUrl: string
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [current, setCurrent] = useState(0)

  // Carregar banners ao montar o componente
  useEffect(() => {
    loadBanners()
  }, [])

  // Função para carregar os banners do Firestore
  async function loadBanners() {
    const snapshot = await getDocs(collection(db, 'banners'))
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Banner[]
    setBanners(data)
  }

  // Intervalo para alternar os banners a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  // Caso os banners ainda não estejam carregados
  if (banners.length === 0) {
    return <div>Carregando banners...</div>
  }

  const banner = banners[current]

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <Image
        src={banner.imageUrl}
        alt="Banner"
        width={500}  // Ajuste a largura e a altura de acordo com a sua necessidade
        height={300}
        layout="responsive"
        quality={100} // ✅ Mantém a qualidade original da imagem
        unoptimized // ❌ Desativa otimizações automáticas do Next.js
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/40 p-4">
        <h2 className="text-3xl font-bold mb-2">{banner.title}</h2>
        <p className="text-lg mb-4">{banner.subtitle}</p>
        {banner.ctaText && (
          <a
            href={banner.ctaLink || '#'}
            style={{ backgroundColor: banner.ctaColor || '#fff' }}
            className="px-4 py-2 rounded font-semibold"
          >
            {banner.ctaText}
          </a>
        )}
      </div>
    </div>
  )
}
