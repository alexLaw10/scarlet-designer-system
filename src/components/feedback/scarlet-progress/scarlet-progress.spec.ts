import { newSpecPage } from '@stencil/core/testing';
import { ScarletProgress } from './scarlet-progress';

describe('scarlet-progress', () => {
  it('sets the fill width and aria-valuenow from value/max', async () => {
    const page = await newSpecPage({
      components: [ScarletProgress],
      html: `<scarlet-progress value="25" max="50"></scarlet-progress>`,
    });

    const fill = page.root?.shadowRoot?.querySelector('.scarlet-progress__fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
    expect(page.root?.getAttribute('aria-valuenow')).toBe('25');
    expect(page.root?.getAttribute('aria-valuemax')).toBe('50');
  });

  it('clamps a value over max to 100%', async () => {
    const page = await newSpecPage({
      components: [ScarletProgress],
      html: `<scarlet-progress value="150" max="100"></scarlet-progress>`,
    });

    const fill = page.root?.shadowRoot?.querySelector('.scarlet-progress__fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('shows the rounded percentage label only when showLabel is set', async () => {
    const withoutLabel = await newSpecPage({
      components: [ScarletProgress],
      html: `<scarlet-progress value="33" max="100"></scarlet-progress>`,
    });
    expect(withoutLabel.root?.shadowRoot?.querySelector('.scarlet-progress__label')).toBeNull();

    const withLabel = await newSpecPage({
      components: [ScarletProgress],
      html: `<scarlet-progress value="33" max="100" show-label></scarlet-progress>`,
    });
    expect(withLabel.root?.shadowRoot?.querySelector('.scarlet-progress__label')?.textContent?.trim()).toBe('33%');
  });
});
