import { newSpecPage } from '@stencil/core/testing';
import { ScarletTabs } from './scarlet-tabs';

const items = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
  { value: 'c', label: 'C', disabled: true },
];

describe('scarlet-tabs', () => {
  it('selects the first enabled item by default', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.rootInstance.componentWillLoad();
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('a');
  });

  it('respects an explicit initial value', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs value="b"></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const selectedTab = page.root?.shadowRoot?.querySelector('.scarlet-tabs__tab--selected');
    expect(selectedTab?.getAttribute('id')).toBe('tab-b');
  });

  it('selects a tab on click and emits scarletChange', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs value="a"></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const tabB = page.root?.shadowRoot?.querySelector('[data-value="b"]') as HTMLButtonElement;
    tabB.click();
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('b');
    expect(page.rootInstance.value).toBe('b');
  });

  it('does not select a disabled tab on click', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs value="a"></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const tabC = page.root?.shadowRoot?.querySelector('[data-value="c"]') as HTMLButtonElement;
    // mock-doc doesn't reflect .disabled as an IDL property on <button>.
    expect(tabC.hasAttribute('disabled')).toBe(true);
    tabC.click();
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('a');
  });

  it('moves selection with ArrowRight, skipping disabled tabs by wrapping around', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs value="b"></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const tablist = page.root?.shadowRoot?.querySelector('[role="tablist"]') as HTMLElement;
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }));
    await page.waitForChanges();

    // From 'b', the only other enabled tab is 'a', so ArrowRight wraps to it.
    expect(page.rootInstance.value).toBe('a');
  });

  it('marks the correct panel visible via the hidden attribute', async () => {
    const page = await newSpecPage({
      components: [ScarletTabs],
      html: `<scarlet-tabs value="a"></scarlet-tabs>`,
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const panelA = page.root?.shadowRoot?.querySelector('#panel-a') as HTMLElement;
    const panelB = page.root?.shadowRoot?.querySelector('#panel-b') as HTMLElement;

    expect(panelA.hidden).toBe(false);
    expect(panelB.hidden).toBe(true);
  });
});
