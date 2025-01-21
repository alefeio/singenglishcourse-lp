'use client';

import React, { useState, useEffect } from 'react';

export default function ConfigurationsPage() {
  const [configId, setConfigId] = useState<string | null>(null); // Guarda o ID da configuração existente
  const [bannerHeight, setBannerHeight] = useState('');
  const [pageWidth, setPageWidth] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfigurations = async () => {
      try {
        const res = await fetch('/api/configurations', { method: 'GET' });

        console.log('res', res)

        if (res.status === 404) {
          // Nenhuma configuração encontrada, cria o registro inicial
          const createRes = await fetch('/api/configurations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bannerHeight: '50vh',
              pageWidth: '1280px',
            }),
          });

          if (!createRes.ok) throw new Error('Erro ao criar configuração inicial');
          const createdData = await createRes.json();

          // Armazena o ID do registro criado
          setConfigId(createdData.id);
          setMessage('Configuração inicial criada com sucesso!');
          setTimeout(() => {
            setMessage('');
          }, 3000)
          return;
        }

        if (!res.ok) {
          throw new Error('Erro ao buscar configurações');
        }

        // Configurações existentes encontradas
        const data = await res.json();
        setConfigId(data.id); // Armazena o ID do registro
        setBannerHeight(data.bannerHeight);
        setPageWidth(data.pageWidth);
      } catch (error) {
        console.error('Erro ao buscar ou criar configurações:', error);
        setMessage('Erro ao carregar ou criar configurações.');
      }
    };

    fetchConfigurations();
  }, []);

  const handleSaveConfigurations = async () => {
    try {
      if (!configId) {
        throw new Error('ID da configuração não encontrado. Verifique o estado inicial.');
      }

      const res = await fetch(`/api/configurations/${configId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bannerHeight,
          pageWidth,
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar configurações');

      setMessage('Configurações atualizadas com sucesso!');
      setTimeout(() => {
        setMessage('');
      }, 3000)
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      setMessage('Erro ao salvar configurações.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Configurações</h1>

      {message && (
        <p
          className={`mb-4 ${message.includes('Erro') ? 'text-red-600' : 'text-green-600'
            }`}
        >
          {message}
        </p>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Altura do Banner:
          </label>
          <input
            type="text"
            value={bannerHeight}
            onChange={(e) => setBannerHeight(e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            placeholder="Ex: 50vh ou 300px"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Largura da Página:
          </label>
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
