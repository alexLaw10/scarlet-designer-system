import { newSpecPage } from '@stencil/core/testing';
import { ScarletCheckbox } from './scarlet-checkbox';

describe('scarlet-checkbox', () => {
  it('renders unchecked by default with a label wired via for/id', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckbox],
      html: `<scarlet-checkbox label="Aceito"></scarlet-checkbox>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    const label = page.root?.shadowRoot?.querySelector('label') as HTMLLabelElement;

    expect(input.checked).toBe(false);
    expect(label.getAttribute('for')).toBe(input.id);
    expect(label.textContent?.trim()).toBe('Aceito');
  });

  it('toggles checked and emits scarletChange on interaction', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckbox],
      html: `<scarlet-checkbox></scarlet-checkbox>`,
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

  it('applies the indeterminate DOM property from the prop', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckbox],
      html: `<scarlet-checkbox indeterminate></scarlet-checkbox>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.indeterminate).toBe(true);
  });

  it('disables the native input when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckbox],
      html: `<scarlet-checkbox disabled></scarlet-checkbox>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
