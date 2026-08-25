import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputLicensePlate } from './scarlet-input-license-plate';

describe('scarlet-input-license-plate', () => {
  it('formats an old-format plate as ABC-1234', async () => {
    const page = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate></scarlet-input-license-plate>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'abc1234';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('ABC-1234');
  });

  it('formats a Mercosul-format plate as ABC1D23, with no dash', async () => {
    const page = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate></scarlet-input-license-plate>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'abc1d23';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('ABC1D23');
  });

  it('reports the detected format via getFormat()', async () => {
    const oldFormat = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate value="ABC-1234"></scarlet-input-license-plate>'
    });
    await expect(oldFormat.rootInstance.getFormat()).resolves.toBe('old');

    const mercosul = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate value="ABC1D23"></scarlet-input-license-plate>'
    });
    await expect(mercosul.rootInstance.getFormat()).resolves.toBe('mercosul');
  });

  it('uppercases letters as they are typed', async () => {
    const page = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate></scarlet-input-license-plate>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'xyz';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('XYZ');
  });
});
