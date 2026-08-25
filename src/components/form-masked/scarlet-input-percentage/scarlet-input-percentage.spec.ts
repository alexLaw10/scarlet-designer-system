import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputPercentage } from './scarlet-input-percentage';

describe('scarlet-input-percentage', () => {
  it('formats digits as a decimal percentage growing from the right', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPercentage],
      html: '<scarlet-input-percentage></scarlet-input-percentage>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1234';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('12,34%');
  });

  it('emits the numeric percentage on scarletInput', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPercentage],
      html: '<scarlet-input-percentage></scarlet-input-percentage>'
    });

    const inputSpy = jest.fn();
    page.root?.addEventListener('scarletInput', inputSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '500';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputSpy.mock.calls[0][0].detail).toBe(5);
  });

  it('exposes the numeric value via getNumericValue()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPercentage],
      html: '<scarlet-input-percentage value="12,34%"></scarlet-input-percentage>'
    });

    await expect(page.rootInstance.getNumericValue()).resolves.toBe(12.34);
  });
});
