import { newSpecPage } from '@stencil/core/testing';
import { ScarletHeading } from './scarlet-heading';

describe('scarlet-heading', () => {
  it('renders an h2 with the heading-xl variant by default', async () => {
    const page = await newSpecPage({
      components: [ScarletHeading],
      html: `<scarlet-heading>Título</scarlet-heading>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.tagName).toBe('H2');
    expect(tag?.classList.contains('scarlet-heading--heading-xl')).toBe(true);
  });

  it('renders the matching h1-h6 tag for each level', async () => {
    for (let level = 1; level <= 6; level++) {
      const page = await newSpecPage({
        components: [ScarletHeading],
        html: `<scarlet-heading level="${level}">Título</scarlet-heading>`,
      });
      const tag = page.root?.shadowRoot?.firstElementChild;
      expect(tag?.tagName).toBe(`H${level}`);
    }
  });

  it('lets an explicit variant override the level-based default', async () => {
    const page = await newSpecPage({
      components: [ScarletHeading],
      html: `<scarlet-heading level="1" variant="heading-sm">Título</scarlet-heading>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.tagName).toBe('H1');
    expect(tag?.classList.contains('scarlet-heading--heading-sm')).toBe(true);
    expect(tag?.classList.contains('scarlet-heading--display-md')).toBe(false);
  });

  it('applies color and align classes', async () => {
    const page = await newSpecPage({
      components: [ScarletHeading],
      html: `<scarlet-heading color="secondary" align="center">Título</scarlet-heading>`,
    });

    const tag = page.root?.shadowRoot?.firstElementChild;
    expect(tag?.classList.contains('scarlet-heading--color-secondary')).toBe(true);
    expect(tag?.classList.contains('scarlet-heading--align-center')).toBe(true);
  });
});
