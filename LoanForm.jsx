import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, Save, Calculator, Calendar, Percent, Clock } from 'lucide-react'

const LoanForm = ({ onBack, onSave }) => {
  const [formData, setFormData] = useState({
    borrower_name: '',
    principal_amount: '',
    interest_rate: '',
    loan_term_months: '',
    start_date: '',
    first_payment_due_date: '',
    loan_type: 'SAC'
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpar erro quando o usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLoanTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      loan_type: value
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.borrower_name.trim()) {
      newErrors.borrower_name = 'Nome do mutuário é obrigatório'
    }

    if (!formData.principal_amount || parseFloat(formData.principal_amount) <= 0) {
      newErrors.principal_amount = 'Valor do empréstimo deve ser maior que zero'
    }

    if (!formData.interest_rate || parseFloat(formData.interest_rate) < 0) {
      newErrors.interest_rate = 'Taxa de juros deve ser maior ou igual a zero'
    }

    if (!formData.loan_term_months || parseInt(formData.loan_term_months) <= 0) {
      newErrors.loan_term_months = 'Prazo deve ser maior que zero'
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Data de início é obrigatória'
    }

    if (!formData.first_payment_due_date) {
      newErrors.first_payment_due_date = 'Data do primeiro pagamento é obrigatória'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const newLoan = await response.json()
        onSave && onSave(newLoan)
        // Limpar formulário após sucesso
        setFormData({
          borrower_name: '',
          principal_amount: '',
          interest_rate: '',
          loan_term_months: '',
          start_date: '',
          first_payment_due_date: '',
          loan_type: 'SAC'
        })
        alert('Empréstimo cadastrado com sucesso!')
      } else {
        const errorData = await response.json()
        alert(`Erro ao cadastrar empréstimo: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Erro ao cadastrar empréstimo:', error)
      alert('Erro ao cadastrar empréstimo. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  // Calcular estimativa de parcela
  const calculateEstimatedPayment = () => {
    const principal = parseFloat(formData.principal_amount) || 0
    const rate = parseFloat(formData.interest_rate) || 0
    const months = parseInt(formData.loan_term_months) || 0

    if (principal > 0 && rate > 0 && months > 0) {
      const monthlyRate = rate / 100
      if (formData.loan_type === 'SAC') {
        const principalPayment = principal / months
        const firstInterest = principal * monthlyRate
        return principalPayment + firstInterest
      } else {
        // PRICE
        if (monthlyRate === 0) return principal / months
        return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      }
    }
    return 0
  }

  const estimatedPayment = calculateEstimatedPayment()

  return (
    <div className="p-3 sm:p-6">
      <div className="flex items-center mb-4 sm:mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mr-2 sm:mr-4 p-2"
          size="sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline ml-2">Voltar</span>
        </Button>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Novo Empréstimo</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold">Cadastro de Empréstimo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Informações do Mutuário */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">
                Informações do Mutuário
              </h3>
              <div className="space-y-2">
                <Label htmlFor="borrower_name" className="text-sm font-medium">
                  Nome do Mutuário *
                </Label>
                <Input
                  id="borrower_name"
                  name="borrower_name"
                  type="text"
                  value={formData.borrower_name}
                  onChange={handleInputChange}
                  className={`${errors.borrower_name ? 'border-red-500' : ''} text-base`}
                  placeholder="Digite o nome completo"
                />
                {errors.borrower_name && (
                  <p className="text-sm text-red-600">{errors.borrower_name}</p>
                )}
              </div>
            </div>

            {/* Valores Financeiros */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">
                Valores Financeiros
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principal_amount" className="text-sm font-medium flex items-center">
                    <Calculator className="h-4 w-4 mr-1" />
                    Valor do Empréstimo (R$) *
                  </Label>
                  <Input
                    id="principal_amount"
                    name="principal_amount"
                    type="number"
                    step="0.01"
                    value={formData.principal_amount}
                    onChange={handleInputChange}
                    className={`${errors.principal_amount ? 'border-red-500' : ''} text-base`}
                    placeholder="0,00"
                  />
                  {errors.principal_amount && (
                    <p className="text-sm text-red-600">{errors.principal_amount}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interest_rate" className="text-sm font-medium flex items-center">
                    <Percent className="h-4 w-4 mr-1" />
                    Taxa de Juros Mensal (%) *
                  </Label>
                  <Input
                    id="interest_rate"
                    name="interest_rate"
                    type="number"
                    step="0.01"
                    value={formData.interest_rate}
                    onChange={handleInputChange}
                    className={`${errors.interest_rate ? 'border-red-500' : ''} text-base`}
                    placeholder="2,50"
                  />
                  {errors.interest_rate && (
                    <p className="text-sm text-red-600">{errors.interest_rate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Prazo e Datas */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">
                Prazo e Datas
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan_term_months" className="text-sm font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Prazo (meses) *
                  </Label>
                  <Input
                    id="loan_term_months"
                    name="loan_term_months"
                    type="number"
                    value={formData.loan_term_months}
                    onChange={handleInputChange}
                    className={`${errors.loan_term_months ? 'border-red-500' : ''} text-base`}
                    placeholder="12"
                  />
                  {errors.loan_term_months && (
                    <p className="text-sm text-red-600">{errors.loan_term_months}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start_date" className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Data de Início *
                  </Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className={`${errors.start_date ? 'border-red-500' : ''} text-base`}
                  />
                  {errors.start_date && (
                    <p className="text-sm text-red-600">{errors.start_date}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="first_payment_due_date" className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Primeira Parcela *
                  </Label>
                  <Input
                    id="first_payment_due_date"
                    name="first_payment_due_date"
                    type="date"
                    value={formData.first_payment_due_date}
                    onChange={handleInputChange}
                    className={`${errors.first_payment_due_date ? 'border-red-500' : ''} text-base`}
                  />
                  {errors.first_payment_due_date && (
                    <p className="text-sm text-red-600">{errors.first_payment_due_date}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tipo de Amortização */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-gray-900 border-b pb-2">
                Tipo de Amortização
              </h3>
              <RadioGroup 
                value={formData.loan_type} 
                onValueChange={handleLoanTypeChange}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="SAC" id="sac" />
                  <div className="flex-1">
                    <Label htmlFor="sac" className="font-medium cursor-pointer">
                      SAC (Sistema de Amortização Constante)
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Parcelas decrescentes, amortização constante
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="PRICE" id="price" />
                  <div className="flex-1">
                    <Label htmlFor="price" className="font-medium cursor-pointer">
                      PRICE (Tabela Price)
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Parcelas fixas durante todo o período
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Estimativa de Parcela */}
            {estimatedPayment > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Estimativa da Primeira Parcela</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(estimatedPayment)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {formData.loan_type === 'SAC' ? 'Primeira parcela (SAC - valor decrescente)' : 'Parcela fixa (PRICE)'}
                </p>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 order-2 sm:order-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 order-1 sm:order-2"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Salvando...' : 'Salvar Empréstimo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoanForm

