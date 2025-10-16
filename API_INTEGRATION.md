# 🔗 Integração com API Backend

## **Endpoints Corrigidos e Ajustados**

### **✅ Mudanças Implementadas**

---

## **1. Login** (`POST /api/auth/login`)

### **Formato da API:**
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "member": {
      "id": "uuid",
      "memberNumber": 123,
      "fullName": "Nome Completo",
      "email": "email@example.com",
      "status": "ativo|visitante|inativo|pendente",
      "roleId": "uuid"
    }
  }
}
```

### **Ajuste Feito:**
- ✅ Frontend já está usando `response.data.member` e `response.data.token`
- ✅ Tratamento de erros usando `errorData.detail`

---

## **2. Listar Membros** (`GET /api/members/`)

### **Formato da API:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "memberNumber": 123,
      "fullName": "Nome",
      "email": "email@example.com",
      "status": "ativo",
      "baptized": true,
      ...
    }
  ],
  "count": 50
}
```

### **Query Parameters:**
- `status` - Filtrar por status (ativo, visitante, inativo, pendente)
- `search` - Buscar por texto

### **Ajustes Feitos:**
- ✅ Retorna `result.data` (array) ao invés do objeto completo
- ✅ Suporte a query parameters `status` e `search`
- ✅ Tratamento de erros usando `errorData.detail`

---

## **3. Buscar Membro por ID** (`GET /api/members/{id}`)

### **Formato da API:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "memberNumber": 123,
    "fullName": "Nome Completo",
    "email": "email@example.com",
    "cpf": "000.000.000-00",
    "birthDate": "1990-01-01",
    "gender": "masculino",
    "maritalStatus": "Casado(a)",
    "phone": "11999999999",
    "profession": "Profissão",
    "baptized": true,
    "baptismDate": "2020-01-01",
    "photoUrl": "url_or_base64",
    "address": "Rua X, 123",
    "addressComplement": "Apto 45",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "00000-000",
    "status": "ativo",
    "roleId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### **Ajustes Feitos:**
- ✅ Retorna `result.data` (objeto) ao invés do objeto completo
- ✅ Tratamento de erros usando `errorData.detail`

---

## **4. Aprovar Membro** (`PATCH /api/members/{id}/approve`)

### **Body Requerido:**
```json
{
  "roleId": "uuid" // OBRIGATÓRIO!
}
```

### **Formato da API:**
```json
{
  "success": true,
  "data": {
    // Membro atualizado com status "ativo"
  }
}
```

### **Ajustes Feitos:**
- ⚠️ **CRÍTICO:** API requer `roleId` no body
- ✅ Método atualizado: `approveMember(id, roleId, token)`
- ✅ Retorna `result.data`
- ✅ Frontend precisa buscar roles antes e passar o roleId

---

## **5. Rejeitar Membro** (❌ Endpoint NÃO EXISTE)

### **Solução Implementada:**
Usa `PATCH /api/members/{id}` com `{ status: 'inativo' }`

```javascript
async rejectMember(id, token) {
  // Atualiza status para 'inativo'
  const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'inativo' })
  });
}
```

---

## **6. Aprovar em Lote** (❌ Endpoint NÃO EXISTE)

### **Solução Implementada:**
Faz múltiplas aprovações individuais usando `Promise.all()`

```javascript
async approveMembersBatch(ids, roleId, token) {
  const promises = ids.map(id => this.approveMember(id, roleId, token));
  return await Promise.all(promises);
}
```

### **Ajuste Necessário:**
- ⚠️ **IMPORTANTE:** Frontend precisa passar `roleId` ao aprovar em lote

---

## **7. Estatísticas** (`GET /api/members/stats`)

### **❌ Endpoint Incorreto:** `/api/members/statistics`  
### **✅ Endpoint Correto:** `/api/members/stats`

### **Formato da API:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "active": 120,
    "baptized": 100,
    "byGender": {
      "masculino": 80,
      "feminino": 70
    },
    "byAge": {
      "under18": 10,
      "between18and35": 50,
      "between36and60": 60,
      "over60": 30
    }
  }
}
```

### **Ajustes Feitos:**
- ✅ URL corrigida de `/statistics` para `/stats`
- ✅ Retorna `result.data`
- ⚠️ **ATENÇÃO:** Estrutura de dados diferente do esperado pelo Dashboard

---

## **8. Atualizar Membro** (`PATCH /api/members/{id}`)

### **❌ Método Incorreto:** `PUT`  
### **✅ Método Correto:** `PATCH`

### **Body:**
```json
{
  // Enviar apenas os campos que deseja atualizar
  "fullName": "Novo Nome",
  "email": "novo@email.com",
  "phone": "11999999999",
  "status": "ativo",
  ...
}
```

### **Ajustes Feitos:**
- ✅ Método mudado de PUT para PATCH
- ✅ Retorna `result.data`

---

## **9. Buscar Roles** (`GET /api/roles`) ✨ NOVO

### **Formato da API:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Membro",
      "description": "Membro regular da igreja",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### **Novo Método:**
```javascript
async getRoles(token) {
  const response = await fetch(`${API_BASE_URL}/api/roles`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return result.data || [];
}
```

---

## **📋 Resumo das Mudanças Críticas**

### **Endpoints que Mudaram:**
1. ✅ `/api/members/statistics` → `/api/members/stats`
2. ✅ `PUT /api/members/{id}` → `PATCH /api/members/{id}`

### **Endpoints que NÃO Existem:**
1. ❌ `/api/members/{id}/reject` - Substituído por PATCH com `status: 'inativo'`
2. ❌ `/api/members/approve-batch` - Substituído por múltiplas aprovações

### **Novos Parâmetros Obrigatórios:**
1. ⚠️ `approveMember(id, roleId, token)` - Agora requer `roleId`
2. ⚠️ `approveMembersBatch(ids, roleId, token)` - Agora requer `roleId`

### **Novos Métodos:**
1. ✨ `getRoles(token)` - Buscar roles disponíveis

---

## **🔧 Próximos Ajustes Necessários**

### **1. Dashboard Component**
- ⚠️ Ajustar para nova estrutura de estatísticas
- ⚠️ API retorna `byAge` ao invés de `byMonth`
- ⚠️ API não retorna `recentMembers`

### **2. Approvals Component**
- ⚠️ Buscar roles disponíveis com `getRoles()`
- ⚠️ Passar `roleId` ao aprovar membro
- ⚠️ Passar `roleId` ao aprovar em lote
- ⚠️ Permitir seleção de role antes de aprovar

### **3. Members List Component**
- ✅ Já deve funcionar (retorna array diretamente)

### **4. Profile Component**
- ✅ Já deve funcionar (usa getMemberById que retorna data)

---

## **📊 Status dos Campos**

### **Status Válidos na API:**
- `ativo` - Membro ativo
- `visitante` - Visitante
- `inativo` - Membro inativo/rejeitado
- `pendente` - Aguardando aprovação

### **⚠️ Frontend Usa:**
- `aprovado` ← ❌ NÃO EXISTE NA API
- `pendente` ← ✅ OK
- `rejeitado` ← ❌ Use `inativo`

### **Ajuste Necessário:**
Substituir referências a `aprovado` por `ativo` e `rejeitado` por `inativo` no frontend.

---

## **🔐 Autenticação**

Todos os endpoints protegidos requerem:
```javascript
headers: {
  'Authorization': 'Bearer <token>'
}
```

### **Sistema de Refresh Token:**

O sistema agora suporta renovação automática de tokens:

1. **Login** retorna:
   - `token` - Access token (30 minutos)
   - `refreshToken` - Refresh token (7 dias)
   - `member` - Dados do usuário

2. **Renovação Automática:**
   - Timer agendado para 25 minutos após login
   - Renova automaticamente antes de expirar
   - Sem interrupção para o usuário

3. **Renovação sob Demanda:**
   - Se requisição retornar 401, tenta renovar
   - Retry automático com novo token
   - Se falhar, desloga e redireciona

**Endpoint de Refresh:**
```javascript
POST /api/auth/refresh
Headers: { 'x-refresh-token': '<refresh-token>' }
Response: { success: true, data: { token, refreshToken, member } }
```

📚 **Documentação completa:** [REFRESH_TOKEN.md](./REFRESH_TOKEN.md)

### **Erros de Autenticação:**
- `401 Unauthorized` - Token inválido ou expirado (tenta renovar automaticamente)
- `403 Forbidden` - Sem permissão para acessar recurso

---

## **🚨 Tratamento de Erros Padronizado**

### **Formato de Erro da API:**
```json
{
  "error": "VALIDATION_ERROR",
  "code": "INVALID_EMAIL",
  "detail": "Mensagem detalhada em português"
}
```

### **No Frontend:**
```javascript
const errorData = await response.json();
throw new Error(errorData.detail || errorData.message || 'Erro genérico');
```

---

**Documentação atualizada em:** 2025-10-13  
**Backend API Version:** 1.0.0
