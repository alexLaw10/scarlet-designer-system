import { newSpecPage } from '@stencil/core/testing';
import { ScarletAccordion } from './scarlet-accordion';

const items = [
  { value: 'a', title: 'A' },
  { value: 'b', title: 'B' },
  { value: 'c', title: 'C', disabled: true }
];

describe('scarlet-accordion', () => {
  it('renders all sections collapsed by default', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const panels = page.root?.shadowRoot?.querySelectorAll('.scarlet-accordion__panel');
    panels?.forEach(panel => expect((panel as HTMLElement).hidden).toBe(true));
  });

  it('expands a section on click and emits scarletChange', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const triggerA = page.root?.shadowRoot?.querySelector('[data-index="0"]') as HTMLButtonElement;
    triggerA.click();
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toEqual(['a']);
    expect(page.rootInstance.expandedValues).toEqual(['a']);
  });

  it('collapses other sections when a new one opens, unless multiple is set', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    page.rootInstance.expandedValues = ['a'];
    await page.waitForChanges();

    const triggerB = page.root?.shadowRoot?.querySelector('[data-index="1"]') as HTMLButtonElement;
    triggerB.click();
    await page.waitForChanges();

    expect(page.rootInstance.expandedValues).toEqual(['b']);
  });

  it('keeps multiple sections open when multiple is set', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion multiple></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    page.rootInstance.expandedValues = ['a'];
    await page.waitForChanges();

    const triggerB = page.root?.shadowRoot?.querySelector('[data-index="1"]') as HTMLButtonElement;
    triggerB.click();
    await page.waitForChanges();

    expect(page.rootInstance.expandedValues.sort()).toEqual(['a', 'b']);
  });

  it('toggles a section closed when clicked again', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    page.rootInstance.expandedValues = ['a'];
    await page.waitForChanges();

    const triggerA = page.root?.shadowRoot?.querySelector('[data-index="0"]') as HTMLButtonElement;
    triggerA.click();
    await page.waitForChanges();

    expect(page.rootInstance.expandedValues).toEqual([]);
  });

  it('ignores clicks on a disabled section', async () => {
    const page = await newSpecPage({
      components: [ScarletAccordion],
      html: '<scarlet-accordion></scarlet-accordion>'
    });
    page.rootInstance.items = items;
    await page.waitForChanges();

    const triggerC = page.root?.shadowRoot?.querySelector('[data-index="2"]') as HTMLButtonElement;
    // mock-doc doesn't reflect .disabled as an IDL property on <button>.
    expect(triggerC.hasAttribute('disabled')).toBe(true);
    triggerC.click();
    await page.waitForChanges();

    expect(page.rootInstance.expandedValues).toEqual([]);
  });
});
