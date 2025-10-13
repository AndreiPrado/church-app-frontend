# Sistema Administrativo - Zele Church

## 📋 Visão Geral

Sistema completo de gerenciamento de membros da igreja com autenticação, dashboard, aprovações e perfil de usuário.

## 🚀 Funcionalidades Implementadas

### 1. **Autenticação**
- ✅ Tela de login com validação
- ✅ Context de autenticação (AuthContext)
- ✅ Proteção de rotas administrativas
- ✅ Persistência de sessão (localStorage)
- ✅ Logout com limpeza de dados

### 2. **Dashboard**
- ✅ Estatísticas gerais (total, aprovados, pendentes)
- ✅ Gráfico de distribuição por gênero
- ✅ Gráfico de estado civil
- ✅ Gráfico de cadastros por mês (últimos 6 meses)
- ✅ Lista de cadastros recentes
- ✅ Cards coloridos com ícones

### 3. **Listagem de Membros**
- ✅ Grid responsivo de membros
- ✅ Busca por nome, email, CPF ou telefone
- ✅ Filtro por status (todos, aprovados, pendentes, rejeitados)
- ✅ Cards com informações detalhadas
- ✅ Badges de status coloridos

### 4. **Aprovações**
- ✅ Lista de membros pendentes
- ✅ Aprovação individual com botão
- ✅ Rejeição individual com botão
- ✅ Seleção múltipla (checkbox)
- ✅ Aprovação em lote
- ✅ Visualização completa dos dados do membro
- ✅ Feedback com alertas flutuantes

### 5. **Minha Conta (Perfil)**
- ✅ Visualização de dados pessoais
- ✅ Modo de edição inline
- ✅ Atualização de informações de contato
- ✅ Atualização de endereço
- ✅ Atualização de estado civil e profissão
- ✅ Badge de status do membro
- ✅ Data de cadastro

### 6. **Layout Administrativo**
- ✅ Sidebar fixa com navegação
- ✅ Menu responsivo para mobile
- ✅ Informações do usuário logado
- ✅ Botão de logout
- ✅ Link para voltar ao site
- ✅ Design consistente com o tema

## 🎨 Design

### Cores Principais
- **Primária**: `#42a5f5` (Azul)
- **Sucesso**: `#4caf50` (Verde)
- **Aviso**: `#ffc107` (Amarelo)
- **Erro**: `#ff6b6b` (Vermelho)
- **Background**: Gradiente escuro (#0a0e1a → #1a1f2e)

### Ícones
- Utiliza **Phosphor Icons** (duotone)
- Tamanhos consistentes
- Cores temáticas

## 🔐 Rotas

### Públicas
- `/login` - Tela de login
- `/home` - Home pública
- `/signup` - Cadastro de membros
- `/signup/success` - Sucesso do cadastro

### Protegidas (requer autenticação)
- `/admin/dashboard` - Dashboard com estatísticas
- `/admin/members` - Listagem de membros
- `/admin/approvals` - Aprovações pendentes
- `/admin/profile` - Perfil do usuário logado

## 📡 API Endpoints Necessários

O frontend espera que a API backend forneça os seguintes endpoints:

### Autenticação
```
POST /api/auth/login
Body: { email, password }
Response: { user, token }
```

### Membros
```
GET /api/members/
Headers: { Authorization: Bearer <token> }
Response: [{ id, fullName, email, ... }]

GET /api/members/:id
Headers: { Authorization: Bearer <token> }
Response: { id, fullName, email, ... }

PUT /api/members/:id
Headers: { Authorization: Bearer <token> }
Body: { ...dadosAtualizados }
Response: { id, fullName, email, ... }

PATCH /api/members/:id/approve
Headers: { Authorization: Bearer <token> }
Response: { success: true }

PATCH /api/members/:id/reject
Headers: { Authorization: Bearer <token> }
Response: { success: true }

PATCH /api/members/approve-batch
Headers: { Authorization: Bearer <token> }
Body: { ids: [1, 2, 3] }
Response: { success: true, count: 3 }
```

### Estatísticas
```
GET /api/members/statistics
Headers: { Authorization: Bearer <token> }
Response: {
  total: 150,
  approved: 120,
  pending: 25,
  rejected: 5,
  currentMonth: 10,
  byGender: { male: 80, female: 70 },
  byMaritalStatus: { "Solteiro(a)": 50, "Casado(a)": 100 },
  byMonth: [
    { month: "Out", count: 15 },
    { month: "Nov", count: 20 },
    ...
  ],
  recentMembers: [
    { id, fullName, email, status, createdAt },
    ...
  ]
}
```

## 🛠️ Componentes Criados

```
src/
├── contexts/
│   └── AuthContext.jsx          # Context de autenticação
├── services/
│   └── authService.js           # Serviços de API
├── components/
│   ├── login/                   # Tela de login
│   ├── protected-route/         # HOC para rotas protegidas
│   ├── admin-layout/            # Layout administrativo
│   ├── dashboard/               # Dashboard com gráficos
│   ├── members-list/            # Listagem de membros
│   ├── approvals/               # Aprovações
│   └── profile/                 # Perfil do usuário
```

## 💡 Uso

### 1. Login
```
1. Acesse /login
2. Digite email e senha
3. Clique em "Entrar"
4. Redirecionamento automático para /admin/dashboard
```

### 2. Dashboard
- Visualize estatísticas gerais
- Analise gráficos de distribuição
- Veja cadastros recentes

### 3. Membros
- Busque por nome, email, CPF ou telefone
- Filtre por status
- Visualize cards com informações completas

### 4. Aprovações
- Visualize membros pendentes
- Aprove/rejeite individualmente
- Selecione múltiplos e aprove em lote

### 5. Minha Conta
- Visualize seus dados
- Clique em "Editar"
- Altere informações
- Salve as mudanças

## 📱 Responsividade

- ✅ Desktop (> 968px) - Sidebar fixa
- ✅ Tablet (768px - 968px) - Sidebar colapsável
- ✅ Mobile (< 768px) - Menu hambúrguer

## 🔒 Segurança

- Token JWT armazenado em localStorage
- Rotas protegidas com ProtectedRoute
- Redirecionamento automático ao login se não autenticado
- Token enviado em todas as requisições protegidas

## 🎯 Próximos Passos (Sugestões)

1. Implementar filtros avançados
2. Adicionar paginação na listagem
3. Exportar relatórios (PDF/Excel)
4. Adicionar upload de foto de perfil
5. Notificações push para novos cadastros
6. Histórico de ações (audit log)
7. Permissões por nível de acesso (admin, líder, etc)
8. Chat interno entre administradores

## 🚨 Importante

- Configure a variável `VITE_API_URL` no arquivo `.env`
- Certifique-se de que o backend está rodando
- Ajuste os endpoints conforme sua API
- Teste todas as funcionalidades antes de deploy
