# Contribuindo com o Scarlet Design System

## Setup

```bash
npm install
npm run dev          # build em watch mode + dev server
npm run storybook     # documentação interativa
```

## Criando um novo componente

1. Os componentes vivem organizados por categoria dentro de `src/components/`, não soltos direto na raiz:

   | Categoria | Pasta | Contém |
   |---|---|---|
   | Foundation | `foundation/` | Primitivas visuais base (ícone, heading, text) |
   | Layout | `layout/` | Composição de layout (stack, grid, grid-item, container) |
   | Actions | `actions/` | Elementos acionáveis (button) |
   | Form | `form/` | Campos de formulário padrão (input, textarea, select, checkbox, switch, radio, radio-group) |
   | Form Masked | `form-masked/` | Inputs mascarados/validados pt-BR (phone, cep, document, currency, percentage, date, credit-card, license-plate) |
   | Feedback | `feedback/` | Feedback e overlays (alert, badge, toast, tooltip, modal) |
   | Navigation | `navigation/` | Navegação (tabs, accordion) |
   | Data Display | `data-display/` | Exibição de dados (card, avatar, divider) |

   Escolha a categoria que melhor descreve o papel do componente; na dúvida, siga o precedente do componente mais parecido já existente na pasta.

   Crie a pasta `src/components/<categoria>/scarlet-<nome>/` com:
   - `scarlet-<nome>.tsx` — implementação do componente (Stencil)
   - `scarlet-<nome>.scss` — estilos, usando os design tokens de `src/tokens`
   - `scarlet-<nome>.stories.ts` — stories do Storybook
   - `scarlet-<nome>.spec.ts` — testes unitários com `newSpecPage`
   - `scarlet-<nome>.e2e.ts` — testes de interação real de browser (quando fizer sentido)

2. Convenções obrigatórias (garantidas pelo ESLint, `@stencil/eslint-config`):
   - Tag sempre prefixada `scarlet-` (`@stencil/ban-prefix`)
   - `@Prop()` sempre `readonly`, documentado com JSDoc (`@stencil/required-jsdoc`)
   - Decorators de `@Prop`/`@State`/`@Element`/`@Event` em uma linha; `@Method`/`@Listen`/`Host` em múltiplas linhas
   - Reutilize os tipos de `src/types` (`Size`, `Color`, `Variant`, `BaseComponentProps`) em vez de recriar union types
   - Use as custom properties de `src/tokens/*.scss` para cor, espaçamento, tipografia, sombra e borda — nunca valores "hardcoded". Para estilos de texto compostos, use os mixins de `src/tokens/typography-mixins.scss`
   - Todo componente interativo precisa de suporte a teclado e atributos ARIA coerentes com seu papel (veja `src/types/index.ts#AccessibilityProps`)
   - Emita eventos customizados prefixados (`scarletChange`, `scarletDismiss`, etc.) em vez de depender só do evento nativo, para funcionar bem em React/Vue/Angular
   - Imports de `src/types`, `src/utils` e `src/utils/*` usam os aliases `@/types`, `@/utils`, `@/utils/form-field` etc. (configurados em `tsconfig.json`) em vez de caminhos relativos `../../` — evita que o caminho quebre se o componente mudar de categoria. Import de outro componente usa `@/components/<categoria>/scarlet-<nome>/scarlet-<nome>`. Já os `@import` de `.scss` (Sass não entende os aliases do TS) continuam relativos, ex. `../../../tokens/field-mixins` a partir de `src/components/<categoria>/scarlet-<nome>/`.

3. Exporte o componente em `src/components/index.ts`, dentro do bloco da categoria correspondente.

4. Rode antes de abrir o PR:

```bash
npm run lint
npm run format:check
npm run type-check
npm run test
npm run build
```

## Commits

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org/) (validado pelo commitlint/husky no commit-msg hook):

```
feat(button): adiciona variante ghost
fix(input): corrige foco perdido ao limpar valor
docs(readme): atualiza instruções de instalação
```

## Testando em um framework real

Antes de considerar um componente pronto, valide em pelo menos um dos sandboxes:

```bash
npm run sandbox:install
npm run sandbox:react   # ou :vue, :angular, :vanilla
```

## Pull Requests

- Um componente (ou uma mudança coesa) por PR
- Inclua stories novas/atualizadas no Storybook
- Cobertura de testes mínima: 80% (branches/functions/lines/statements), configurada em `stencil.config.ts`
