import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputLicensePlate } from './scarlet-input-license-plate';

// jsdom's global scope doesn't expose a real `InputEvent` constructor — a
// plain Event with `data`/`inputType` attached matches what the component's
// own `blockNonAlphanumericTyping` handler actually reads.
function fakeBeforeInputEvent(data: string): Event {
  const event = new Event('beforeinput', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'data', { value: data, configurable: true });
  Object.defineProperty(event, 'inputType', { value: 'insertText', configurable: true });
  return event;
}

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

  it('blocks a typed symbol before it ever reaches the field, but lets letters/digits through', async () => {
    const page = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate></scarlet-input-license-plate>'
    });
    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;

    // Not asserting on dispatchEvent()'s own return value: mock-doc's
    // dispatchEvent doesn't reliably reflect preventDefault() for a plain
    // (non-mock) Event object the way `.defaultPrevented` itself does.
    const symbolEvent = fakeBeforeInputEvent('#');
    input.dispatchEvent(symbolEvent);
    expect(symbolEvent.defaultPrevented).toBe(true);

    const letterEvent = fakeBeforeInputEvent('a');
    input.dispatchEvent(letterEvent);
    expect(letterEvent.defaultPrevented).toBe(false);
  });

  it('caps the field at 8 characters (the old ABC-1234 format) via maxlength', async () => {
    const page = await newSpecPage({
      components: [ScarletInputLicensePlate],
      html: '<scarlet-input-license-plate></scarlet-input-license-plate>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.maxLength).toBe(8);
  });
});
