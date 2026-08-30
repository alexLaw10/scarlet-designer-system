# Scarlet Design System - Sandboxes

Este diretório contém sandboxes para testar o Scarlet Design System com diferentes frameworks.

## 🚀 Frameworks Disponíveis

- **Vue.js** - Porta 3001
- **Angular** - Porta 3002  
- **React** - Porta 3003
- **Vanilla JS** - Porta 3004

## 📦 Instalação

### Instalar todas as dependências
```bash
npm run install:all
```

### Instalar dependências individuais
```bash
# Vue.js
npm run install:vue

# Angular
npm run install:angular

# React
npm run install:react

# Vanilla JS
npm run install:vanilla
```

## 🛠️ Desenvolvimento

### Executar todos os sandboxes
```bash
npm run dev:all
```

### Executar sandboxes individuais
```bash
# Vue.js (http://localhost:3001)
npm run dev:vue

# Angular (http://localhost:3002)
npm run dev:angular

# React (http://localhost:3003)
npm run dev:react

# Vanilla JS (http://localhost:3004)
npm run dev:vanilla
```

## 🏗️ Build

### Build de todos os sandboxes
```bash
npm run build:all
```

### Build individual
```bash
npm run build:vue
npm run build:angular
npm run build:react
npm run build:vanilla
```

## 🧹 Limpeza

### Limpar todos os sandboxes
```bash
npm run clean:all
```

### Limpar individual
```bash
npm run clean:vue
npm run clean:angular
npm run clean:react
npm run clean:vanilla
```

## 📁 Estrutura

```
sandboxes/
├── vue/                 # Sandbox Vue.js
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── angular/             # Sandbox Angular
│   ├── src/
│   ├── package.json
│   └── angular.json
├── react/               # Sandbox React
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── vanilla/             # Sandbox Vanilla JS
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── package.json         # Scripts de gerenciamento
```

## 🔧 Como Usar

1. **Instale as dependências** do design system principal:
   ```bash
   cd ../
   npm install
   npm run build
   ```

2. **Instale as dependências** dos sandboxes:
   ```bash
   cd sandboxes
   npm run install:all
   ```

3. **Execute o sandbox** desejado:
   ```bash
   npm run dev:vue     # Vue.js
   npm run dev:angular # Angular
   npm run dev:react   # React
   npm run dev:vanilla # Vanilla JS
   ```

4. **Teste os componentes** no navegador!

## 🎯 Objetivo

Estes sandboxes permitem:
- Testar a compatibilidade dos Web Components com diferentes frameworks
- Verificar se os componentes funcionam corretamente em cada ambiente
- Desenvolver e debugar componentes de forma isolada
- Demonstrar o uso do design system em projetos reais

## 📝 Notas

- Cada sandbox é independente e pode ser executado separadamente
- Os componentes são importados como dependência local do design system
- Todos os sandboxes incluem exemplos básicos de uso dos componentes (Button, Input, Card, Alert) e uma seção
  **"Formulário de cadastro"** mais completa — nome, e-mail, telefone, CPF/CNPJ, CEP, estado, data de nascimento,
  tipo de conta, mensagem, opt-in de novidades e aceite de termos, cobrindo praticamente todo componente de
  formulário do DS (inclusive os inputs mascarados pt-BR e o date picker) ligado a um único objeto de estado
  — o jeito mais rápido de ver, em cada framework, como ler/escrever `value`/`checked`/`options` e ouvir
  `scarletInput`/`scarletChange` num caso real
- Os estilos globais do design system são aplicados automaticamente
- **Nomes de evento**: os componentes disparam `CustomEvent`s em **camelCase** (`scarletInput`, `scarletChange`,
  `scarletClick`, `scarletDismiss`). Angular e Vanilla escutam com o nome exato (`(scarletInput)`,
  `addEventListener('scarletInput', ...)`); no Vue, escreva o listener também em camelCase (`@scarletInput`) — o
  compilador de template do Vue preserva a caixa como está escrita e **não** converte `@scarlet-input` (kebab) de
  volta para `scarletInput` em elementos nativos/custom (só faz isso para `emits` declarados de um componente Vue),
  então a versão kebab nunca dispara
- O Angular usa **Signals** (`signal()`/`computed()`, Angular 17+) para o estado dos dois sandboxes de exemplo, não
  propriedades de classe simples — chame-os como função no template (`form()`, não `form`)
