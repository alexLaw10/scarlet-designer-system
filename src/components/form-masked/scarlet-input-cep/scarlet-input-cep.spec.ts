import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputCep } from './scarlet-input-cep';

describe('scarlet-input-cep', () => {
  it('formats digits as XXXXX-XXX', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: `<scarlet-input-cep></scarlet-input-cep>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '01310100';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('01310-100');
  });

  it('emits scarletComplete exactly when the 8th digit is typed', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: `<scarlet-input-cep></scarlet-input-cep>`,
    });

    const completeSpy = jest.fn();
    page.root?.addEventListener('scarletComplete', completeSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '0131010';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    expect(completeSpy).not.toHaveBeenCalled();

    input.value = '01310100';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    expect(completeSpy).toHaveBeenCalledTimes(1);
    expect(completeSpy.mock.calls[0][0].detail).toBe('01310-100');
  });

  it('exposes the raw digits via getRawValue()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: `<scarlet-input-cep value="01310-100"></scarlet-input-cep>`,
    });

    await expect(page.rootInstance.getRawValue()).resolves.toBe('01310100');
  });
});
