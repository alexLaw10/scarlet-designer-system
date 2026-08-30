import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputCurrency } from './scarlet-input-currency';

describe('scarlet-input-currency', () => {
  it('formats digits growing from the right, with thousands separators', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCurrency],
      html: '<scarlet-input-currency></scarlet-input-currency>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1234567';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('R$ 12.345,67');
  });

  it('emits the numeric amount, not the formatted string, on scarletInput', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCurrency],
      html: '<scarlet-input-currency></scarlet-input-currency>'
    });

    const inputSpy = jest.fn();
    page.root?.addEventListener('scarletInput', inputSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1234';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputSpy.mock.calls[0][0].detail).toBe(12.34);
  });

  it('exposes the numeric amount via getNumericValue()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCurrency],
      html: '<scarlet-input-currency value="R$ 1.234,56"></scarlet-input-currency>'
    });

    await expect(page.rootInstance.getNumericValue()).resolves.toBe(1234.56);
  });

  it('uses a custom currency symbol', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCurrency],
      html: '<scarlet-input-currency currency-symbol="US$"></scarlet-input-currency>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1234';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('US$ 12,34');
  });

  it('caps the raw digits at 15 instead of growing the value without bound', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCurrency],
      html: '<scarlet-input-currency></scarlet-input-currency>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '123456789012345678'; // 18 digits, well past the 15-digit cap
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('R$ 1.234.567.890.123,45');
  });
});
