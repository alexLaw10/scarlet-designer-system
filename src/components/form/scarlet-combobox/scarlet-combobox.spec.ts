import { newSpecPage } from '@stencil/core/testing';
import { ScarletCombobox } from './scarlet-combobox';

const options = [
  { value: 'sp', label: 'São Paulo' },
  { value: 'rj', label: 'Rio de Janeiro' },
  { value: 'mg', label: 'Minas Gerais', disabled: true }
];

async function setup(html = '<scarlet-combobox></scarlet-combobox>') {
  const page = await newSpecPage({ components: [ScarletCombobox], html });
  page.rootInstance.options = options;
  await page.waitForChanges();
  const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;
  return { page, input };
}

describe('scarlet-combobox', () => {
  it("shows the selected value's label once options arrive after value was already set", async () => {
    const page = await newSpecPage({
      components: [ScarletCombobox],
      html: '<scarlet-combobox value="rj"></scarlet-combobox>'
    });
    const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;
    // Matches setup()'s own sequence: options assigned as a property after
    // the element (and its initial value) already existed.
    expect(input.value).toBe('');

    page.rootInstance.options = options;
    await page.waitForChanges();

    expect(input.value).toBe('Rio de Janeiro');
  });

  it('opens the list on focus, showing every option', async () => {
    const { page, input } = await setup();

    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    const items = page.root!.shadowRoot!.querySelectorAll('[role="option"]');
    expect(items.length).toBe(3);
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('filters options as the user types', async () => {
    const { page, input } = await setup();
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    input.value = 'rio';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    const items = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="option"]'));
    expect(items.map(el => el.textContent?.trim())).toEqual(['Rio de Janeiro']);
  });

  it('shows the empty message when nothing matches', async () => {
    const { page, input } = await setup();
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(
      page.root!.shadowRoot!.querySelector('.scarlet-combobox__empty')?.textContent?.trim()
    ).toBe('Nenhum resultado encontrado.');
  });

  it('selects an option on mousedown, emits scarletChange, and closes the list', async () => {
    const { page, input } = await setup();
    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    const rioOption = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="option"]')).find(
      el => el.textContent?.trim() === 'Rio de Janeiro'
    ) as HTMLElement;
    rioOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('rj');
    expect(page.rootInstance.value).toBe('rj');
    expect(input.value).toBe('Rio de Janeiro');
    expect(page.root!.shadowRoot!.querySelector('[role="listbox"]')).toBeNull();
  });

  it('moves aria-activedescendant with ArrowDown, skipping disabled options', async () => {
    const { page, input } = await setup();
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    // Opening the list (via focus) already auto-highlights the first
    // option (São Paulo), matching a typical combobox's "highlight the
    // top suggestion" UX — so the first ArrowDown moves past it, to Rio.
    const spOption = page.root!.shadowRoot!.querySelector('[role="option"]') as HTMLElement;
    expect(input.getAttribute('aria-activedescendant')).toBe(spOption.id);

    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true })
    );
    await page.waitForChanges();

    const rjOption = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="option"]')).find(
      el => el.textContent?.trim() === 'Rio de Janeiro'
    ) as HTMLElement;
    expect(input.getAttribute('aria-activedescendant')).toBe(rjOption.id);
  });

  it('commits the active option on Enter', async () => {
    const { page, input } = await setup();
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
    );
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('sp');
    expect(input.value).toBe('São Paulo');
  });

  it('reverts the typed query and closes on Escape without selecting anything', async () => {
    const { page, input } = await setup('<scarlet-combobox value="sp"></scarlet-combobox>');
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    page.root?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true })
    );
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('[role="listbox"]')).toBeNull();
    expect(input.value).toBe('São Paulo');
    expect(page.rootInstance.value).toBe('sp');
  });

  it('reverts the typed query on blur when nothing was selected', async () => {
    const { page, input } = await setup('<scarlet-combobox value="sp"></scarlet-combobox>');
    input.dispatchEvent(new Event('focus'));
    await page.waitForChanges();

    input.value = 'não existe';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(input.value).toBe('São Paulo');
  });
});
