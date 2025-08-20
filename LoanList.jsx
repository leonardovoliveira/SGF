import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Search, Eye, Edit, Trash2, Plus, DollarSign } from 'lucide-react'

const LoanList = ({ onNewLoan, onEditLoan }) => {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLoans()
  }, [])

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans')
      const data = await response.json()
      setLoans(data)
    } catch (error) {
      console.error('Erro ao buscar empréstimos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (loanId) => {
    if (window.confirm('Tem certeza que deseja excluir este empréstimo?')) {
      try {
        const response = await fetch(`/api/loans/${loanId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          setLoans(loans.filter(loan => loan.id !== loanId))
          alert('Empréstimo excluído com sucesso!')
        } else {
          alert('Erro ao excluir empréstimo')
        }
      } catch (error) {
        console.error('Erro ao excluir empréstimo:', error)
        alert('Erro ao excluir empréstimo')
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': { label: 'Ativo', variant: 'default', className: 'bg-green-100 text-green-800' },
      'inactive': { label: 'Inativo', variant: 'secondary', className: 'bg-gray-100 text-gray-800' },
      'paid_off': { label: 'Quitado', variant: 'outline', className: 'bg-blue-100 text-blue-800' }
    }
    
    const statusInfo = statusMap[status] || statusMap['active']
    
    return (
      <Badge className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    )
  }

  const filteredLoans = loans.filter(loan =>
    loan.borrower_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Carregando empréstimos...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Empréstimos</h1>
        <Button 
          onClick={onNewLoan}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Empréstimo
        </Button>
      </div>

      {/* Barra de Pesquisa */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar por nome do mutuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Empréstimos */}
      {filteredLoans.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'Nenhum empréstimo encontrado' : 'Nenhum empréstimo cadastrado'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? 'Tente ajustar os termos de pesquisa'
                  : 'Comece cadastrando seu primeiro empréstimo'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={onNewLoan}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Empréstimo
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredLoans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {loan.borrower_name}
                      </h3>
                      {getStatusBadge(loan.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Valor:</span>
                        <div className="text-lg font-semibold text-green-600">
                          {formatCurrency(loan.principal_amount)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Taxa:</span>
                        <div className="text-lg font-semibold">
                          {loan.interest_rate}% a.m.
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Prazo:</span>
                        <div className="text-lg font-semibold">
                          {loan.loan_term_months} meses
                        </div>
                      </div>
                      <div>
                        <span className="font-medium">Início:</span>
                        <div className="text-lg font-semibold">
                          {formatDate(loan.start_date)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      <span>Tipo: {loan.loan_type}</span>
                      <span>Primeira parcela: {formatDate(loan.first_payment_due_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Ver detalhes', loan.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditLoan && onEditLoan(loan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(loan.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Resumo */}
      {filteredLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resumo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {filteredLoans.length}
                </div>
                <div className="text-sm text-gray-600">
                  {filteredLoans.length === 1 ? 'Empréstimo' : 'Empréstimos'}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    filteredLoans.reduce((sum, loan) => sum + loan.principal_amount, 0)
                  )}
                </div>
                <div className="text-sm text-gray-600">Total Emprestado</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {filteredLoans.filter(loan => loan.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default LoanList

