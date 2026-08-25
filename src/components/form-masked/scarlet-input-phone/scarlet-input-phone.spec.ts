import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputPhone } from './scarlet-input-phone';

describe('scarlet-input-phone', () => {
  it('formats as a landline while 10 or fewer digits are typed', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPhone],
      html: '<scarlet-input-phone></scarlet-input-phone>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1134567890';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('(11) 3456-7890');
  });

  it('switches to the mobile format once an 11th digit is typed', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPhone],
      html: '<scarlet-input-phone></scarlet-input-phone>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '11912345678';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('(11) 91234-5678');
  });

  it('ignores non-digit characters typed/pasted in', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPhone],
      html: '<scarlet-input-phone></scarlet-input-phone>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '(11) abc91234-5678';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('(11) 91234-5678');
  });

  it('exposes the raw digits via getRawValue()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPhone],
      html: '<scarlet-input-phone value="(11) 91234-5678"></scarlet-input-phone>'
    });

    await expect(page.rootInstance.getRawValue()).resolves.toBe('11912345678');
  });

  it('emits scarletInput with the formatted value on every keystroke', async () => {
    const page = await newSpecPage({
      components: [ScarletInputPhone],
      html: '<scarlet-input-phone></scarlet-input-phone>'
    });

    const inputSpy = jest.fn();
    page.root?.addEventListener('scarletInput', inputSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '1134567890';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0][0].detail).toBe('(11) 3456-7890');
  });
});
