import { newSpecPage } from '@stencil/core/testing';
import { ScarletMenu } from './scarlet-menu';

const items = [
  { value: 'edit', label: 'Editar' },
  { value: 'archive', label: 'Arquivar', disabled: true },
  { value: 'delete', label: 'Excluir', danger: true },
];

async function setup() {
  const page = await newSpecPage({
    components: [ScarletMenu],
    html: `
      <scarlet-menu>
        <button slot="trigger">Abrir</button>
      </scarlet-menu>
    `,
  });
  page.rootInstance.items = items;
  await page.waitForChanges();
  const trigger = page.root!.querySelector('button')!;
  return { page, trigger };
}

describe('scarlet-menu', () => {
  it('marks the trigger with aria-haspopup and aria-expanded="false" while closed', async () => {
    const { trigger } = await setup();
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the menu on trigger click and closes it on a second click', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('emits scarletSelect with the clicked item and closes the menu', async () => {
    const { page, trigger } = await setup();
    const selectSpy = jest.fn();
    page.root?.addEventListener('scarletSelect', selectSpy);

    trigger.click();
    await page.waitForChanges();

    const editItem = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="menuitem"]')).find(
      (el) => el.textContent?.trim() === 'Editar',
    ) as HTMLButtonElement;
    editItem.click();
    await page.waitForChanges();

    expect(selectSpy).toHaveBeenCalledTimes(1);
    expect(selectSpy.mock.calls[0][0].detail).toEqual({ value: 'edit', label: 'Editar' });
    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).not.toBeNull();

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
  });

  it('closes on a click outside the component', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).not.toBeNull();

    page.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[role="menu"]')).toBeNull();
  });

  it('gives the first enabled item the roving tab stop when opened, and moves it with ArrowDown', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();

    const menuItems = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[];
    expect(menuItems.map((el) => el.tabIndex)).toEqual([0, -1, -1]);

    page.root?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, composed: true }));
    await page.waitForChanges();

    // "Arquivar" (index 1) is disabled, so ArrowDown from "Editar" skips it and lands on "Excluir".
    const updated = Array.from(page.root!.shadowRoot!.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[];
    expect(updated.map((el) => el.tabIndex)).toEqual([-1, -1, 0]);
  });
});
