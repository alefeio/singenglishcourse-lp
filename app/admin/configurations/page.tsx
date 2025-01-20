'use client';

import React, { useState, useEffect } from 'react';

export default function ConfigurationsPage() {
  const [bannerHeight, setBannerHeight] = useState('50vh');
  const [pageWidth, setPageWidth] = useState('1280px');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Verifica e cria configurações, se necessário
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations', { method: 'GET' });

        console.log('res', res)

        if (!res.ok) {
          // Caso a coleção não exista, cria o registro inicial
          const createRes = await fetch('/api/configurations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bannerHeight: '50vh',
              pageWidth: '1280px',
            }),
          });

          if (!createRes.ok) throw new Error('Erro ao criar configuração inicial');
        //   setMessage('Configuração inicial criada com sucesso!');
          return;
        }

        const data = await res.json();
        setBannerHeight(data.bannerHeight || '50vh');
        setPageWidth(data.pageWidth || '1280px');
      } catch (error) {
        console.error('Erro ao buscar ou criar configurações:', error);
        setMessage('Erro ao carregar ou criar configurações.');
      }
    };

    fetchConfigurations();
  }, []);

  const handleSaveConfigurations = async () => {
    try {
      const res = await fetch('/api/configurations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerHeight,
          pageWidth,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar configurações');

      setMessage('Configurações atualizadas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('Erro ao salvar configurações.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      {message && <p className={`mb-4 ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

      <div className="space-y-4">
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
          <label className="block text-sm font-medium mb-1">Largura da Página:</label>
          <input
            type="text"
            value={pageWidth}
            onChange={(e) => setPageWidth(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Ex: 1280px ou 100%"
          />
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
