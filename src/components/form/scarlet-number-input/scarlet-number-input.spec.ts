import { newSpecPage } from '@stencil/core/testing';
import { ScarletNumberInput } from './scarlet-number-input';

describe('scarlet-number-input', () => {
  it('increments and decrements by step on button click', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="5" step="2"></scarlet-number-input>'
    });
    const [decrement, increment] = page.root!.shadowRoot!.querySelectorAll(
      '.scarlet-number-input__button'
    ) as NodeListOf<HTMLButtonElement>;

    increment.click();
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(7);

    decrement.click();
    await page.waitForChanges();
    decrement.click();
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(3);
  });

  it('clamps to min/max and disables the button at each bound', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="9" min="0" max="10"></scarlet-number-input>'
    });
    const [, increment] = page.root!.shadowRoot!.querySelectorAll(
      '.scarlet-number-input__button'
    ) as NodeListOf<HTMLButtonElement>;

    increment.click();
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(10);

    increment.click();
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(10);
    // mock-doc doesn't implement `.disabled` as a real IDL property on
    // <button> (only on <input>), so assert via the attribute instead.
    expect(increment.hasAttribute('disabled')).toBe(true);
  });

  it('emits scarletChange with the clamped value on button click', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="9" max="10"></scarlet-number-input>'
    });
    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const [, increment] = page.root!.shadowRoot!.querySelectorAll(
      '.scarlet-number-input__button'
    ) as NodeListOf<HTMLButtonElement>;
    increment.click();
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe(10);
  });

  it('clamps an out-of-range typed value on blur', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="5" min="0" max="10"></scarlet-number-input>'
    });
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;

    input.value = '99';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(99);

    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe(10);
  });

  it('strips letters typed into the field instead of leaving them in place', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="1"></scarlet-number-input>'
    });
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;

    // Simulates typing "abc" after the existing "1": a real <input> updates
    // its own .value before the 'input' event fires, same as the browser
    // would, regardless of type='text' not blocking the keystroke itself.
    input.value = '1abc';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(input.value).toBe('1');
    expect(page.rootInstance.value).toBe(1);
  });

  it('reverts the field to the last valid value when the typed text is unparseable even after stripping letters', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input value="7"></scarlet-number-input>'
    });
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;

    input.value = '1.2.3';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(input.value).toBe('7');
    expect(page.rootInstance.value).toBe(7);
  });

  it('disables both buttons and the input when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletNumberInput],
      html: '<scarlet-number-input disabled></scarlet-number-input>'
    });

    const buttons = page.root!.shadowRoot!.querySelectorAll(
      '.scarlet-number-input__button'
    ) as NodeListOf<HTMLButtonElement>;
    // mock-doc doesn't implement `.disabled` as a real IDL property on
    // <button> (only on <input>), so assert via the attribute instead.
    expect(Array.from(buttons).every(button => button.hasAttribute('disabled'))).toBe(true);
    expect(page.root!.shadowRoot!.querySelector('input')?.hasAttribute('disabled')).toBe(true);
  });
});
