import { newSpecPage } from '@stencil/core/testing';
import { ScarletDivider } from './scarlet-divider';

describe('scarlet-divider', () => {
  it('renders horizontal by default with role="separator"', async () => {
    const page = await newSpecPage({
      components: [ScarletDivider],
      html: `<scarlet-divider></scarlet-divider>`,
    });

    expect(page.root?.getAttribute('role')).toBe('separator');
    expect(page.root?.getAttribute('aria-orientation')).toBe('horizontal');
    expect(page.root?.classList.contains('scarlet-divider-host--horizontal')).toBe(true);
  });

  it('renders no label markup when label is not provided', async () => {
    const page = await newSpecPage({
      components: [ScarletDivider],
      html: `<scarlet-divider></scarlet-divider>`,
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-divider__label')).toBeNull();
  });

  it('renders the label centered between two lines when provided', async () => {
    const page = await newSpecPage({
      components: [ScarletDivider],
      html: `<scarlet-divider label="ou"></scarlet-divider>`,
    });

    const label = page.root?.shadowRoot?.querySelector('.scarlet-divider__label');
    const lines = page.root?.shadowRoot?.querySelectorAll('.scarlet-divider__line');

    expect(label?.textContent?.trim()).toBe('ou');
    expect(lines?.length).toBe(2);
  });

  it('ignores the label when orientation is vertical', async () => {
    const page = await newSpecPage({
      components: [ScarletDivider],
      html: `<scarlet-divider orientation="vertical" label="ou"></scarlet-divider>`,
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-divider__label')).toBeNull();
  });
});
