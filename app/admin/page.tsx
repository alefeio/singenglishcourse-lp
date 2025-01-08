// app/admin/page.tsx
export default function AdminDashboardPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Painel de Administração</h1>
        <p className="text-gray-700">
          Bem-vindo(a) ao painel de controle da sua Landing Page!
        </p>
  
        {/* Você pode adicionar cards, gráficos, etc. */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Banners</h2>
            <p className="text-sm text-gray-600">Gerencie o carrossel do topo</p>
          </div>
          {/* ... */}
        </div>
      </div>
    )
  }
  