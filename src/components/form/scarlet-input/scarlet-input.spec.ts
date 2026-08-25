import { newSpecPage } from '@stencil/core/testing';
import { ScarletInput } from './scarlet-input';

describe('scarlet-input', () => {
  it('renders a label wired to the input via id/for', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input label="Nome"></scarlet-input>'
    });

    const label = page.root?.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;

    expect(label.textContent?.trim()).toBe('Nome');
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('emits scarletInput on keystrokes and updates value', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input></scarlet-input>'
    });

    const inputSpy = jest.fn();
    page.root?.addEventListener('scarletInput', inputSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'ola';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0][0].detail).toBe('ola');
    expect(page.rootInstance.value).toBe('ola');
  });

  it('emits scarletChange on native change', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input></scarlet-input>'
    });

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = 'final';
    input.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('final');
  });

  it('sets aria-invalid and renders the error message when errorMessage is provided', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input error-message="Campo obrigatório"></scarlet-input>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    const message = page.root?.shadowRoot?.querySelector('.scarlet-input__message--error');

    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe(message?.id);
    expect(message?.textContent?.trim()).toBe('Campo obrigatório');
  });

  it('prefers the error message over helper text when both are set', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input helper-text="ajuda" error-message="erro"></scarlet-input>'
    });

    const helper = page.root?.shadowRoot?.querySelector('.scarlet-input__message--helper');
    const error = page.root?.shadowRoot?.querySelector('.scarlet-input__message--error');

    expect(helper).toBeNull();
    expect(error?.textContent?.trim()).toBe('erro');
  });

  it('focuses the internal input via setFocus()', async () => {
    const page = await newSpecPage({
      components: [ScarletInput],
      html: '<scarlet-input></scarlet-input>'
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    const focusSpy = jest.spyOn(input, 'focus');

    await page.rootInstance.setFocus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
