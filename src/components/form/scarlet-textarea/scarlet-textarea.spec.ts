import { newSpecPage } from '@stencil/core/testing';
import { ScarletTextarea } from './scarlet-textarea';

describe('scarlet-textarea', () => {
  it('renders a label wired to the textarea via id/for', async () => {
    const page = await newSpecPage({
      components: [ScarletTextarea],
      html: `<scarlet-textarea label="Comentário"></scarlet-textarea>`,
    });

    const label = page.root?.shadowRoot?.querySelector('label') as HTMLLabelElement;
    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    expect(label.textContent?.trim()).toBe('Comentário');
    expect(label.getAttribute('for')).toBe(textarea.id);
    // mock-doc doesn't reflect .rows as an IDL property on <textarea>.
    expect(textarea.getAttribute('rows')).toBe('4');
  });

  it('emits scarletInput on keystrokes and updates value', async () => {
    const page = await newSpecPage({
      components: [ScarletTextarea],
      html: `<scarlet-textarea></scarlet-textarea>`,
    });

    const inputSpy = jest.fn();
    page.root?.addEventListener('scarletInput', inputSpy);

    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    textarea.value = 'texto longo';
    textarea.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(inputSpy).toHaveBeenCalledTimes(1);
    expect(inputSpy.mock.calls[0][0].detail).toBe('texto longo');
    expect(page.rootInstance.value).toBe('texto longo');
  });

  it('sets aria-invalid and renders the error message when errorMessage is provided', async () => {
    const page = await newSpecPage({
      components: [ScarletTextarea],
      html: `<scarlet-textarea error-message="Campo obrigatório"></scarlet-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    const message = page.root?.shadowRoot?.querySelector('.scarlet-textarea__message--error');

    expect(textarea.getAttribute('aria-invalid')).toBe('true');
    expect(textarea.getAttribute('aria-describedby')).toBe(message?.id);
  });

  it('applies the requested resize modifier', async () => {
    const page = await newSpecPage({
      components: [ScarletTextarea],
      html: `<scarlet-textarea resize="none"></scarlet-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    expect(textarea.classList.contains('scarlet-textarea--resize-none')).toBe(true);
  });

  it('focuses the internal textarea via setFocus()', async () => {
    const page = await newSpecPage({
      components: [ScarletTextarea],
      html: `<scarlet-textarea></scarlet-textarea>`,
    });

    const textarea = page.root?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;
    const focusSpy = jest.spyOn(textarea, 'focus');

    await page.rootInstance.setFocus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
