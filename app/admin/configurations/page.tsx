'use client';

import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export default function ConfigurationsPage() {
  const [configId, setConfigId] = useState<string | null>(null);
  const [bannerHeight, setBannerHeight] = useState('');
  const [bannerWidth, setBannerWidth] = useState('');
  const [pageWidth, setPageWidth] = useState('');
  const [footerText, setFooterText] = useState('');
  const [menuLinks, setMenuLinks] = useState<{ name: string; url: string }[]>([]);
  const [footerLinks, setFooterLinks] = useState<{ name: string; url: string }[]>([]);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [highlightName, setHighlightName] = useState('');
  const [highlightUrl, setHighlightUrl] = useState('');
  const [highlightBgColor, setHighlightBgColor] = useState('#ea428e');
  const [highlightTextColor, setHighlightTextColor] = useState('#ffffff');

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations', { method: 'GET' });

        if (res.status === 404) {
          return;
        }

        if (!res.ok) {
          throw new Error('Erro ao buscar configurações');
        }

        const data = await res.json();
        setConfigId(data.id);
        setBannerHeight(data.bannerHeight);
        setBannerWidth(data.bannerWidth || '1280px');
        setPageWidth(data.pageWidth);
        setFooterText(data.footerText);
        setMenuLinks(data.menuLinks || []);
        setFooterLinks(data.footerLinks || []);
        setLogoUrl(data.logoUrl || null);
        setHighlightName(data.highlightName || '');
        setHighlightUrl(data.highlightUrl || '#');
        setHighlightBgColor(data.highlightBgColor || '#ea428e');
        setHighlightTextColor(data.highlightTextColor || '#ffffff');
      } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        setMessage('Erro ao carregar configurações.');
      }
    };

    fetchConfigurations();
  }, []);

  const handleSaveConfigurations = async () => {
    try {
      if (!configId) {
        throw new Error('ID da configuração não encontrado.');
      }

      const formData = new FormData();
      formData.append('bannerHeight', bannerHeight);
      formData.append('bannerWidth', bannerWidth);
      formData.append('pageWidth', pageWidth);
      formData.append('footerText', footerText);
      formData.append('menuLinks', JSON.stringify(menuLinks));
      formData.append('footerLinks', JSON.stringify(footerLinks));
      formData.append('highlightName', highlightName);
      formData.append('highlightUrl', highlightUrl);
      formData.append('highlightBgColor', highlightBgColor);
      formData.append('highlightTextColor', highlightTextColor);

      if (logo) {
        formData.append('imageFile', logo);
      }

      const res = await fetch(`/api/configurations/${configId}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!res.ok) throw new Error('Erro ao salvar configurações');

      const updatedData = await res.json();
      setLogoUrl(updatedData.logoUrl);
      setMessage('Configurações atualizadas com sucesso!');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('Erro ao salvar configurações.');
    }
  };

  const handleAddMenuLink = () => {
    setMenuLinks([...menuLinks, { name: '', url: '' }]);
  };

  const handleAddFooterLink = () => {
    setFooterLinks([...footerLinks, { name: '', url: '' }]);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      {message && (
        <p className={`mb-4 ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      <div className="space-y-4">
        {/* Upload da Logomarca */}
        <div>
          <label className="block text-sm font-medium mb-1">Logomarca:</label>
          {logoUrl && (
            <div className="mb-2">
              <Image src={logoUrl} width={100} height={100} alt="Logomarca" className="w-32 h-auto" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files ? e.target.files[0] : null)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Banner */}
        <div>
          <label className="block text-sm font-medium mb-1">Altura do Banner:</label>
          <input
            type="text"
            value={bannerHeight}
            onChange={(e) => setBannerHeight(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Ex: 50vh ou 300px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Largura do Banner:</label>
          <input
            type="text"
            value={bannerWidth}
            onChange={(e) => setBannerWidth(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Ex: 1280px ou 100%"
          />
        </div>

        {/* Largura da Página */}
        <div>
          <label className="block text-sm font-medium mb-1">Largura da Página:</label>
          <input
            type="text"
            value={pageWidth}
            onChange={(e) => setPageWidth(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Ex: 1280px ou 100%"
          />
        </div>

        {/* Rodapé */}
        <div>
          <label className="block text-sm font-medium mb-1">Texto do Rodapé:</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
          />
        </div>

        {/* Links do Menu */}
        <div>
          <label className="block text-sm font-medium mb-1">Links do Menu:</label>
          {menuLinks.map((link, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={link.name}
                onChange={(e) => {
                  const updatedLinks = [...menuLinks];
                  updatedLinks[index].name = e.target.value;
                  setMenuLinks(updatedLinks);
                }}
                className="border border-gray-300 rounded p-2 flex-1"
                placeholder="Nome"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const updatedLinks = [...menuLinks];
                  updatedLinks[index].url = e.target.value;
                  setMenuLinks(updatedLinks);
                }}
                className="border border-gray-300 rounded p-2 flex-1"
                placeholder="URL"
              />
            </div>
          ))}
          <button
            onClick={handleAddMenuLink}
            className="text-blue-600 hover:underline text-sm"
          >
            + Adicionar Link
          </button>
        </div>

        <div className="border p-4 rounded w-[20%]">
          <h3 className="font-semibold mb-2">Destaque do Menu</h3>
          <input
            type="text"
            value={highlightName}
            onChange={(e) => setHighlightName(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-2"
            placeholder="Texto do botão"
          />
          <input
            type="text"
            value={highlightUrl}
            onChange={(e) => setHighlightUrl(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full mb-2"
            placeholder="URL (Página ou âncora)"
          />
          <label className="block mb-1">Cor de Fundo:</label>
          <input
            type="color"
            value={highlightBgColor}
            onChange={(e) => setHighlightBgColor(e.target.value)}
            className="w-full h-10 border rounded mb-2"
          />
          <label className="block mb-1">Cor do Texto:</label>
          <input
            type="color"
            value={highlightTextColor}
            onChange={(e) => setHighlightTextColor(e.target.value)}
            className="w-full h-10 border rounded"
          />
        </div>

        {/* Links do Rodapé */}
        <div>
          <label className="block text-sm font-medium mb-1">Links do Rodapé:</label>
          {footerLinks.map((link, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <input
                type="text"
                value={link.name}
                onChange={(e) => {
                  const updatedLinks = [...footerLinks];
                  updatedLinks[index].name = e.target.value;
                  setFooterLinks(updatedLinks);
                }}
                className="border border-gray-300 rounded p-2 flex-1"
                placeholder="Nome"
              />
              <input
                type="text"
                value={link.url}
                onChange={(e) => {
                  const updatedLinks = [...footerLinks];
                  updatedLinks[index].url = e.target.value;
                  setFooterLinks(updatedLinks);
                }}
                className="border border-gray-300 rounded p-2 flex-1"
                placeholder="URL"
              />
            </div>
          ))}
          <button
            onClick={handleAddFooterLink}
            className="text-blue-600 hover:underline text-sm"
          >
            + Adicionar Link
          </button>
        </div>

        <button
          onClick={handleSaveConfigurations}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Salvar Configurações
        </button>
      </div>
    </div>
  );
}
