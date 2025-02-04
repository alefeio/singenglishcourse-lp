'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebaseClient';
import Link from 'next/link';

export default function Carousel() {
    const [banners, setBanners] = useState<
        {
            id: string;
            imageUrl: string;
            title: string;
            subtitle: string;
            ctaText: string;
            ctaColor: string;
            ctaLink: string;
        }[]
    >([]);
    const [bannerHeight, setBannerHeight] = useState('50vh');

    useEffect(() => {
        const fetchConfigurations = async () => {
            try {
                const res = await fetch('/api/configurations', { method: 'GET' });
                if (!res.ok) throw new Error('Erro ao carregar configurações');
                const data = await res.json();

                setBannerHeight(data.bannerHeight || '50vh');
            } catch (error) {
                console.error('Erro ao carregar configurações:', error);
            }
        };

        const fetchBanners = async () => {
            try {
                const bannersCollection = collection(db, 'banners');
                const bannersSnapshot = await getDocs(bannersCollection);
                const bannersList = bannersSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as typeof banners;
                setBanners(bannersList);
            } catch (error) {
                console.error('Erro ao buscar banners:', error);
            }
        };

        fetchConfigurations();
        fetchBanners();
    }, []);

    return (
        <div className="w-full" style={{ height: bannerHeight }}>
            <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                className="h-full"
            >
                {banners.length > 0 ? (
                    banners.map(banner => (
                        <SwiperSlide key={banner.id}>
                            {/* Imagem do slide */}
                            <div className="relative w-full h-full">
                                <Image
                                    src={banner.imageUrl}
                                    width={100}
                                    height={100}
                                    alt={`Banner ${banner.title}`}
                                    className="w-full h-full object-cover object-center"
                                    quality={100} // ✅ Mantém a qualidade original da imagem
                                    unoptimized // ❌ Desativa otimizações automáticas do Next.js
                                />
                                {/* Sobreposição de conteúdo */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center text-center p-6">
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        {banner.title}
                                    </h2>
                                    <p className="text-lg text-gray-200 mb-6">
                                        {banner.subtitle}
                                    </p>
                                    <Link
                                        href={banner.ctaLink}
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 text-white font-semibold rounded"
                                        style={{ backgroundColor: banner.ctaColor }}
                                    >
                                        {banner.ctaText}
                                    </Link>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Carregando banners...</p>
                )}
            </Swiper>
        </div>
    );
}
