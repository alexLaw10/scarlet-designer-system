import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputCreditCard } from './scarlet-input-credit-card';

// The industry-standard Visa test number — passes the real Luhn checksum.
const VALID_VISA = '4111111111111111';

describe('scarlet-input-credit-card', () => {
  it('formats digits in groups of 4 by default', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      html: '<scarlet-input-credit-card></scarlet-input-credit-card>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = VALID_VISA;
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('4111 1111 1111 1111');
  });

  it('detects the Visa brand and shows it next to the field', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      html: '<scarlet-input-credit-card></scarlet-input-credit-card>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = VALID_VISA;
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    await expect(page.rootInstance.getBrand()).resolves.toBe('visa');
    const brandBadge = page.root?.shadowRoot?.querySelector('.scarlet-input-credit-card__brand');
    expect(brandBadge?.textContent?.trim()).toBe('visa');
  });

  it('uses the 4-6-5 grouping once an Amex prefix is detected', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      html: '<scarlet-input-credit-card></scarlet-input-credit-card>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '378282246310005';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('3782 822463 10005');
  });

  it('passes Luhn validation for a valid card and reports it via isValid()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      html: '<scarlet-input-credit-card value="4111 1111 1111 1111"></scarlet-input-credit-card>'
    });

    await expect(page.rootInstance.isValid()).resolves.toBe(true);
  });

  it('shows the default error message on blur when a complete number fails Luhn', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      // Last digit of the valid Visa number changed.
      html: '<scarlet-input-credit-card value="4111 1111 1111 1112"></scarlet-input-credit-card>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    const message = page.root?.shadowRoot?.querySelector(
      '.scarlet-input-credit-card__message--error'
    );
    expect(message?.textContent?.trim()).toBe('Número de cartão inválido.');
  });

  it('caps the field at 19 characters (4 groups of 4) by default, tightening once a shorter brand is detected', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCreditCard],
      html: '<scarlet-input-credit-card></scarlet-input-credit-card>'
    });
    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.maxLength).toBe(19);

    // Amex BIN (34/37) — the field should tighten from the default 19 to 17.
    input.value = '378282246310005';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    expect(input.maxLength).toBe(17);
  });
});
