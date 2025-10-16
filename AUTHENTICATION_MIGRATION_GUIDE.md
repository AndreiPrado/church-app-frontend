# 🔐 Guia de Migração - Sistema de Autenticação Melhorado

## 📋 Resumo das Mudanças

O sistema de autenticação foi completamente refatorado para incluir:

1. **Cliente HTTP centralizado** com auto-refresh de tokens
2. **Interceptors automáticos** - Tokens são adicionados automaticamente
3. **Renovação transparente** - Token expira, renova automaticamente, usuário não percebe
4. **Fila de requisições** - Evita múltiplas renovações simultâneas
5. **Suporte a cookies** - `withCredentials: true` para fingerprint do backend

## 🔧 O Que Mudou

### ✅ Novos Arquivos

1. **`src/utils/storage.js`** - Gerenciamento centralizado de tokens
2. **`src/services/api.js`** - Cliente HTTP com auto-refresh

### 🔄 Arquivos Refatorados

1. **`src/services/authService.js`**
   - Agora usa o cliente API centralizado
   - Métodos **NÃO** precisam mais do parâmetro `token`
   - Adiciona `credentials: 'include'` em login
   
2. **`src/contexts/AuthContext.jsx`**
   - Removido timer manual de refresh
   - Simplificado (de ~190 linhas para ~112 linhas)
   - Usa módulo `storage` para gerenciar dados
   - Removida função `refreshAccessToken` (feita automaticamente)

3. **`src/services/memberService.js`**
   - Adiciona `credentials: 'include'`
   - Documentação aprimorada

## 📝 Como Migrar Seus Componentes

### ❌ **ANTES** (Código Antigo)

```jsx
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

function MyComponent() {
  const { getToken } = useAuth();
  const [members, setMembers] = useState([]);

  const loadMembers = async () => {
    try {
      const token = getToken(); // ❌ Token manual
      const data = await authService.getMembers(token, 'ativo', 'search'); // ❌ Passa token
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const approveMember = async (id, roleId) => {
    const token = getToken(); // ❌ Token manual
    await authService.approveMember(id, roleId, token); // ❌ Passa token
  };
}
```

### ✅ **DEPOIS** (Código Novo)

```jsx
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

function MyComponent() {
  const { user } = useAuth(); // ✅ Não precisa mais de getToken
  const [members, setMembers] = useState([]);

  const loadMembers = async () => {
    try {
      // ✅ Sem passar token - automático!
      const data = await authService.getMembers('ativo', 'search');
      setMembers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const approveMember = async (id, roleId) => {
    // ✅ Sem passar token - automático!
    await authService.approveMember(id, roleId);
  };
}
```

## 🔍 Buscar e Substituir

### 1. Remover chamadas `getToken()`

**Buscar:**
```javascript
const token = getToken();
```

**Substituir:**
Simplesmente remova esta linha.

### 2. Atualizar chamadas de `authService`

**Buscar:**
```javascript
authService.getMembers(token, status, search)
authService.getMemberById(id, token)
authService.approveMember(id, roleId, token)
authService.rejectMember(id, token)
authService.getStatistics(token)
authService.updateMember(id, data, token)
authService.getRoles(token)
authService.approveMembersBatch(ids, roleId, token)
```

**Substituir:**
```javascript
authService.getMembers(status, search)
authService.getMemberById(id)
authService.approveMember(id, roleId)
authService.rejectMember(id)
authService.getStatistics()
authService.updateMember(id, data)
authService.getRoles()
authService.approveMembersBatch(ids, roleId)
```

### 3. Remover importação de `getToken` se não for mais usada

**Buscar:**
```javascript
const { getToken, user, logout } = useAuth();
```

**Substituir:**
```javascript
const { user, logout } = useAuth();
```

## 🎯 Lista de Componentes a Atualizar

Baseado na análise, os seguintes componentes precisam ser atualizados:

- [x] `src/services/authService.js` - **JÁ ATUALIZADO**
- [x] `src/contexts/AuthContext.jsx` - **JÁ ATUALIZADO**
- [x] `src/services/memberService.js` - **JÁ ATUALIZADO**
- [ ] `src/components/approvals/approvals.component.jsx`
- [ ] `src/components/dashboard/dashboard.component.jsx`
- [ ] `src/components/members-list/members-list.component.jsx`
- [ ] `src/components/profile/profile.component.jsx`

## 🚀 Como o Auto-Refresh Funciona

```
┌──────────────────────────────────────────────┐
│ 1. COMPONENTE FAZ REQUISIÇÃO                 │
│ authService.getMembers()                     │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ 2. API CLIENT ADICIONA TOKEN AUTOMATICAMENTE │
│ Authorization: Bearer <token>                │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ 3a. SE TOKEN VÁLIDO → RETORNA DADOS ✅       │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│ 3b. SE TOKEN EXPIRADO (401)                  │
│     ↓ API Client detecta automaticamente     │
│     ↓ Usa refresh token                      │
│     ↓ Pega novos tokens                      │
│     ↓ Repete requisição original             │
│     ↓ Retorna dados ✅                        │
│                                              │
│ USUÁRIO NEM PERCEBE! 🎉                      │
└──────────────────────────────────────────────┘
```

## ⚙️ Variáveis de Ambiente

Certifique-se de que o `.env` tenha:

```env
VITE_API_URL=http://localhost:3000
```

## 🧪 Como Testar

1. **Login normal** - Deve funcionar como antes
2. **Aguardar 30 minutos** - Token de acesso expira
3. **Fazer qualquer ação** - Deve renovar automaticamente
4. **Verificar console** - Verá "Token expirado, renovando automaticamente..."
5. **Ação completa** - Sem erro, sem logout forçado

## ⚠️ Importante

### Não Remover `getToken` do AuthContext

Mantivemos `getToken()` no AuthContext por compatibilidade, mas **não é mais necessário usá-lo** nos componentes. O cliente API busca o token automaticamente.

### Refresh Token Armazenado

O refresh token continua armazenado em `localStorage` mas agora é gerenciado pelo módulo `storage.js`.

### Cookies e CORS

O backend agora envia um cookie `__Secure-Fgp` (fingerprint) para segurança adicional. O frontend precisa ter `credentials: 'include'` em todas as requisições (já implementado no cliente API).

## 📚 Estrutura Final

```
src/
├── services/
│   ├── api.js            ✅ NOVO - Cliente HTTP centralizado
│   ├── authService.js    ✅ REFATORADO
│   ├── memberService.js  ✅ REFATORADO
│   └── cepService.js     (não afetado)
│
├── utils/
│   ├── storage.js        ✅ NOVO - Gerenciamento de tokens
│   └── validators.js     (não afetado)
│
├── contexts/
│   └── AuthContext.jsx   ✅ REFATORADO E SIMPLIFICADO
│
└── components/
    └── ...               ⚠️ PRECISA ATUALIZAR (remover `token` dos métodos)
```

## 🎉 Benefícios

1. **Menos código** - Componentes 30-40% menores
2. **Mais simples** - Não precisa gerenciar tokens manualmente
3. **Mais seguro** - Renovação automática, fingerprinting
4. **Melhor UX** - Usuário nunca é deslogado inesperadamente
5. **Menos bugs** - Lógica centralizada, testada uma vez

## 🆘 Problemas Comuns

### Erro: "Token não encontrado"

**Causa:** Usuário não está logado
**Solução:** Verificar se `user` existe antes de fazer requisições

### Erro: "Refresh token inválido"

**Causa:** Refresh token expirou (7 dias) ou foi revogado
**Solução:** Usuário precisa fazer login novamente (automático)

### Requisição não envia cookie

**Causa:** Falta `credentials: 'include'`
**Solução:** Já implementado no cliente API, mas verifique se backend aceita CORS

## 📞 Suporte

Se tiver dúvidas, consulte:
- `src/services/api.js` - Implementação do auto-refresh
- `README.md` do backend - Documentação completa da API
- Esta guia :)
