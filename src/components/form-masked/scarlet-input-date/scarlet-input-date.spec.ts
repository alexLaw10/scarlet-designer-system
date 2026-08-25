import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputDate } from './scarlet-input-date';

describe('scarlet-input-date', () => {
  it('formats digits as DD/MM/AAAA', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDate],
      html: '<scarlet-input-date></scarlet-input-date>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '31122026';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('31/12/2026');
  });

  it('accepts a real leap-year date (29/02) as valid', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDate],
      html: '<scarlet-input-date value="29/02/2024"></scarlet-input-date>'
    });

    await expect(page.rootInstance.isValid()).resolves.toBe(true);
  });

  it('rejects 31/02 as invalid, even though it is 8 digits', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDate],
      html: '<scarlet-input-date value="31/02/2026"></scarlet-input-date>'
    });

    await expect(page.rootInstance.isValid()).resolves.toBe(false);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    const message = page.root?.shadowRoot?.querySelector('.scarlet-input-date__message--error');
    expect(message?.textContent?.trim()).toBe('Data inválida.');
  });

  it('toDate() returns the equivalent native Date for a valid value', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDate],
      html: '<scarlet-input-date value="25/12/2026"></scarlet-input-date>'
    });

    const date = await page.rootInstance.toDate();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(11); // 0-indexed
    expect(date?.getDate()).toBe(25);
  });

  it('toDate() returns undefined for an invalid value', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDate],
      html: '<scarlet-input-date value="31/02/2026"></scarlet-input-date>'
    });

    await expect(page.rootInstance.toDate()).resolves.toBeUndefined();
  });
});
