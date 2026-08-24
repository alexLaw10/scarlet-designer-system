import { newSpecPage } from '@stencil/core/testing';
import { ScarletRadio } from './scarlet-radio';

describe('scarlet-radio', () => {
  it('renders unchecked by default', async () => {
    const page = await newSpecPage({
      components: [ScarletRadio],
      html: `<scarlet-radio value="a" label="Opção A"></scarlet-radio>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('radio');
    expect(input.checked).toBe(false);
    expect(input.value).toBe('a');
  });

  it('emits scarletChange(true) when selected', async () => {
    const page = await newSpecPage({
      components: [ScarletRadio],
      html: `<scarlet-radio value="a"></scarlet-radio>`,
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

  it('reflects the disabled prop on the native input', async () => {
    const page = await newSpecPage({
      components: [ScarletRadio],
      html: `<scarlet-radio disabled></scarlet-radio>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
