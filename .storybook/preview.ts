import type { Preview } from '@storybook/web-components';
import { html, render as litRender, type TemplateResult } from 'lit';
import '../src/global/scarlet.scss';
// Registers every <scarlet-*> custom element with the browser. Without this,
// stories render the tags as plain, unstyled, undefined elements (just their
// slotted text, no shadow DOM) — nothing else in the Storybook setup does
// this registration. Requires a prior `npm run build` (this imports the
// compiled ../loader output, not the .tsx sources).
import { defineCustomElements } from '../loader';

defineCustomElements();

// Every story gets a "code" panel underneath it, one tab per framework —
// see the codeTabsDecorator comment below for how it's built and why all
// four tabs mostly show the same markup on purpose.
const CODE_TABS_STYLE = html`
  <style>
    .scarlet-code-tabs {
      margin-top: 20px;
      border: 1px solid var(--scarlet-color-border-secondary, #e2e8f0);
      border-radius: 8px;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    .scarlet-code-tabs__radio {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .scarlet-code-tabs__tablist {
      display: flex;
      gap: 2px;
      padding: 6px 6px 0;
      background: var(--scarlet-color-background-secondary, #f8fafc);
      border-bottom: 1px solid var(--scarlet-color-border-secondary, #e2e8f0);
    }
    .scarlet-code-tabs__tablist label {
      padding: 6px 14px;
      font-size: 13px;
      font-weight: 500;
      color: var(--scarlet-color-text-secondary, #64748b);
      cursor: pointer;
      border-radius: 6px 6px 0 0;
      user-select: none;
    }
    .scarlet-code-tabs__tablist label:hover {
      color: var(--scarlet-color-text-primary, #1e293b);
      background: rgba(0, 0, 0, 0.04);
    }
    .scarlet-code-tabs__panel {
      display: none;
      margin: 0;
      padding: 16px;
      background: var(--scarlet-color-neutral-900, #0f172a);
      color: var(--scarlet-color-neutral-50, #f8fafc);
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12.5px;
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
    }
    .scarlet-code-tabs__note {
      margin: 0;
      padding: 10px 16px;
      background: var(--scarlet-color-background-secondary, #f8fafc);
      border-top: 1px solid var(--scarlet-color-border-secondary, #e2e8f0);
      font-size: 12px;
      color: var(--scarlet-color-text-tertiary, #94a3b8);
    }
  </style>
`;

/**
 * Renders a story's TemplateResult into a detached, never-attached
 * container purely to read back the real markup its own `render()`
 * produced — the actual attributes/slotted content each story already maps
 * its args to, instead of guessing that mapping generically from `args`
 * (which would get it wrong for e.g. a `label` arg that's really slotted
 * text, not an attribute).
 */
function extractMarkup(storyResult: unknown, tagName: string | undefined): string | undefined {
  if (!tagName) return undefined;
  const container = document.createElement('div');
  try {
    litRender(storyResult as TemplateResult, container);
  } catch {
    return undefined;
  }
  const el = container.querySelector(tagName);
  if (!el) return undefined;

  // Stencil adds its own `hydrated` class to the host once the component
  // finishes initializing (a FOUC-prevention convention, not anything a
  // consumer writes themselves) — strip it so the snippet only shows
  // attributes someone would actually author by hand.
  const clone = el.cloneNode(false) as Element;
  const withoutHydrated = clone.getAttribute('class')?.split(/\s+/).filter((token) => token && token !== 'hydrated').join(' ');
  if (withoutHydrated) {
    clone.setAttribute('class', withoutHydrated);
  } else {
    clone.removeAttribute('class');
  }
  clone.innerHTML = el.innerHTML;
  return clone.outerHTML;
}

function prettyPrintTag(outerHtml: string): string {
  // Puts one attribute per line once there are more than ~2 — plain string
  // work (not a real HTML parser), good enough for the simple attribute
  // syntax every story actually produces.
  const match = outerHtml.match(/^<([a-z-]+)([^>]*)>/);
  if (!match) return outerHtml;
  const [, tag, attrString] = match;
  const attrs = attrString.match(/[a-zA-Z-]+(="[^"]*")?/g) ?? [];
  const rest = outerHtml.slice(match[0].length);

  if (attrs.length <= 2) {
    return outerHtml;
  }
  const indented = attrs.map((attr) => `  ${attr}`).join('\n');
  return `<${tag}\n${indented}\n>${rest}`;
}

/**
 * Adds a "code" block under every story's canvas, with one tab per
 * framework this design system ships sandboxes for. Deliberately shows the
 * *same* real markup in all four tabs rather than fabricating framework-
 * specific prop-binding syntax per component: for a static string/boolean
 * attribute, plain `attr="value"` HTML is already valid JSX/Vue-template/
 * Angular-template syntax as-is — the frameworks only genuinely diverge for
 * event listeners and array/object-typed props (`options`, `items`, `rows`…),
 * which vary per component in a way this generic decorator can't safely
 * guess, so those get a pointer to the real, hand-written, working examples
 * in sandboxes/ instead of invented code that might be wrong.
 */
const codeTabsDecorator = (Story: () => TemplateResult, context: { component?: unknown; id: string }) => {
  const storyResult = Story();
  const tagName = typeof context.component === 'string' ? context.component : undefined;
  const markup = extractMarkup(storyResult, tagName);

  if (!markup) {
    return storyResult;
  }

  // Lit's `${...}` text-position interpolation already inserts this as a
  // safely-escaped text node — the raw (unescaped) string is what belongs
  // here, not a pre-escaped one (that would show literal "&lt;" on screen
  // instead of "<").
  const pretty = prettyPrintTag(markup);
  const groupName = `scarlet-code-tabs-${context.id}`;
  const vanillaCode = `<!-- index.html, depois de defineCustomElements() ter rodado -->\n${pretty}`;
  const reactCode = `// .tsx — funciona como está, sem precisar de camelCase\n${pretty}`;
  const vueCode = `<!-- .vue <template> -->\n${pretty}`;
  const angularCode = `<!-- .html — precisa de schemas: [CUSTOM_ELEMENTS_SCHEMA] no @Component() -->\n${pretty}`;

  return html`
    ${storyResult}
    <div class="scarlet-code-tabs">
      ${CODE_TABS_STYLE}
      <input class="scarlet-code-tabs__radio" type="radio" name=${groupName} id="${groupName}-vanilla" checked />
      <input class="scarlet-code-tabs__radio" type="radio" name=${groupName} id="${groupName}-react" />
      <input class="scarlet-code-tabs__radio" type="radio" name=${groupName} id="${groupName}-vue" />
      <input class="scarlet-code-tabs__radio" type="radio" name=${groupName} id="${groupName}-angular" />
      <div class="scarlet-code-tabs__tablist">
        <label for="${groupName}-vanilla">Vanilla</label>
        <label for="${groupName}-react">React</label>
        <label for="${groupName}-vue">Vue</label>
        <label for="${groupName}-angular">Angular</label>
      </div>
      <style>
        #${groupName}-vanilla:checked ~ .scarlet-code-tabs__panel--${groupName}-vanilla,
        #${groupName}-react:checked ~ .scarlet-code-tabs__panel--${groupName}-react,
        #${groupName}-vue:checked ~ .scarlet-code-tabs__panel--${groupName}-vue,
        #${groupName}-angular:checked ~ .scarlet-code-tabs__panel--${groupName}-angular {
          display: block;
        }
      </style>
      <pre class="scarlet-code-tabs__panel scarlet-code-tabs__panel--${groupName}-vanilla"><code>${vanillaCode}</code></pre>
      <pre class="scarlet-code-tabs__panel scarlet-code-tabs__panel--${groupName}-react"><code>${reactCode}</code></pre>
      <pre class="scarlet-code-tabs__panel scarlet-code-tabs__panel--${groupName}-vue"><code>${vueCode}</code></pre>
      <pre class="scarlet-code-tabs__panel scarlet-code-tabs__panel--${groupName}-angular"><code>${angularCode}</code></pre>
      <p class="scarlet-code-tabs__note">
        Props que recebem array/objeto (options, items, rows, columns…) precisam ser setadas como propriedade JS, não
        atributo HTML — e eventos seguem o padrão scarletChange/scarletClick/etc. Exemplos completos por framework em
        <code>sandboxes/</code>.
      </p>
    </div>
  `;
};

const preview: Preview = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decorators: [codeTabsDecorator as any],
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    docs: {
      toc: true,
    },
  },
};

export default preview;
