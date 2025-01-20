'use client';

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto p-4 bg-white rounded shadow">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center">Painel de Administração</h1>
        <p className="text-gray-700 text-center">
          Bem-vindo(a) ao painel de controle da sua Landing Page!
        </p>
      </div>

      {/* Cards / Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="font-semibold mb-2">Banners</h2>
          <p className="text-sm text-gray-600">Gerencie o carrossel do topo</p>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="font-semibold mb-2">Páginas</h2>
          <p className="text-sm text-gray-600">Crie e edite páginas personalizadas</p>
        </div>

        <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
          <h2 className="font-semibold mb-2">Configurações</h2>
          <p className="text-sm text-gray-600">Ajuste as configurações gerais</p>
        </div>
      </div>
    </div>
  );
}
