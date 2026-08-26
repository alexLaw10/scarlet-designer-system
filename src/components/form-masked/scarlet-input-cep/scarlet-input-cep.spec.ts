import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputCep } from './scarlet-input-cep';

// jsdom's global scope doesn't expose a real `InputEvent` constructor (only
// `window.InputEvent` on a real jsdom Window does, and even that isn't
// necessarily interoperable with mock-doc's own dispatchEvent) — a plain
// Event with `data`/`inputType` attached matches what the component's own
// `blockNonDigitTyping`/`blockNonAlphanumericTyping` handlers actually read.
function fakeBeforeInputEvent(data: string): Event {
  const event = new Event('beforeinput', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'data', { value: data, configurable: true });
  Object.defineProperty(event, 'inputType', { value: 'insertText', configurable: true });
  return event;
}

describe('scarlet-input-cep', () => {
  it('formats digits as XXXXX-XXX', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep></scarlet-input-cep>'
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
      html: '<scarlet-input-cep></scarlet-input-cep>'
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

  it('strips letters instead of accepting them into the value', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep></scarlet-input-cep>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'abc12345xyz';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('12345');
    expect(input.value).toBe('12345');
  });

  it('blocks a typed letter before it ever reaches the field (not just correcting it after)', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep></scarlet-input-cep>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    const event = fakeBeforeInputEvent('a');
    // Not asserting on dispatchEvent()'s own return value here: mock-doc's
    // dispatchEvent doesn't reliably reflect preventDefault() for a plain
    // (non-mock) Event object the way `.defaultPrevented` itself does.
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('lets a typed digit through beforeinput', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep></scarlet-input-cep>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    const event = fakeBeforeInputEvent('5');
    input.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
  });

  it('caps the field at 9 characters (XXXXX-XXX) via maxlength', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep></scarlet-input-cep>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.maxLength).toBe(9);
  });

  it('exposes the raw digits via getRawValue()', async () => {
    const page = await newSpecPage({
      components: [ScarletInputCep],
      html: '<scarlet-input-cep value="01310-100"></scarlet-input-cep>'
    });

    await expect(page.rootInstance.getRawValue()).resolves.toBe('01310100');
  });
});
