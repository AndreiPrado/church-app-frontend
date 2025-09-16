#!/bin/bash

# Script de inicialização para o projeto Z'ele Church com Next.js e TypeScript
echo "===== Z'ele Church - Setup do Projeto ====="

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
  echo "Erro: Node.js não foi encontrado. Por favor, instale o Node.js (v18+)."
  echo "Visite: https://nodejs.org/"
  exit 1
fi

# Verificar versão do Node.js (recomendar pelo menos a 18)
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt "18" ]; then
  echo "Aviso: A versão do Node.js ($NODE_VERSION) é menor que a recomendada (18+)."
  echo "Algumas funcionalidades podem não funcionar corretamente."
  read -p "Deseja continuar? (s/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    exit 1
  fi
fi

# Verificar se o diretório node_modules existe
if [ -d "node_modules" ]; then
  read -p "Deseja reinstalar todas as dependências? (s/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Ss]$ ]]; then
    echo "Removendo node_modules existente..."
    rm -rf node_modules
    rm -rf .next
  fi
fi

# Instalar dependências
echo "\nInstalando dependências..."
npm install

if [ $? -ne 0 ]; then
  echo "\nErro ao instalar as dependências. Verifique sua conexão ou tente novamente."
  exit 1
fi

# Verificar tipos TypeScript
echo "\nVerificando tipos TypeScript..."
npm run type-check

# Verificar linting (opcional)
echo "\nVerificando linting..."
npm run lint

echo "\n===== CONFIGURAÇÃO CONCLUÍDA ====="
echo "Para iniciar o servidor de desenvolvimento:"
echo "  npm run dev"
echo
echo "O site estará disponível em: http://localhost:3000"
echo

# Perguntar se deseja iniciar o servidor imediatamente
read -p "Deseja iniciar o servidor de desenvolvimento agora? (s/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
  npm run dev
fi
