'use client';

import Image from 'next/image';
import React, { useState, useEffect, FormEvent } from 'react';

interface IBanner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaColor: string;
  ctaLink: string;
  imageUrl: string;
}

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Campos do formulário
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaText, setCtaText] = useState('');
  const [ctaColor, setCtaColor] = useState('#007bff');
  const [ctaLink, setCtaLink] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Mensagens
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Carregar banners
  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    try {
      const res = await fetch('/api/banners', { method: 'GET' });
      if (!res.ok) throw new Error('Erro ao carregar banners');
      const data = await res.json();
      if (Array.isArray(data)) {
        setBanners(data);
      }
    } catch (err) {
      console.error('Erro ao carregar banners:', err);
    }
  }

  // Limpar form
  function resetForm() {
    setTitle('');
    setSubtitle('');
    setCtaText('');
    setCtaColor('#007bff');
    setCtaLink('');
    setImageFile(null);
    setSelectedId(null);
  }

  // Criar ou Editar
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!title) {
      setError('Título é obrigatório');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('subtitle', subtitle);
      formData.append('ctaText', ctaText);
      formData.append('ctaColor', ctaColor);
      formData.append('ctaLink', ctaLink);
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const url = selectedId ? `/api/banners/${selectedId}` : '/api/banners';
      const method = selectedId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao salvar banner');
      }

      resetForm();
      setMessage(selectedId ? 'Banner atualizado!' : 'Banner criado!');
      fetchBanners();
    } catch (err: unknown) {
      console.error(err);
      setError('Erro ao salvar banner');
    }
  }

  // Excluir
  async function handleDelete(id: string) {
    if (!confirm('Deseja realmente excluir este banner?')) return;
    try {
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao excluir banner');
      }
      setMessage('Banner excluído!');
      fetchBanners();
    } catch (err: unknown) {
      console.error(err);
      setError('Erro ao excluir banner');
    }
  }

  // Editar (preencher form)
  function startEdit(banner: IBanner) {
    setSelectedId(banner.id);
    setTitle(banner.title);
    setSubtitle(banner.subtitle);
    setCtaText(banner.ctaText);
    setCtaColor(banner.ctaColor);
    setCtaLink(banner.ctaLink);
    setImageFile(null); // Imagem só se quiser trocar
  }

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Administração de Banners</h1>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {selectedId ? 'Editar Banner' : 'Novo Banner'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              className="border rounded p-2 w-full"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtítulo</label>
            <input
              className="border rounded p-2 w-full"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Texto</label>
            <input
              className="border rounded p-2 w-full"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Cor</label>
            <input
              type="color"
              className="border rounded p-2 w-full"
              value={ctaColor}
              onChange={(e) => setCtaColor(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CTA Link</label>
            <input
              className="border rounded p-2 w-full"
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Imagem</label>
            <input
              type="file"
              className="border rounded p-2 w-full"
              accept="image/*"
              onChange={(e) => e.target.files && setImageFile(e.target.files[0])}
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full md:w-auto"
            >
              {selectedId ? 'Salvar Alterações' : 'Criar Banner'}
            </button>
            {selectedId && (
              <button
                type="button"
                onClick={resetForm}
                className="ml-4 px-4 py-2 rounded border"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Banners Cadastrados</h2>
        {banners.length === 0 ? (
          <p className="text-gray-500">Nenhum banner cadastrado.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {banners.map((banner) => (
              <div key={banner.id} className="border p-4 rounded shadow">
                {banner.imageUrl && (
                  <Image
                    src={banner.imageUrl}
                    alt="Banner"
                    width={300}
                    height={150}
                    className="rounded object-cover"
                  />
                )}
                <h3 className="text-lg font-bold">{banner.title}</h3>
                <p className="text-gray-600">{banner.subtitle}</p>
                <a
                  href={banner.ctaLink}
                  target="_blank"
                  className="inline-block bg-blue-600 text-white px-3 py-1 rounded mt-2"
                  style={{ backgroundColor: banner.ctaColor }}
                >
                  {banner.ctaText}
                </a>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startEdit(banner)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
