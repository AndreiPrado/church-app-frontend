# Z'ele Church

Este é o frontend da aplicação para a Z'ele Church, desenvolvido com [Next.js](https://nextjs.org), TypeScript e arquitetura moderna. O projeto foi estruturado seguindo as melhores práticas de desenvolvimento web.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Este projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar a fonte [Lato](https://fonts.google.com/specimen/Lato), bem como o módulo de CSS (SCSS) para estilização avançada.

## Estrutura do Projeto

```
church-app-nextjs/
├── public/
│   └── assets/           # Imagens, vídeos e outros recursos estáticos
├── src/
│   ├── app/             # Pasta do App Router (Next.js 13+)
│   │   ├── (pages)/     # Grupo de rotas com layout compartilhado
│   │   │   ├── home/    # Rota /home
│   │   │   └── sing-up/ # Rota /sing-up
│   │   ├── globals.css  # Estilos globais
│   │   ├── layout.tsx   # Layout raiz da aplicação
│   │   └── page.tsx     # Página inicial (redirecionamento)
│   ├── components/      # Componentes reutilizáveis
│   │   ├── features/    # Componentes específicos de features
│   │   │   ├── home/    # Componente da página Home
│   │   │   ├── navbar/  # Componente de navegação
│   │   │   └── singup/  # Componente de cadastro
│   │   ├── layout/      # Componentes de layout
│   │   └── ui/          # Componentes de UI genéricos
│   ├── constants/       # Constantes e dados estáticos
│   ├── hooks/           # Hooks personalizados
│   ├── lib/             # Utilitários e funções
│   ├── styles/          # Estilos globais e temas
│   └── types/           # Tipos e interfaces TypeScript
```

## Tecnologias Utilizadas

- **Next.js 14**: Framework React com SSR, SSG e App Router
- **TypeScript**: Tipagem estática para maior segurança e produtividade
- **SCSS Modules**: Estilização com escopo local para componentes
- **React Scroll Parallax**: Efeitos de parallax para elementos
- **Phosphor Icons**: Biblioteca de ícones moderna

## Recursos e Funcionalidades

- **Efeito Parallax**: Implementado na página inicial usando react-scroll-parallax
- **Formulário Multi-Etapas**: Cadastro de membros com validação
- **Design Responsivo**: Layout adaptável para desktop e mobile
- **Rotas Otimizadas**: Utilizando o App Router do Next.js 14
- **Tipagem Forte**: Todo o código está em TypeScript

## Deployment

O projeto pode ser implantado facilmente usando a [Plataforma Vercel](https://vercel.com/new) ou qualquer outro serviço compatível com Next.js.
