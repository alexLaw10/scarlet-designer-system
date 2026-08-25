import { newSpecPage } from '@stencil/core/testing';
import { ScarletSwitch } from './scarlet-switch';

describe('scarlet-switch', () => {
  it('renders off by default with role="switch"', async () => {
    const page = await newSpecPage({
      components: [ScarletSwitch],
      html: `<scarlet-switch></scarlet-switch>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('switch');
    expect(input.checked).toBe(false);
  });

  it('toggles checked and emits scarletChange', async () => {
    const page = await newSpecPage({
      components: [ScarletSwitch],
      html: `<scarlet-switch></scarlet-switch>`,
    });

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe(true);
    expect(page.rootInstance.checked).toBe(true);
  });

  it('disables the native input when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletSwitch],
      html: `<scarlet-switch disabled></scarlet-switch>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
