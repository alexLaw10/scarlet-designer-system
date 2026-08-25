import { newSpecPage } from '@stencil/core/testing';
import { ScarletCheckboxGroup } from './scarlet-checkbox-group';
import { ScarletCheckbox } from '@/components/form/scarlet-checkbox/scarlet-checkbox';

describe('scarlet-checkbox-group', () => {
  it('checks the checkboxes matching the initial value array and leaves the others unchecked', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckboxGroup, ScarletCheckbox],
      html: `
        <scarlet-checkbox-group>
          <scarlet-checkbox value="a"></scarlet-checkbox>
          <scarlet-checkbox value="b"></scarlet-checkbox>
          <scarlet-checkbox value="c"></scarlet-checkbox>
        </scarlet-checkbox-group>
      `,
    });
    page.rootInstance.value = ['a', 'c'];
    await page.waitForChanges();

    const checkboxes = Array.from(page.root!.querySelectorAll('scarlet-checkbox'));
    const checkedValues = checkboxes.filter((checkbox: any) => checkbox.checked).map((checkbox: any) => checkbox.value);

    expect(checkedValues).toEqual(['a', 'c']);
  });

  it('re-syncs the checked children when `value` is reassigned from outside (e.g. a framework resetting a form)', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckboxGroup, ScarletCheckbox],
      html: `
        <scarlet-checkbox-group>
          <scarlet-checkbox value="a"></scarlet-checkbox>
          <scarlet-checkbox value="b"></scarlet-checkbox>
        </scarlet-checkbox-group>
      `,
    });
    page.rootInstance.value = ['a'];
    await page.waitForChanges();

    page.rootInstance.value = ['b'];
    await page.waitForChanges();

    const checkboxes = Array.from(page.root!.querySelectorAll('scarlet-checkbox'));
    const checkedValues = checkboxes.filter((checkbox: any) => checkbox.checked).map((checkbox: any) => checkbox.value);

    expect(checkedValues).toEqual(['b']);
  });

  it('adds a value to the array when a child checkbox is checked, without disturbing the others already checked', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckboxGroup, ScarletCheckbox],
      html: `
        <scarlet-checkbox-group>
          <scarlet-checkbox value="a"></scarlet-checkbox>
          <scarlet-checkbox value="b"></scarlet-checkbox>
        </scarlet-checkbox-group>
      `,
    });
    page.rootInstance.value = ['a'];
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const checkboxes = Array.from(page.root!.querySelectorAll('scarlet-checkbox')) as any[];
    const checkboxB = checkboxes.find((checkbox) => checkbox.value === 'b');
    const input = checkboxB.shadowRoot.querySelector('input');
    input.checked = true;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toEqual(['a', 'b']);
    expect(page.rootInstance.value).toEqual(['a', 'b']);
  });

  it('removes a value from the array when a child checkbox is unchecked', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckboxGroup, ScarletCheckbox],
      html: `
        <scarlet-checkbox-group>
          <scarlet-checkbox value="a"></scarlet-checkbox>
          <scarlet-checkbox value="b"></scarlet-checkbox>
        </scarlet-checkbox-group>
      `,
    });
    page.rootInstance.value = ['a', 'b'];
    await page.waitForChanges();

    const checkboxes = Array.from(page.root!.querySelectorAll('scarlet-checkbox')) as any[];
    const checkboxA = checkboxes.find((checkbox) => checkbox.value === 'a');
    const input = checkboxA.shadowRoot.querySelector('input');
    input.checked = false;
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toEqual(['b']);
  });

  it('propagates name and disabled down to every child checkbox', async () => {
    const page = await newSpecPage({
      components: [ScarletCheckboxGroup, ScarletCheckbox],
      html: `
        <scarlet-checkbox-group name="ingredientes" disabled>
          <scarlet-checkbox value="a"></scarlet-checkbox>
          <scarlet-checkbox value="b"></scarlet-checkbox>
        </scarlet-checkbox-group>
      `,
    });
    await page.waitForChanges();

    const checkboxes = Array.from(page.root!.querySelectorAll('scarlet-checkbox')) as any[];
    checkboxes.forEach((checkbox) => {
      expect(checkbox.name).toBe('ingredientes');
      expect(checkbox.disabled).toBe(true);
    });
  });
});
