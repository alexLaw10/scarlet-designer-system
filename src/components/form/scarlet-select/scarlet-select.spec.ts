import { newSpecPage } from '@stencil/core/testing';
import { ScarletSelect } from './scarlet-select';

describe('scarlet-select', () => {
  it('renders one <option> per entry in options', async () => {
    const page = await newSpecPage({
      components: [ScarletSelect],
      html: '<scarlet-select></scarlet-select>'
    });
    page.rootInstance.options = [
      { label: 'São Paulo', value: 'sp' },
      { label: 'Rio de Janeiro', value: 'rj' }
    ];
    await page.waitForChanges();

    const options = page.root?.shadowRoot?.querySelectorAll('option');
    expect(options?.length).toBe(2);
    expect(options?.[0].textContent?.trim()).toBe('São Paulo');
  });

  it('renders a disabled placeholder option when provided', async () => {
    const page = await newSpecPage({
      components: [ScarletSelect],
      html: '<scarlet-select placeholder="Selecione"></scarlet-select>'
    });

    const placeholderOption = page.root?.shadowRoot?.querySelector(
      'option[value=""]'
    ) as HTMLOptionElement;
    expect(placeholderOption).not.toBeNull();
    // mock-doc doesn't reflect .disabled/.selected as IDL properties on <option>.
    expect(placeholderOption.hasAttribute('disabled')).toBe(true);
    expect(placeholderOption.hasAttribute('selected')).toBe(true);
  });

  it('emits scarletChange with the new value on selection', async () => {
    const page = await newSpecPage({
      components: [ScarletSelect],
      html: '<scarlet-select></scarlet-select>'
    });
    page.rootInstance.options = [
      { label: 'São Paulo', value: 'sp' },
      { label: 'Rio de Janeiro', value: 'rj' }
    ];
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const select = page.root?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    select.value = 'rj';
    select.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('rj');
    expect(page.rootInstance.value).toBe('rj');
  });

  it('sets aria-invalid when errorMessage is provided', async () => {
    const page = await newSpecPage({
      components: [ScarletSelect],
      html: '<scarlet-select error-message="Campo obrigatório"></scarlet-select>'
    });

    const select = page.root?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    expect(select.getAttribute('aria-invalid')).toBe('true');
  });

  it('focuses the internal select via setFocus()', async () => {
    const page = await newSpecPage({
      components: [ScarletSelect],
      html: '<scarlet-select></scarlet-select>'
    });

    const select = page.root?.shadowRoot?.querySelector('select') as HTMLSelectElement;
    const focusSpy = jest.spyOn(select, 'focus');

    await page.rootInstance.setFocus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
