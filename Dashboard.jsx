import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, Users, AlertTriangle } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    total_loans: 0,
    active_loans: 0,
    total_principal: 0,
    monthly_income: 0,
    overdue_loans: 0
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <img 
            src="/src/assets/logo_sistema_emprestimos.png" 
            alt="Logo" 
            className="w-6 h-6 sm:w-8 sm:h-8"
          />
          <span className="text-sm sm:text-lg font-semibold text-blue-600 hidden sm:inline">LoanManager</span>
        </div>
      </div>

      {/* Cards de Estatísticas - Mobile First Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-blue-700">
              <span className="hidden sm:inline">Total de Empréstimos</span>
              <span className="sm:hidden">Total</span>
            </CardTitle>
            <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-blue-900">{stats.total_loans}</div>
            <p className="text-xs text-blue-600 mt-1">
              <span className="hidden sm:inline">empréstimos cadastrados</span>
              <span className="sm:hidden">cadastrados</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-green-700">
              <span className="hidden sm:inline">Empréstimos Ativos</span>
              <span className="sm:hidden">Ativos</span>
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-green-900">{stats.active_loans}</div>
            <p className="text-xs text-green-600 mt-1">
              <span className="hidden sm:inline">em andamento</span>
              <span className="sm:hidden">ativo</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">
              <span className="hidden sm:inline">Receita Mensal</span>
              <span className="sm:hidden">Receita</span>
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-2xl font-bold text-purple-900">
              {formatCurrency(stats.monthly_income)}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              <span className="hidden sm:inline">estimativa de juros</span>
              <span className="sm:hidden">mensal</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-red-700">
              <span className="hidden sm:inline">Pagamentos em Atraso</span>
              <span className="sm:hidden">Atrasos</span>
            </CardTitle>
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold text-red-900">{stats.overdue_loans}</div>
            <p className="text-xs text-red-600 mt-1">
              <span className="hidden sm:inline">requerem atenção</span>
              <span className="sm:hidden">atenção</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seção de Resumo - Stack em Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Resumo Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Capital Total Emprestado:</span>
                <span className="font-semibold text-sm sm:text-base">{formatCurrency(stats.total_principal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Receita Mensal Estimada:</span>
                <span className="font-semibold text-green-600 text-sm sm:text-base">{formatCurrency(stats.monthly_income)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-gray-600">Taxa de Inadimplência:</span>
                <span className="font-semibold text-red-600 text-sm sm:text-base">
                  {stats.total_loans > 0 ? ((stats.overdue_loans / stats.total_loans) * 100).toFixed(1) : 0}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg font-semibold">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                Novo Empréstimo
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base">
                Registrar Pagamento
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base">
                Gerar Relatório
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard

