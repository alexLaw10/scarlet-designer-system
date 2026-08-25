import { newSpecPage } from '@stencil/core/testing';
import { ScarletPopover } from './scarlet-popover';

async function setup(extraAttrs = '') {
  const page = await newSpecPage({
    components: [ScarletPopover],
    html: `
      <scarlet-popover ${extraAttrs}>
        <button slot="trigger">Abrir</button>
        <p>Conteúdo</p>
      </scarlet-popover>
    `
  });
  await page.waitForChanges();
  const trigger = page.root!.querySelector('button')!;
  return { page, trigger };
}

describe('scarlet-popover', () => {
  it('marks the trigger with aria-haspopup and aria-expanded="false" while closed', async () => {
    const { trigger } = await setup();
    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens on trigger click and closes on a second click (default click mode)', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes on Escape in click mode', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();

    page.root?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true })
    );
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('closes on a click outside the component', async () => {
    const { page, trigger } = await setup();

    trigger.click();
    await page.waitForChanges();

    page.body.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('opens on mouseenter and closes on mouseleave in hover mode, ignoring click/Escape', async () => {
    const { page, trigger } = await setup('trigger-mode="hover"');

    trigger.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();

    trigger.click();
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).not.toBeNull();

    trigger.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
    await page.waitForChanges();
    expect(page.root?.shadowRoot?.querySelector('[role="dialog"]')).toBeNull();
  });

  it('emits scarletShow and scarletHide', async () => {
    const { page, trigger } = await setup();
    const showSpy = jest.fn();
    const hideSpy = jest.fn();
    page.root?.addEventListener('scarletShow', showSpy);
    page.root?.addEventListener('scarletHide', hideSpy);

    trigger.click();
    await page.waitForChanges();
    expect(showSpy).toHaveBeenCalledTimes(1);

    trigger.click();
    await page.waitForChanges();
    expect(hideSpy).toHaveBeenCalledTimes(1);
  });
});
