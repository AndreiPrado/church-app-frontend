# 🔄 Sistema de Refresh Token

## **Visão Geral**

O sistema de autenticação do frontend agora inclui suporte completo para **refresh tokens**, permitindo renovação automática de tokens de acesso sem exigir que o usuário faça login novamente.

---

## **📋 Como Funciona**

### **1. Fluxo de Autenticação**

```
┌─────────┐                 ┌─────────┐                 ┌─────────┐
│ Cliente │                 │   API   │                 │   DB    │
└────┬────┘                 └────┬────┘                 └────┬────┘
     │                           │                           │
     │  POST /api/auth/login     │                           │
     ├──────────────────────────>│                           │
     │  { email, password }      │                           │
     │                           │  Verificar credenciais    │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │<──────────────────────────┤
     │                           │  Gerar tokens JWT         │
     │                           │                           │
     │                           │  Salvar refreshToken      │
     │                           ├──────────────────────────>│
     │                           │                           │
     │  { token, refreshToken,   │                           │
     │    member }               │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  Armazenar em localStorage│                           │
     │  Agendar renovação (25min)│                           │
     │                           │                           │
```

### **2. Renovação Automática**

```
┌─────────┐                 ┌─────────┐                 ┌─────────┐
│ Cliente │                 │   API   │                 │   DB    │
└────┬────┘                 └────┬────┘                 └────┬────┘
     │                           │                           │
     │  [25 minutos depois]      │                           │
     │  POST /api/auth/refresh   │                           │
     ├──────────────────────────>│                           │
     │  Header: x-refresh-token  │                           │
     │                           │  Verificar refreshToken   │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │<──────────────────────────┤
     │                           │  Revogar token antigo     │
     │                           ├──────────────────────────>│
     │                           │                           │
     │                           │  Gerar novos tokens       │
     │                           ├──────────────────────────>│
     │                           │                           │
     │  { token, refreshToken,   │                           │
     │    member }               │                           │
     │<──────────────────────────┤                           │
     │                           │                           │
     │  Atualizar localStorage   │                           │
     │  Reagendar renovação      │                           │
     │                           │                           │
```

### **3. Renovação sob Demanda (401)**

```
┌─────────┐                 ┌─────────┐
│ Cliente │                 │   API   │
└────┬────┘                 └────┬────┘
     │                           │
     │  GET /api/members         │
     ├──────────────────────────>│
     │  Authorization: Bearer... │
     │                           │
     │  401 Unauthorized         │
     │<──────────────────────────┤
     │                           │
     │  POST /api/auth/refresh   │
     ├──────────────────────────>│
     │  x-refresh-token: ...     │
     │                           │
     │  { token, refreshToken }  │
     │<──────────────────────────┤
     │                           │
     │  GET /api/members (retry) │
     ├──────────────────────────>│
     │  Authorization: Bearer... │
     │                           │
     │  200 OK                   │
     │<──────────────────────────┤
     │                           │
```

---

## **🔧 Implementação**

### **1. AuthService (src/services/authService.js)**

#### **Método `refreshToken()`**
```javascript
async refreshToken(refreshToken) {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-refresh-token': refreshToken,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao renovar token');
  }

  const result = await response.json();
  // API retorna { success: true, data: { token, refreshToken, member } }
  return result.data;
}
```

#### **Método `fetchWithAuth()` - Renovação Automática em Erro 401**
```javascript
async fetchWithAuth(url, options = {}, refreshTokenValue = null) {
  const token = localStorage.getItem('token');
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...(options.headers || {}),
    }
  });

  // Se receber 401, tentar renovar o token
  if (response.status === 401 && refreshTokenValue) {
    const refreshData = await this.refreshToken(refreshTokenValue);
    
    // Atualizar tokens no localStorage
    localStorage.setItem('token', refreshData.token);
    localStorage.setItem('refreshToken', refreshData.refreshToken);
    localStorage.setItem('user', JSON.stringify(refreshData.member));

    // Tentar novamente a requisição com novo token
    return await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${refreshData.token}`,
      }
    });
  }

  return response;
}
```

---

### **2. AuthContext (src/contexts/AuthContext.jsx)**

#### **Renovação Automática Agendada**

O `AuthContext` agenda automaticamente a renovação do token **25 minutos** após o login (5 minutos antes de expirar):

```javascript
const scheduleTokenRefresh = useCallback(() => {
  const refreshTime = 25 * 60 * 1000; // 25 minutos em ms
  
  const timer = setTimeout(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (refreshToken) {
      try {
        console.log('Renovando token automaticamente...');
        const refreshData = await authService.refreshToken(refreshToken);
        
        // Atualizar tokens e usuário
        localStorage.setItem('token', refreshData.token);
        localStorage.setItem('refreshToken', refreshData.refreshToken);
        localStorage.setItem('user', JSON.stringify(refreshData.member));
        setUser(refreshData.member);
        
        // Agendar próximo refresh
        scheduleTokenRefresh();
      } catch (error) {
        console.error('Erro ao renovar token:', error);
        logout();
      }
    }
  }, refreshTime);

  setRefreshTokenTimer(timer);
}, [refreshTokenTimer, logout]);
```

#### **Funções Exportadas**

```javascript
const value = {
  user,
  login,
  logout,
  updateUser,
  isAuthenticated,
  getToken,                  // Retorna access token
  getRefreshToken,           // Retorna refresh token
  refreshAccessToken,        // Renova token manualmente
  loading
};
```

---

### **3. Login Component**

Atualizado para armazenar o `refreshToken` recebido da API:

```javascript
const response = await authService.login(formData.email, formData.password);

// A API retorna { success: true, data: { member, token, refreshToken } }
const userData = response.data?.member;
const token = response.data?.token;
const refreshToken = response.data?.refreshToken;

// Passar refreshToken para o AuthContext
login(userData, token, refreshToken);
```

---

## **⏱️ Tempos de Expiração**

| Token | Duração | Renovação |
|-------|---------|-----------|
| **Access Token** | 30 minutos | Automática aos 25 minutos |
| **Refresh Token** | 7 dias | A cada renovação do access token |

---

## **🔐 Armazenamento**

### **localStorage**

```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",         // Access Token (30min)
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Refresh Token (7d)
  "user": "{\"id\":\"uuid\",\"fullName\":\"...\",\"email\":\"...\"}"
}
```

### **Banco de Dados (Backend)**

```sql
refresh_tokens {
  id: uuid,
  token: varchar(500),        -- Hash do refresh token
  member_id: uuid,            -- Referência ao membro
  user_agent: varchar(255),   -- Navegador/dispositivo
  ip: varchar(50),            -- IP do usuário
  expires_at: timestamp,      -- Data de expiração (7 dias)
  revoked: boolean,           -- Se foi revogado
  created_at: timestamp
}
```

---

## **🎯 Casos de Uso**

### **1. Login Inicial**
```javascript
// Usuário faz login
const { token, refreshToken, member } = await authService.login(email, password);

// Tokens armazenados
localStorage.setItem('token', token);
localStorage.setItem('refreshToken', refreshToken);

// Renovação agendada para 25 minutos
scheduleTokenRefresh();
```

### **2. Renovação Automática**
```javascript
// Após 25 minutos, timer dispara
const refreshData = await authService.refreshToken(storedRefreshToken);

// Novos tokens armazenados
localStorage.setItem('token', refreshData.token);
localStorage.setItem('refreshToken', refreshData.refreshToken);

// Próxima renovação agendada para mais 25 minutos
```

### **3. Requisição com Token Expirado**
```javascript
// Requisição retorna 401
const response = await fetch('/api/members', {
  headers: { 'Authorization': `Bearer ${expiredToken}` }
});

// Se 401, renovar e tentar novamente
if (response.status === 401) {
  const newToken = await refreshAccessToken();
  // Retry com novo token
}
```

### **4. Logout**
```javascript
// Limpar timer de renovação
clearTimeout(refreshTokenTimer);

// Limpar localStorage
localStorage.removeItem('token');
localStorage.removeItem('refreshToken');
localStorage.removeItem('user');

// Redirecionar para login
navigate('/login');
```

---

## **🛡️ Segurança**

### **Proteções Implementadas**

1. **Tokens de Curta Duração:**
   - Access token expira em 30 minutos
   - Minimiza janela de uso em caso de roubo

2. **Rotação de Refresh Tokens:**
   - Novo refresh token a cada renovação
   - Token antigo é revogado automaticamente

3. **Fingerprint do Dispositivo:**
   - Hash do user-agent + IP armazenado no token
   - Dificulta uso em outro dispositivo

4. **Armazenamento no Banco:**
   - Refresh tokens armazenados com hash
   - Possibilidade de revogar tokens específicos

5. **Limpeza Automática:**
   - Tokens expirados removidos do banco
   - Evita acúmulo de tokens inválidos

6. **Redirecionamento Automático:**
   - Se renovação falhar, usuário é deslogado
   - Previne uso de tokens inválidos

---

## **⚠️ Tratamento de Erros**

### **Erro ao Renovar Token**
```javascript
try {
  const refreshData = await authService.refreshToken(refreshToken);
} catch (error) {
  console.error('Erro ao renovar token:', error);
  
  // Limpar dados e redirecionar
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.location.href = '/login';
}
```

### **Token Expirado Durante Requisição**
```javascript
// authService.fetchWithAuth() trata automaticamente
const response = await authService.fetchWithAuth(url, options, refreshToken);
```

### **Refresh Token Inválido**
```javascript
// Backend retorna 401
{
  "error": "Refresh token inválido ou expirado"
}

// Frontend desloga e redireciona
logout();
navigate('/login');
```

---

## **📊 Fluxograma Completo**

```
                 ┌─────────────────┐
                 │  Usuário faz    │
                 │  Login          │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Recebe tokens: │
                 │  - Access Token │
                 │  - Refresh Token│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Armazena no    │
                 │  localStorage   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Agenda refresh │
                 │  em 25 minutos  │
                 └────────┬────────┘
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌─────────────────┐              ┌─────────────────┐
│  Timer dispara  │              │  Requisição com │
│  (25 min)       │              │  401 Unauthorized│
└────────┬────────┘              └────────┬────────┘
         │                                │
         └────────────┬───────────────────┘
                      │
                      ▼
            ┌─────────────────┐
            │  Renovar token  │
            │  (refresh)      │
            └────────┬────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│  Sucesso:       │    │  Erro:          │
│  - Novos tokens │    │  - Deslogar     │
│  - Reagendar    │    │  - Redirecionar │
│  - Continuar    │    │  - Login        │
└─────────────────┘    └─────────────────┘
```

---

## **🧪 Testes**

### **1. Testar Login e Renovação**
```bash
# 1. Fazer login
# 2. Observar console: "Token será renovado em 25 minutos"
# 3. Aguardar 25 minutos
# 4. Observar console: "Renovando token automaticamente..."
# 5. Verificar localStorage - tokens devem ser diferentes
```

### **2. Testar Renovação em Erro 401**
```bash
# 1. Fazer login
# 2. Aguardar access token expirar (30+ minutos)
# 3. Fazer requisição à API
# 4. Observar console: "Token expirado, tentando renovar..."
# 5. Requisição deve ser bem-sucedida após renovação
```

### **3. Testar Falha na Renovação**
```bash
# 1. Fazer login
# 2. Remover manualmente refreshToken do localStorage
# 3. Aguardar timer disparar (25 min)
# 4. Observar: deve deslogar e redirecionar para /login
```

---

## **📝 Notas Importantes**

1. ⚠️ **Não compartilhar tokens** - Tokens são pessoais e não devem ser expostos
2. ⚠️ **HTTPS obrigatório** - Em produção, sempre use HTTPS
3. ✅ **Renovação transparente** - Usuário não precisa fazer nada
4. ✅ **Múltiplos dispositivos** - Cada dispositivo tem seu próprio refresh token
5. ✅ **Segurança reforçada** - Sistema de rotação e revogação implementado

---

## **🚀 Próximas Melhorias**

1. **Renovação silenciosa** - Fazer refresh em background sem interromper usuário
2. **Indicador visual** - Mostrar quando token está sendo renovado
3. **Retry automático** - Tentar renovar múltiplas vezes antes de deslogar
4. **Notificação de logout** - Avisar usuário quando sessão expirar
5. **Histórico de dispositivos** - Permitir usuário ver e revogar tokens ativos

---

**Última atualização:** 2025-10-16 01:30  
**Desenvolvedor:** Andrei Prado  
**Status:** ✅ Implementado e Testado
