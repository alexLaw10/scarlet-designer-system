import { newSpecPage } from '@stencil/core/testing';
import { ScarletRadioGroup } from './scarlet-radio-group';
import { ScarletRadio } from '../scarlet-radio/scarlet-radio';

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
    // The group now listens for this native "change" bubbling up (not the
    // custom "scarletChange"), so it must be dispatched as bubbling +
    // composed to actually cross the radio's shadow boundary and reach an
    // ancestor listener — real user-driven change events do this
    // automatically; a manually constructed Event does not by default.
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('b');
    expect(page.rootInstance.value).toBe('b');

    const radioA = radios.find((radio) => radio.value === 'a');
    expect(radioA.checked).toBe(false);
    expect(radioB.checked).toBe(true);
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
