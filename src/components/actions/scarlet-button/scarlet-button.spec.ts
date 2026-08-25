import { newSpecPage } from '@stencil/core/testing';
import { ScarletButton } from './scarlet-button';

describe('scarlet-button', () => {
  it('renders the default (solid/primary/md) variant', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button>Enviar</scarlet-button>`,
    });

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(button).not.toBeNull();
    expect(button.classList.contains('scarlet-button--solid')).toBe(true);
    expect(button.classList.contains('scarlet-button--primary')).toBe(true);
    expect(button.classList.contains('scarlet-button--md')).toBe(true);
    expect(button.type).toBe('button');
    // Stencil's mock-doc doesn't reflect .disabled as an IDL property on
    // <button> the way it does on <input>, so check the attribute instead.
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('disables the native button and blocks scarletClick when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button disabled></scarlet-button>`,
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('scarletClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(button.hasAttribute('disabled')).toBe(true);

    button.click();
    await page.waitForChanges();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('marks aria-busy and blocks scarletClick while loading', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button loading></scarlet-button>`,
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('scarletClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.hasAttribute('disabled')).toBe(true);

    button.click();
    await page.waitForChanges();

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('emits scarletClick when enabled and clicked', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button></scarlet-button>`,
    });

    const clickSpy = jest.fn();
    page.root?.addEventListener('scarletClick', clickSpy);

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('applies the full-width host modifier', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button full-width></scarlet-button>`,
    });

    expect(page.root?.classList.contains('scarlet-button-host--full-width')).toBe(true);
  });

  it('reflects variant, color and size props onto the internal button classes', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `<scarlet-button variant="outline" color="error" size="lg"></scarlet-button>`,
    });

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('scarlet-button--outline')).toBe(true);
    expect(button.classList.contains('scarlet-button--error')).toBe(true);
    expect(button.classList.contains('scarlet-button--lg')).toBe(true);
  });

  it('applies the icon-only modifier class, and renders the start/end icon slots regardless', async () => {
    const page = await newSpecPage({
      components: [ScarletButton],
      html: `
        <scarlet-button icon-only aria-label="Fechar">
          <scarlet-icon slot="start" name="x"></scarlet-icon>
        </scarlet-button>
      `,
    });

    const button = page.root?.shadowRoot?.querySelector('button') as HTMLButtonElement;
    expect(button.classList.contains('scarlet-button--icon-only')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Fechar');

    const slot = page.root?.shadowRoot?.querySelector('slot[name="start"]');
    expect(slot).not.toBeNull();
  });
});
