'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IComponent } from '@/components/DragAndDrop/types';

interface IPage {
  id: string;
  name: string;
  url: string;
  content: IComponent[];
}

export default function PagesAdmin() {
  const [pages, setPages] = useState<IPage[]>([]);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchPages();
  }, []);

  // Fetch pages from API
  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages', { method: 'GET' });
      if (!res.ok) throw new Error('Erro ao carregar páginas');
      const data = await res.json();
      setPages(data);
    } catch (err) {
      console.error('Erro ao carregar páginas:', err);
    }
  };

  // Delete a page
  const handleDelete = async (id: string) => {
    if (!confirm('Deseja realmente excluir esta página?')) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao excluir página');
      setMessage('Página excluída com sucesso!');
      setTimeout(() => {
        setMessage('');
      }, 3000)
      fetchPages();
    } catch (err) {
      console.error('Erro ao excluir página:', err);
      setMessage('Erro ao excluir página.');
    }
  };

  // Edit a page
  const handleEdit = (id: string) => {
    router.push(`/admin/lp/${id}`);
  };

  // Create a new page
  const handleNewPage = () => {
    router.push('/admin/lp');
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Páginas Criadas</h1>
        <button
          onClick={handleNewPage}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Nova Página
        </button>
      </div>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border border-gray-300 px-4 py-2">Nome</th>
              <th className="border border-gray-300 px-4 py-2">URL</th>
              <th className="border border-gray-300 px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pages.length > 0 ? (
              pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{page.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{page.url}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(page.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Excluir
                      </button>
                      <a
                        href={page.url}
                        target="_blank"
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        Visualizar
                      </a>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-4">
                  Nenhuma página cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
