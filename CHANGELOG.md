# @scarlet/design-system

Todas as mudanças notáveis deste pacote são documentadas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/), e o
versionamento segue [SemVer](https://semver.org/lang/pt-BR/): **major** quando algo
que já existia muda de comportamento ou é removido/renomeado (uma app que usa a lib
pode quebrar ao atualizar), **minor** quando é só adição (componente novo, prop nova,
sem tirar nada de quem já usa), **patch** quando é correção de bug sem mudar API.

A partir daqui, cada entrada é gerada a partir dos changesets (`npm run changeset`)
que acompanham cada PR — ver `.changeset/README.md`. Mudança pendente (ainda não
versionada) não aparece aqui: ela vive como um arquivo em `.changeset/*.md` até
alguém rodar `npm run version-packages`, que consome todos os pendentes de uma vez,
decide o próximo número de versão (o maior bump entre eles) e escreve a seção nova
bem no topo deste arquivo — automaticamente, não precisa editar isso à mão depois
do 1.0.0. As entradas abaixo de 1.0.0 foram escritas à mão, retroativas, resumindo
o que já existia antes desse processo começar.

## [1.0.0] - Primeiro release

Biblioteca completa de componentes, base do design system. Como é o primeiro
corte publicável (nada disso rodou em produção em nenhuma app consumidora antes),
não há mudanças "breaking" a listar em relação a uma versão anterior — é o ponto
de partida que toda versão futura vai comparar contra.

### Foundation

- `scarlet-icon`, `scarlet-heading`, `scarlet-text`, `scarlet-link`

### Layout

- `scarlet-stack`, `scarlet-grid` (+ `scarlet-grid-item`, com span responsivo por
  breakpoint e `justify`), `scarlet-container`, `scarlet-toolbar`

### Actions

- `scarlet-button` (variantes solid/outline/ghost/link, `iconOnly`)
- `scarlet-copy` — copia pro clipboard com feedback visual

### Form

- `scarlet-input`, `scarlet-textarea`, `scarlet-select`, `scarlet-combobox`,
  `scarlet-checkbox` (+ `scarlet-checkbox-group`), `scarlet-switch`,
  `scarlet-radio` (+ `scarlet-radio-group`, roving tabindex WAI-ARIA),
  `scarlet-file-upload` (drag-and-drop), `scarlet-number-input`

### Inputs mascarados (pt-BR)

- `scarlet-input-phone`, `scarlet-input-cep`, `scarlet-input-document` (CPF/CNPJ),
  `scarlet-input-currency`, `scarlet-input-percentage`, `scarlet-input-date`,
  `scarlet-date-picker`, `scarlet-date-range-picker`, `scarlet-input-credit-card`,
  `scarlet-input-license-plate`
- Todos bloqueiam caractere inválido antes de entrar no campo (`onBeforeInput`),
  não só corrigem depois, e têm `maxlength` correto pro formato de cada um.

### Feedback / overlays

- `scarlet-alert`, `scarlet-badge`, `scarlet-toast`, `scarlet-tooltip`,
  `scarlet-modal` (rodapé com grupos `footer-start`/`footer-end`, cada um
  aceitando 1-3 botões em qualquer combinação), `scarlet-drawer`,
  `scarlet-skeleton`, `scarlet-spinner` (variante `logo` com a marca Scarlet),
  `scarlet-progress`, `scarlet-popover`

### Navigation

- `scarlet-tabs`, `scarlet-breadcrumb`, `scarlet-menu`, `scarlet-pagination`,
  `scarlet-accordion`

### Data display

- `scarlet-card`, `scarlet-table` (sort multi-coluna com shift+clique, reordenar
  colunas/linhas por drag-and-drop, cabeçalho fixo, skeleton no loading),
  `scarlet-avatar` (+ `scarlet-avatar-group`), `scarlet-chip`, `scarlet-divider`,
  `scarlet-empty-state`, `scarlet-stat`, `scarlet-timeline`

### Infraestrutura

- Tokens de design (cores com contraste WCAG AA, tipografia, espaçamento,
  bordas, breakpoints), sandboxes de exemplo (Vue, React, Angular, vanilla JS),
  Storybook com abas de código por framework, testes automatizados (Jest +
  `@stencil/core/testing`) para todos os componentes.

[1.0.0]: https://github.com/alexLaw10/scarlet-designer-system/releases/tag/v1.0.0
