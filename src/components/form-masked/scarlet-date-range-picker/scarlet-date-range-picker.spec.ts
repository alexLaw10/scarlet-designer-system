import { newSpecPage } from '@stencil/core/testing';
import { ScarletDateRangePicker } from './scarlet-date-range-picker';

function dayButtons(page: Awaited<ReturnType<typeof newSpecPage>>) {
  return Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-date-range-picker__day')) as HTMLButtonElement[];
}

function findDay(page: Awaited<ReturnType<typeof newSpecPage>>, day: string) {
  return dayButtons(page).find(
    (btn) => btn.textContent?.trim() === day && !btn.classList.contains('scarlet-date-range-picker__day--outside'),
  )!;
}

describe('scarlet-date-range-picker', () => {
  it('opens the panel via show() showing the month of the current start value', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker start-value="10/06/2026"></scarlet-date-range-picker>`,
    });

    await page.rootInstance.show();
    await page.waitForChanges();

    const title = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel-title');
    expect(title?.textContent?.trim()).toBe('Junho 2026');
  });

  it('hide() closes an open panel', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });

    await page.rootInstance.show();
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).not.toBeNull();

    await page.rootInstance.hide();
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).toBeNull();
  });

  it('sets the start on the first day click and keeps the panel open', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });
    const toggle = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__toggle') as HTMLButtonElement;
    toggle.click();
    await page.waitForChanges();

    findDay(page, '10').click();
    await page.waitForChanges();

    expect(page.rootInstance.startValue).toMatch(/^10\/\d{2}\/\d{4}$/);
    expect(page.rootInstance.endValue).toBe('');
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).not.toBeNull();
  });

  it('sets the end on the second click (after the start) and closes the panel', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });
    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const toggle = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__toggle') as HTMLButtonElement;
    toggle.click();
    await page.waitForChanges();

    findDay(page, '10').click();
    await page.waitForChanges();
    findDay(page, '15').click();
    await page.waitForChanges();

    expect(page.rootInstance.startValue).toMatch(/^10\//);
    expect(page.rootInstance.endValue).toMatch(/^15\//);
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).toBeNull();
    expect(changeSpy).toHaveBeenCalledTimes(2);
    expect(changeSpy.mock.calls[1][0].detail.end).toMatch(/^15\//);
  });

  it('restarts the range when the second click lands before the start', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });
    const toggle = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__toggle') as HTMLButtonElement;
    toggle.click();
    await page.waitForChanges();

    findDay(page, '15').click();
    await page.waitForChanges();
    findDay(page, '10').click();
    await page.waitForChanges();

    expect(page.rootInstance.startValue).toMatch(/^10\//);
    expect(page.rootInstance.endValue).toBe('');
    // Still open, waiting for a new end.
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).not.toBeNull();
  });

  it('ignores a click on a day outside min/max', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker min="05/06/2026" max="20/06/2026" start-value="10/06/2026"></scarlet-date-range-picker>`,
    });
    const toggle = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__toggle') as HTMLButtonElement;
    toggle.click();
    await page.waitForChanges();

    const day25 = findDay(page, '25');
    expect(day25.getAttribute('aria-disabled')).toBe('true');

    day25.click();
    await page.waitForChanges();

    expect(page.rootInstance.endValue).toBe('');
  });

  it('masks digits typed into the start/end inputs', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });

    const [startInput, endInput] = page.root!.shadowRoot!.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
    startInput.value = '10062026';
    startInput.dispatchEvent(new Event('input'));
    endInput.value = '15062026';
    endInput.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.startValue).toBe('10/06/2026');
    expect(page.rootInstance.endValue).toBe('15/06/2026');
  });

  it('closes on Escape', async () => {
    const page = await newSpecPage({
      components: [ScarletDateRangePicker],
      html: `<scarlet-date-range-picker></scarlet-date-range-picker>`,
    });
    const toggle = page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__toggle') as HTMLButtonElement;
    toggle.click();
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).not.toBeNull();

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-date-range-picker__panel')).toBeNull();
  });
});
