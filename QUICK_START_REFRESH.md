# 🚀 Quick Start - Refresh Token

## **Em 3 passos simples:**

### **1️⃣ Como usar no código:**

```javascript
import { useAuth } from '../contexts/AuthContext';

function MeuComponente() {
  const { getToken, getRefreshToken, refreshAccessToken } = useAuth();
  
  // ✅ Pegar tokens (se necessário)
  const token = getToken();
  const refreshToken = getRefreshToken();
  
  // ✅ Renovar manualmente (raramente necessário)
  const newToken = await refreshAccessToken();
  
  // 🎉 TUDO É AUTOMÁTICO! Não precisa fazer nada!
  return <div>Meu conteúdo</div>;
}
```

---

### **2️⃣ O que acontece automaticamente:**

```
Login → Armazena tokens → Agenda renovação (25min)
                              ↓
                        [25 min depois]
                              ↓
                    Renova automaticamente
                              ↓
                      Sem interrupções! 🎉
```

---

### **3️⃣ O que você precisa fazer:**

## **NADA! 🎉**

O sistema cuida de tudo sozinho:
- ✅ Armazena refresh token no login
- ✅ Agenda renovação automática
- ✅ Renova antes de expirar
- ✅ Recupera de erros 401
- ✅ Desloga se falhar

---

## **🔍 Como ver funcionando:**

### **Console do navegador:**
```
✅ "Renovando token automaticamente..." ← Após 25 minutos
✅ "Token expirado, tentando renovar..." ← Se pegar 401
❌ "Erro ao renovar token:" ← Se falhar (desloga)
```

---

## **⏱️ Timeline:**

```
┌─────────────────────────────────────────┐
│  0min: Login                            │
│  ✅ Recebe token + refreshToken         │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  25min: Renovação Automática            │
│  ✅ Novos tokens                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  50min: Renovação Automática            │
│  ✅ Novos tokens                        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  75min: Renovação Automática            │
│  ✅ Novos tokens                        │
└─────────────────────────────────────────┘
              ↓
         ... continua ...
              ↓
┌─────────────────────────────────────────┐
│  7 dias: Refresh Token Expira           │
│  ⚠️ Usuário precisa fazer login        │
└─────────────────────────────────────────┘
```

---

## **🎯 Exemplos de Uso:**

### **Login (já atualizado):**
```javascript
// Login component
const response = await authService.login(email, password);
const { token, refreshToken, member } = response.data;

// ✅ Passa refreshToken também
login(member, token, refreshToken);
```

### **Fazer requisições (não muda nada!):**
```javascript
// Suas requisições continuam iguais!
const token = getToken();
const response = await fetch('/api/members', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Se token expirar (401), o sistema renova automaticamente!
```

---

## **📝 Checklist de Implementação:**

### **Backend (já feito):**
- ✅ Endpoint `/api/auth/refresh` funcionando
- ✅ Retorna `refreshToken` no login
- ✅ Valida refresh token no header `x-refresh-token`

### **Frontend (implementado agora):**
- ✅ `authService.refreshToken()` criado
- ✅ `AuthContext` atualizado com timer
- ✅ `Login` component passa refreshToken
- ✅ Renovação automática agendada
- ✅ Retry em 401 implementado

---

## **🐛 Solução de Problemas:**

### **"Token expirado" após login:**
❌ **Problema:** RefreshToken não está sendo armazenado  
✅ **Solução:** Verificar se API retorna `refreshToken`

### **Renovação não acontece:**
❌ **Problema:** Timer não foi agendado  
✅ **Solução:** Verificar console - deve mostrar agendamento

### **401 persiste mesmo com refresh:**
❌ **Problema:** RefreshToken inválido/expirado  
✅ **Solução:** Fazer login novamente (normal após 7 dias)

---

## **💻 Comandos Úteis:**

### **Ver tokens no console:**
```javascript
localStorage.getItem('token')
localStorage.getItem('refreshToken')
```

### **Forçar renovação (teste):**
```javascript
const { refreshAccessToken } = useAuth();
await refreshAccessToken();
```

### **Limpar tudo (reset):**
```javascript
localStorage.clear();
window.location.href = '/login';
```

---

## **✅ Está funcionando se:**

1. ✅ Login armazena 3 itens no localStorage: `token`, `refreshToken`, `user`
2. ✅ Console mostra timer agendado após login
3. ✅ Após 25 minutos, console mostra "Renovando token..."
4. ✅ Tokens no localStorage mudam após renovação
5. ✅ Sistema continua funcionando sem interrupções

---

## **🎉 Pronto!**

Seu sistema agora tem **renovação automática de tokens**!

**Não precisa fazer mais nada** - tudo funciona automaticamente! 🚀

---

**Dúvidas?**
📖 [REFRESH_TOKEN.md](./REFRESH_TOKEN.md) - Documentação completa  
📖 [REFRESH_TOKEN_SUMMARY.md](./REFRESH_TOKEN_SUMMARY.md) - Resumo técnico
