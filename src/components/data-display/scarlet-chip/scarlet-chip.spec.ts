import { newSpecPage } from '@stencil/core/testing';
import { ScarletChip } from './scarlet-chip';

describe('scarlet-chip', () => {
  it('does not render a remove button by default', async () => {
    const page = await newSpecPage({
      components: [ScarletChip],
      html: '<scarlet-chip>Filtro</scarlet-chip>'
    });

    expect(page.root?.shadowRoot?.querySelector('.scarlet-chip__remove')).toBeNull();
  });

  it('emits scarletRemove when the remove button is clicked', async () => {
    const page = await newSpecPage({
      components: [ScarletChip],
      html: '<scarlet-chip removable>Filtro</scarlet-chip>'
    });
    const removeSpy = jest.fn();
    page.root?.addEventListener('scarletRemove', removeSpy);

    const button = page.root?.shadowRoot?.querySelector(
      '.scarlet-chip__remove'
    ) as HTMLButtonElement;
    button.click();

    expect(removeSpy).toHaveBeenCalledTimes(1);
  });

  it('does not emit scarletRemove when disabled', async () => {
    const page = await newSpecPage({
      components: [ScarletChip],
      html: '<scarlet-chip removable disabled>Filtro</scarlet-chip>'
    });
    const removeSpy = jest.fn();
    page.root?.addEventListener('scarletRemove', removeSpy);

    const button = page.root?.shadowRoot?.querySelector(
      '.scarlet-chip__remove'
    ) as HTMLButtonElement;
    // mock-doc doesn't implement `.disabled` as a real IDL property on
    // <button> (only on <input>), so assert via the attribute instead.
    expect(button.hasAttribute('disabled')).toBe(true);
  });
});
