# 🧪 Sistema de Controle Laboratório - Campos Sales

Sistema completo para gerenciamento de exames laboratoriais do laboratório de saúde de Campos Sales, Ceará.

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral do laboratório
- Estatísticas em tempo real
- Ações rápidas
- Exames recentes

### 👥 Gestão de Pacientes
- Cadastro completo de pacientes
- Busca e filtros avançados
- Histórico de exames
- Dados pessoais e contato

### 🧪 Gestão de Exames
- Todos os tipos de exames disponíveis:
  - **Beta HCG** - Teste de gravidez
  - **Dengue** - Diagnóstico de dengue
  - **Chikungunya** - Diagnóstico de chikungunya
  - **Zika** - Diagnóstico de zika
  - **COVID-19** - Teste para COVID-19
  - **PPD** - Teste tuberculínico
  - **Ingram** - Exame específico
  - **Chagas** - Diagnóstico de doença de Chagas
  - **Baciloscopia de Escarro** - Detecção de tuberculose

### 📈 Relatórios Mensais
- Relatórios detalhados por mês
- Contagem de exames por tipo
- Estatísticas de resultados
- Exportação em PDF
- Impressão direta

### 📊 Estatísticas Avançadas
- Análise de tendências
- Gráficos interativos
- Métricas de performance
- Insights e recomendações

## 🚀 Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **PostgreSQL** - Banco de dados robusto
- **Prisma** - ORM moderno
- **Lucide React** - Ícones elegantes

## 📱 Páginas Disponíveis

- **`/`** - Dashboard principal
- **`/pacientes`** - Lista de pacientes
- **`/pacientes/novo`** - Cadastro de novo paciente
- **`/pacientes/[id]`** - Detalhes do paciente
- **`/exames`** - Lista de exames
- **`/exames/novo`** - Cadastro de novo exame
- **`/exames/[id]`** - Detalhes do exame
- **`/relatorios`** - Relatórios mensais
- **`/estatisticas`** - Estatísticas avançadas

## 🛠️ Instalação e Configuração

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar banco de dados
Crie um arquivo `.env.local` na raiz do projeto:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/laboratorio_campos_sales"
```

### 3. Executar migrações
```bash
npm run db:migrate
```

### 4. Popular banco com dados de exemplo
```bash
npm run db:seed
```

### 5. Iniciar servidor de desenvolvimento
```bash
npm run dev
```

### 6. Acessar a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 Comandos do Banco de Dados

- `npm run db:generate` - Gerar cliente Prisma
- `npm run db:migrate` - Executar migrações
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Popular banco com dados de exemplo

## 🎨 Design System

O sistema utiliza um design system consistente com:
- **Cards de laboratório** - Layout padronizado para informações
- **Botões estilizados** - Ações claras e intuitivas
- **Inputs responsivos** - Formulários otimizados
- **Tabelas dinâmicas** - Dados organizados e filtráveis
- **Badges de status** - Indicadores visuais claros
- **Badges de tipos** - Identificação rápida de exames

## 📋 Estrutura do Projeto

```
src/app/
├── components/          # Componentes reutilizáveis
│   ├── AppLayout.tsx   # Layout principal
│   └── Navigation.tsx  # Menu de navegação
├── lib/                # Configurações e utilitários
│   └── prisma.ts       # Cliente Prisma
├── types/              # Definições de tipos
│   └── index.ts        # Tipos principais
├── utils/              # Funções utilitárias
│   └── formatters.ts   # Formatação de dados
├── pacientes/          # Páginas de pacientes
├── exames/             # Páginas de exames
├── relatorios/         # Páginas de relatórios
├── estatisticas/       # Páginas de estatísticas
├── globals.css         # Estilos globais
├── layout.tsx          # Layout raiz
└── page.tsx            # Página inicial
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 📄 Licença

MIT - Laboratório de Saúde de Campos Sales

---

**Desenvolvido para o Laboratório de Saúde de Campos Sales, Ceará** 🏥