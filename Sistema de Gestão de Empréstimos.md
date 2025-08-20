# Sistema de Gestão de Empréstimos

## 🎯 Visão Geral

O Sistema de Gestão de Empréstimos é uma aplicação web completa desenvolvida para facilitar o lançamento e acompanhamento de investimentos em empréstimos a pessoas físicas com cobrança de juros.

**URL do Sistema:** https://lnh8imcn89k0.manus.space

## ✨ Funcionalidades Principais

### 📊 Dashboard
- Visão geral dos empréstimos ativos e inativos
- Métricas financeiras em tempo real
- Indicadores de performance e inadimplência
- Ações rápidas para operações comuns

### 💰 Gestão de Empréstimos
- **Cadastro de Empréstimos:**
  - Nome do mutuário
  - Valor do empréstimo
  - Taxa de juros mensal
  - Prazo em meses
  - Datas de início e primeira parcela
  - Tipo de amortização (SAC ou PRICE)

- **Lista de Empréstimos:**
  - Visualização completa de todos os empréstimos
  - Filtro por nome do mutuário
  - Status visual (Ativo, Inativo, Quitado)
  - Ações de edição e exclusão

### 📈 Cálculos Financeiros
- Cálculo automático de juros compostos
- Suporte aos sistemas SAC e PRICE
- Acompanhamento de saldo devedor
- Estimativa de receita mensal

## 🛠️ Tecnologias Utilizadas

### Backend
- **Python 3.11** - Linguagem de programação
- **Flask** - Framework web
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS

### Frontend
- **React 18** - Biblioteca JavaScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes UI
- **Lucide React** - Ícones

## 📁 Estrutura do Projeto

```
loan_management_system/
├── src/
│   ├── models/          # Modelos de dados
│   │   ├── user.py     # Modelo de usuário
│   │   ├── loan.py     # Modelo de empréstimo
│   │   └── payment.py  # Modelo de pagamento
│   ├── routes/          # Rotas da API
│   │   ├── user.py     # Rotas de usuário
│   │   └── loan.py     # Rotas de empréstimo
│   ├── static/          # Frontend compilado
│   ├── database/        # Banco de dados SQLite
│   └── main.py         # Aplicação principal
├── venv/               # Ambiente virtual Python
└── requirements.txt    # Dependências Python
```

## 🗄️ Modelo de Dados

### Empréstimo (Loan)
- **id**: Identificador único
- **user_id**: ID do usuário proprietário
- **borrower_name**: Nome do mutuário
- **principal_amount**: Valor principal
- **interest_rate**: Taxa de juros mensal (%)
- **loan_term_months**: Prazo em meses
- **start_date**: Data de início
- **first_payment_due_date**: Data da primeira parcela
- **loan_type**: Tipo de amortização (SAC/PRICE)
- **status**: Status do empréstimo

### Pagamento (Payment)
- **id**: Identificador único
- **loan_id**: ID do empréstimo
- **payment_date**: Data do pagamento
- **amount_paid**: Valor pago
- **principal_paid**: Valor do principal pago
- **interest_paid**: Valor dos juros pagos
- **outstanding_balance**: Saldo devedor
- **payment_number**: Número da parcela

## 🚀 APIs Disponíveis

### Empréstimos
- `GET /api/loans` - Lista todos os empréstimos
- `POST /api/loans` - Cria novo empréstimo
- `GET /api/loans/{id}` - Busca empréstimo específico
- `PUT /api/loans/{id}` - Atualiza empréstimo
- `DELETE /api/loans/{id}` - Exclui empréstimo

### Pagamentos
- `GET /api/loans/{id}/payments` - Lista pagamentos de um empréstimo
- `POST /api/loans/{id}/payments` - Registra novo pagamento

### Dashboard
- `GET /api/dashboard/stats` - Estatísticas do dashboard

## 💡 Como Usar

### 1. Acessar o Sistema
Acesse https://lnh8imcn89k0.manus.space no seu navegador.

### 2. Dashboard
A tela inicial mostra um resumo completo dos seus investimentos:
- Total de empréstimos cadastrados
- Empréstimos ativos
- Receita mensal estimada
- Pagamentos em atraso

### 3. Cadastrar Novo Empréstimo
1. Clique em "Novo" na barra de navegação
2. Preencha todos os campos obrigatórios
3. Escolha o tipo de amortização (SAC ou PRICE)
4. Clique em "Salvar Empréstimo"

### 4. Gerenciar Empréstimos
1. Acesse "Empréstimos" na navegação
2. Use a barra de pesquisa para filtrar por nome
3. Use os botões de ação para visualizar, editar ou excluir

## 📊 Tipos de Amortização

### SAC (Sistema de Amortização Constante)
- Parcela do principal é fixa
- Juros incidem sobre o saldo devedor
- Parcelas decrescentes ao longo do tempo

### PRICE (Tabela Price)
- Parcelas fixas durante todo o período
- Maior pagamento de juros no início
- Amortização crescente do principal

## 🔐 Segurança

- Validação de dados no frontend e backend
- Sanitização de entradas
- Controle de CORS configurado
- Banco de dados SQLite com transações seguras

## 📱 Responsividade

O sistema foi desenvolvido com design responsivo, funcionando perfeitamente em:
- Desktop
- Tablets
- Smartphones

## 🎨 Design

- Interface moderna e intuitiva
- Paleta de cores profissional (azul e verde)
- Componentes UI consistentes
- Feedback visual para ações do usuário

## 📈 Métricas Calculadas

- **Taxa de Inadimplência**: Percentual de empréstimos em atraso
- **Receita Mensal**: Estimativa baseada nas taxas de juros
- **Capital Total**: Soma de todos os empréstimos ativos
- **Saldo Devedor**: Calculado dinamicamente com base nos pagamentos

## 🔄 Próximas Funcionalidades

- Sistema de notificações por email
- Relatórios em PDF
- Gráficos de performance
- Backup automático de dados
- Sistema de usuários múltiplos
- Integração com APIs bancárias

## 📞 Suporte

O sistema foi desenvolvido com as melhores práticas de desenvolvimento web e está pronto para uso em produção. Para suporte técnico ou melhorias, entre em contato com a equipe de desenvolvimento.

