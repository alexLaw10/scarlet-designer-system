# Scarlet Designer System

Um sistema de design moderno e abrangente construído com Stencil.js Web Components.

## 🚀 Características

- **Web Components**: Componentes reutilizáveis que funcionam em qualquer framework
- **TypeScript First**: Totalmente tipado para melhor experiência de desenvolvimento
- **Stencil.js**: Framework moderno para Web Components
- **Storybook**: Documentação interativa de componentes
- **Design Tokens**: Sistema de tokens para consistência visual
- **Acessibilidade**: Componentes construídos com acessibilidade em mente
- **Responsivo**: Design adaptável para diferentes tamanhos de tela
- **Framework Agnostic**: Funciona com React, Vue, Angular ou vanilla JS

## 📦 Instalação

```bash
npm install @scarlet/design-system
```

### Uso em HTML

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="https://unpkg.com/@scarlet/design-system/dist/scarlet/scarlet.esm.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/@scarlet/design-system/dist/scarlet/scarlet.css">
</head>
<body>
  <scarlet-button>Clique aqui</scarlet-button>
</body>
</html>
```

### Uso em React

```tsx
import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';

// Define os custom elements
defineCustomElements();

function App() {
  return <scarlet-button>Clique aqui</scarlet-button>;
}
```

### Uso em Vue

```vue
<template>
  <scarlet-button>Clique aqui</scarlet-button>
</template>

<script>
import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';

defineCustomElements();
</script>
```

## 🛠️ Desenvolvimento

### Pré-requisitos

- Node.js >= 16
- npm ou yarn

### Scripts disponíveis

```bash
# Instalar dependências
npm install

# Modo desenvolvimento
npm run dev

# Build do projeto
npm run build

# Executar Storybook
npm run storybook

# Build do Storybook
npm run build-storybook

# Executar testes
npm run test

# Executar testes em modo watch
npm run test.watch

# Linting
npm run lint
npm run lint:fix

# Verificação de tipos
npm run type-check
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Web Components do design system
├── tokens/             # Design tokens (cores, tipografia, espaçamentos)
├── utils/              # Utilitários e helpers
├── types/              # Definições de tipos TypeScript
├── global/             # Estilos globais
└── index.ts           # Ponto de entrada principal
```

## 🎨 Design Tokens

O sistema utiliza design tokens para manter consistência visual:

- **Cores**: Paleta de cores primárias, secundárias e neutras
- **Tipografia**: Escalas de fontes e pesos
- **Espaçamentos**: Sistema de espaçamento consistente
- **Bordas**: Raio de bordas e estilos
- **Sombras**: Sistema de elevação

## 📚 Documentação

Acesse a documentação completa no Storybook:

```bash
npm run storybook
```

## 🧪 Testes

O projeto utiliza Jest para testes unitários e Puppeteer para testes E2E:

```bash
# Executar todos os testes
npm run test

# Executar apenas testes unitários
npm run test.spec

# Executar apenas testes E2E
npm run test.e2e

# Executar testes em modo watch
npm run test.watch
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Equipe

Desenvolvido pela equipe Scarlet Design System.
