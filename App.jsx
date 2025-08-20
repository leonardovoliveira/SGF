import { useState } from 'react'
import Dashboard from './components/Dashboard'
import LoanForm from './components/LoanForm'
import LoanList from './components/LoanList'
import { Button } from '@/components/ui/button'
import { Home, List, Plus, Menu, X } from 'lucide-react'
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />
      case 'loans':
        return (
          <LoanList 
            onNewLoan={() => setCurrentView('new-loan')}
            onEditLoan={(loan) => {
              console.log('Editar empréstimo:', loan)
              // Implementar edição posteriormente
            }}
          />
        )
      case 'new-loan':
        return (
          <LoanForm 
            onBack={() => setCurrentView('loans')}
            onSave={() => {
              setCurrentView('loans')
            }}
          />
        )
      default:
        return <Dashboard />
    }
  }

  const NavigationButton = ({ view, icon: Icon, label, variant = 'ghost' }) => (
    <Button
      variant={currentView === view ? 'default' : variant}
      onClick={() => {
        setCurrentView(view)
        setMobileMenuOpen(false)
      }}
      className="flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto"
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navegação Superior - Mobile First */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo e Título */}
            <div className="flex items-center flex-1 min-w-0">
              <img 
                src="/src/assets/logo_sistema_emprestimos.png" 
                alt="Logo" 
                className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 flex-shrink-0"
              />
              <h1 className="text-sm sm:text-xl font-bold text-gray-900 truncate">
                <span className="hidden sm:inline">Sistema de Gestão de Empréstimos</span>
                <span className="sm:hidden">LoanManager</span>
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              <NavigationButton view="dashboard" icon={Home} label="Dashboard" />
              <NavigationButton view="loans" icon={List} label="Empréstimos" />
              <NavigationButton 
                view="new-loan" 
                icon={Plus} 
                label="Novo" 
                variant="default"
              />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t bg-white py-2 space-y-1">
              <NavigationButton view="dashboard" icon={Home} label="Dashboard" />
              <NavigationButton view="loans" icon={List} label="Empréstimos" />
              <NavigationButton 
                view="new-loan" 
                icon={Plus} 
                label="Novo Empréstimo" 
                variant="default"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Conteúdo Principal */}
      <main className="w-full">
        {renderCurrentView()}
      </main>
    </div>
  )
}

export default App
