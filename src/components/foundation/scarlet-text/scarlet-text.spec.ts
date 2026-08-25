import { newSpecPage } from '@stencil/core/testing';
import { ScarletText } from './scarlet-text';

describe('scarlet-text', () => {
  it('renders a <p> with body-md by default', async () => {
    const page = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text>Texto</scarlet-text>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.tagName).toBe('P');
    expect(tag?.classList.contains('scarlet-text--body-md')).toBe(true);
  });

  it('renders the requested tag via `as`', async () => {
    const page = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text as="span">Texto</scarlet-text>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.tagName).toBe('SPAN');
    expect(page.root?.classList.contains('scarlet-text-host--inline')).toBe(true);
  });

  it('applies an explicit weight override only when provided', async () => {
    const withoutWeight = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text>Texto</scarlet-text>`,
    });
    const withWeight = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text weight="bold">Texto</scarlet-text>`,
    });

    const tagWithout = withoutWeight.root?.shadowRoot?.firstElementChild;
    const tagWith = withWeight.root?.shadowRoot?.firstElementChild;

    // .filter(Boolean) guards against sparse/undefined entries mock-doc's
    // classList can produce for a token that was never actually added.
    expect(
      Array.from(tagWithout?.classList ?? [])
        .filter(Boolean)
        .some((c) => c.startsWith('scarlet-text--weight-')),
    ).toBe(false);
    expect(tagWith?.classList.contains('scarlet-text--weight-bold')).toBe(true);
  });

  it('applies the truncate modifier', async () => {
    const page = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text truncate>Texto</scarlet-text>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.classList.contains('scarlet-text--truncate')).toBe(true);
  });

  it('applies color and align classes', async () => {
    const page = await newSpecPage({
      components: [ScarletText],
      html: `<scarlet-text color="tertiary" align="right">Texto</scarlet-text>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.classList.contains('scarlet-text--color-tertiary')).toBe(true);
    expect(tag?.classList.contains('scarlet-text--align-right')).toBe(true);
  });
});
