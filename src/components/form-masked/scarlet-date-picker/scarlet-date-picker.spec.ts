import { newSpecPage } from '@stencil/core/testing';
import { ScarletDatePicker } from './scarlet-date-picker';

describe('scarlet-date-picker', () => {
  it('formats digits as DD/MM/AAAA while typing', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker></scarlet-date-picker>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = '25122026';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('25/12/2026');
  });

  it('shows "Data inválida." on blur for a value that is 8 digits but not a real date', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker value="31/02/2026"></scarlet-date-picker>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    const message = page.root?.shadowRoot?.querySelector('.scarlet-date-picker__message--error');
    expect(message?.textContent?.trim()).toBe('Data inválida.');
  });

  it('toDate()/isValid() reflect the current value', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker value="25/12/2026"></scarlet-date-picker>'
    });

    await expect(page.rootInstance.isValid()).resolves.toBe(true);
    const date = await page.rootInstance.toDate();
    expect(date?.getFullYear()).toBe(2026);
    expect(date?.getMonth()).toBe(11); // 0-indexed
    expect(date?.getDate()).toBe(25);
  });

  it('show()/hide() toggle the calendar panel in the DOM', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker></scarlet-date-picker>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).toBeNull();

    await page.rootInstance.show();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).not.toBeNull();

    await page.rootInstance.hide();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).toBeNull();
  });

  it('opens showing the month of the current value, with that day selected', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker value="25/12/2026"></scarlet-date-picker>'
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const title = page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel-title');
    expect(title?.textContent?.trim()).toBe('Dezembro 2026');

    const selected = page.root?.shadowRoot?.querySelector('.scarlet-date-picker__day--selected');
    expect(selected?.textContent?.trim()).toBe('25');
  });

  it('clicking a day selects it, emits scarletChange, and closes the panel', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker value="10/06/2026"></scarlet-date-picker>'
    });

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    await page.rootInstance.show();
    await page.waitForChanges();

    const days = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-date-picker__day')
    ) as HTMLButtonElement[];
    const day15 = days.find(
      btn =>
        btn.textContent?.trim() === '15' &&
        !btn.classList.contains('scarlet-date-picker__day--outside')
    );
    day15?.click();
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('15/06/2026');
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('15/06/2026');
    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).toBeNull();
  });

  it('ignores a click on a day outside min/max instead of selecting it', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker value="10/06/2026" min="05/06/2026" max="20/06/2026"></scarlet-date-picker>'
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const days = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-date-picker__day')
    ) as HTMLButtonElement[];
    const day25 = days.find(
      btn =>
        btn.textContent?.trim() === '25' &&
        !btn.classList.contains('scarlet-date-picker__day--outside')
    );
    expect(day25?.getAttribute('aria-disabled')).toBe('true');

    // Dispatched non-bubbling: the day button's own onClick still fires
    // (Stencil attaches it directly, not via delegation), but this avoids
    // mock-doc's `composedPath()`, which doesn't cross the shadow-root ->
    // host boundary — a real click here would otherwise also trip the
    // document-level "click outside" listener and close the panel for the
    // wrong reason, masking whether the day-click guard itself works.
    day25?.dispatchEvent(new MouseEvent('click', { bubbles: false, cancelable: true }));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('10/06/2026');
    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).not.toBeNull();
  });

  it('closes on Escape', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker></scarlet-date-picker>'
    });

    await page.rootInstance.show();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).not.toBeNull();

    page.root?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true })
    );
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-date-picker__panel')).toBeNull();
  });

  it('caps the text field at 10 characters (DD/MM/AAAA) via maxlength', async () => {
    const page = await newSpecPage({
      components: [ScarletDatePicker],
      html: '<scarlet-date-picker></scarlet-date-picker>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input.maxLength).toBe(10);
  });
});
