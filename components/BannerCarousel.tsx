'use client'

import React, { useState, useEffect } from 'react'
import { db } from '@/lib/firebaseClient'
import { collection, getDocs } from 'firebase/firestore'

// Exemplo simples sem libs de carousel
export default function BannerCarousel() {
  const [banners, setBanners] = useState<any[]>([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    loadBanners()
  }, [])

  async function loadBanners() {
    const snapshot = await getDocs(collection(db, 'banners'))
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setBanners(data)
  }

  // Simples “próximo banner” a cada 5s, ex.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [banners.length])

  if (banners.length === 0) {
    return <div>Carregando banners...</div>
  }

  const banner = banners[current]
  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      <img
        src={banner.imageUrl}
        alt="Banner"
        className="w-full h-full object-cover"
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
