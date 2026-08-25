import { newSpecPage } from '@stencil/core/testing';
import { ScarletAlert } from './scarlet-alert';

describe('scarlet-alert', () => {
  it('renders with role="alert" and info/soft defaults', async () => {
    const page = await newSpecPage({
      components: [ScarletAlert],
      html: `<scarlet-alert>Mensagem</scarlet-alert>`,
    });

    expect(page.root?.getAttribute('role')).toBe('alert');
    expect(page.root?.classList.contains('scarlet-alert-host--info')).toBe(true);
    expect(page.root?.classList.contains('scarlet-alert-host--soft')).toBe(true);
  });

  it('does not render a dismiss button by default', async () => {
    const page = await newSpecPage({
      components: [ScarletAlert],
      html: `<scarlet-alert>Mensagem</scarlet-alert>`,
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-alert__dismiss')).toBeNull();
  });

  it('emits scarletDismiss and hides itself when dismissed', async () => {
    const page = await newSpecPage({
      components: [ScarletAlert],
      html: `<scarlet-alert dismissible>Mensagem</scarlet-alert>`,
    });

    const dismissSpy = jest.fn();
    page.root?.addEventListener('scarletDismiss', dismissSpy);

    const button = page.root?.shadowRoot?.querySelector('.scarlet-alert__dismiss') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(dismissSpy).toHaveBeenCalledTimes(1);
    expect(page.root?.shadowRoot?.querySelector('.scarlet-alert__content')).toBeNull();
  });

  it('stays visible when scarletDismiss is prevented by a listener', async () => {
    const page = await newSpecPage({
      components: [ScarletAlert],
      html: `<scarlet-alert dismissible>Mensagem</scarlet-alert>`,
    });

    page.root?.addEventListener('scarletDismiss', (event) => event.preventDefault());

    const button = page.root?.shadowRoot?.querySelector('.scarlet-alert__dismiss') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-alert__content')).not.toBeNull();
  });

  it('omits the icon when icon=false', async () => {
    const page = await newSpecPage({
      components: [ScarletAlert],
      html: `<scarlet-alert icon="false">Mensagem</scarlet-alert>`,
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-alert__icon')).toBeNull();
  });
});
