import { newSpecPage } from '@stencil/core/testing';
import { ScarletRadioGroup } from './scarlet-radio-group';
import { ScarletRadio } from '@/components/form/scarlet-radio/scarlet-radio';

describe('scarlet-radio-group', () => {
  it('checks the radio matching the initial value and unchecks the others', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="b">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
          <scarlet-radio value="c"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio'));
    const checkedValues = radios.filter((radio: any) => radio.checked).map((radio: any) => radio.value);

    expect(checkedValues).toEqual(['b']);
  });

  it('re-syncs the checked child when `value` is reassigned from outside (e.g. a framework resetting a form)', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="a">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    page.rootInstance.value = 'b';
    await page.waitForChanges();

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio'));
    const checkedValues = radios.filter((radio: any) => radio.checked).map((radio: any) => radio.value);

    expect(checkedValues).toEqual(['b']);
  });

  it('selects a radio and unchecks the previous one when a child input changes', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="a">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio')) as any[];
    const radioB = radios.find((radio) => radio.value === 'b');
    const input = radioB.shadowRoot.querySelector('input');
    input.checked = true;
    // Dispatched directly on the input scarlet-radio's own onChange is
    // bound to, so this fires regardless of bubbles/composed; the group
    // finds out via scarlet-radio's internal scarletRadioChange event, not
    // by observing this native one.
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('b');
    expect(page.rootInstance.value).toBe('b');

    const radioA = radios.find((radio) => radio.value === 'a');
    expect(radioA.checked).toBe(false);
    expect(radioB.checked).toBe(true);
  });

  it('gives exactly one radio a tab stop (roving tabindex), matching the checked one', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="b">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
          <scarlet-radio value="c"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio')) as any[];
    expect(radios.map((radio) => radio.focusable)).toEqual([false, true, false]);
  });

  it('falls back the tab stop to the first enabled radio when none is checked', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group>
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio')) as any[];
    expect(radios.map((radio) => radio.focusable)).toEqual([true, false]);
  });

  it('moves selection and the tab stop with ArrowRight/ArrowLeft, wrapping around', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="a">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
          <scarlet-radio value="c"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe('b');

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe('a');

    // Wraps from the first option back to the last on ArrowLeft.
    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true, cancelable: true }));
    await page.waitForChanges();
    expect(page.rootInstance.value).toBe('c');

    expect(changeSpy).toHaveBeenCalledTimes(3);

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio')) as any[];
    expect(radios.map((radio) => radio.focusable)).toEqual([false, false, true]);
  });

  it('skips disabled radios when navigating with arrow keys', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group value="a">
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b" disabled></scarlet-radio>
          <scarlet-radio value="c"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('c');
  });

  it('propagates name and disabled down to every child radio', async () => {
    const page = await newSpecPage({
      components: [ScarletRadioGroup, ScarletRadio],
      html: `
        <scarlet-radio-group name="tamanho" disabled>
          <scarlet-radio value="a"></scarlet-radio>
          <scarlet-radio value="b"></scarlet-radio>
        </scarlet-radio-group>
      `,
    });
    await page.waitForChanges();

    const radios = Array.from(page.root!.querySelectorAll('scarlet-radio')) as any[];
    radios.forEach((radio) => {
      expect(radio.name).toBe('tamanho');
      expect(radio.disabled).toBe(true);
    });
  });
});
