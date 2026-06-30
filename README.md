# Church App Frontend

Frontend da aplicação web da Zele Church — site institucional com painel administrativo para gestão de membros, aprovações e carteirinhas digitais.

## Stack

- **React 18** com Vite 5
- **React Router DOM** — roteamento SPA com rotas protegidas
- **SCSS** — estilização modular por componente
- **Phosphor Icons** — biblioteca de ícones
- **react-scroll-parallax** — efeitos de parallax na landing page
- **jsPDF + QRCode** — geração de carteirinha de membro em PDF
- **react-imask** — máscaras de input (CPF, telefone, CEP)

## Estrutura do Projeto

```
src/
├── assets/              # Imagens e recursos estáticos
├── components/          # Componentes da aplicação
├── contexts/            # AuthContext (gerenciamento de sessão)
├── services/            # Camada de comunicação com a API
├── utils/               # Helpers (validadores, storage, geração de PDF)
├── routes.jsx           # Definição de rotas
└── main.jsx             # Entry point com providers
```

## Componentes Principais

### Público
- **Home** — Landing page com parallax, seções institucionais, ministérios e cultos
- **Navbar** — Navegação responsiva com menu mobile (hamburger) e avatar do usuário logado
- **Login** — Autenticação com validação de campos
- **New Believer** — Formulário público para cadastro de novos convertidos

### Painel Administrativo (rotas protegidas)
- **Dashboard** — Visão geral com estatísticas de membros
- **Members List** — Listagem e gerenciamento de membros
- **Approvals** — Aprovação/rejeição de solicitações de cadastro
- **Profile** — Perfil do membro logado com edição de dados
- **Member Card Page** — Carteirinha digital com QR Code
- **Member Card Validator** — Validação pública de carteirinha via QR Code
- **Member Edit Drawer** — Drawer lateral para edição de membros (admin)

### Compartilhados
- **Protected Route** — HOC para proteção de rotas autenticadas
- **Floating Alert** — Notificações flutuantes
- **Loading Spinner** — Indicador de carregamento
- **Confirmation Modal** — Modal de confirmação de ações
- **Photo Upload** — Componente de upload com preview

## Services

- **api.js** — Cliente HTTP com auto-refresh de tokens JWT (intercepta 401 e renova automaticamente)
- **authService.js** — Autenticação, CRUD de membros e roles
- **memberService.js** — Cadastro público de membros (sem autenticação)
- **uploadService.js** — Upload de fotos para storage externo
- **cepService.js** — Consulta de endereço via CEP

## Autenticação

O sistema utiliza JWT com refresh token. O `api.js` gerencia a renovação automática de tokens expirados, enfileirando requisições concorrentes durante o refresh. Tokens e dados do usuário são persistidos em localStorage via `utils/storage.js`.

## Setup

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com a URL da API

# Desenvolvimento
npm run dev

# Build (executa health-check do backend antes)
npm run build

# Build sem health-check
npm run build:force
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API backend |
| `FAIL_ON_HEALTH_CHECK` | Se `true`, o build falha quando o backend não responde |
