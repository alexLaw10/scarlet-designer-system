import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputDocument } from './scarlet-input-document';

// Well-known test fixtures that pass the real check-digit algorithm.
const VALID_CPF_DIGITS = '11144477735';
const VALID_CNPJ_DIGITS = '11222333000181';

describe('scarlet-input-document', () => {
  it('formats up to 11 digits as CPF', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document></scarlet-input-document>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = VALID_CPF_DIGITS;
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('111.444.777-35');
  });

  it('switches to CNPJ formatting past 11 digits', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document></scarlet-input-document>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.value = VALID_CNPJ_DIGITS;
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('11.222.333/0001-81');
  });

  it('reports isValid()/getDocumentType() correctly for a valid CPF', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document value="111.444.777-35"></scarlet-input-document>`,
    });

    await expect(page.rootInstance.isValid()).resolves.toBe(true);
    await expect(page.rootInstance.getDocumentType()).resolves.toBe('cpf');
  });

  it('shows the default error message on blur when a complete CPF fails the check digit', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      // Same as the valid fixture but with the last digit changed.
      html: `<scarlet-input-document value="111.444.777-30"></scarlet-input-document>`,
    });

    const validitySpy = jest.fn();
    page.root?.addEventListener('scarletValidityChange', validitySpy);

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(validitySpy).toHaveBeenCalledWith(expect.objectContaining({ detail: false }));
    const message = page.root?.shadowRoot?.querySelector('.scarlet-input-document__message--error');
    expect(message?.textContent?.trim()).toBe('CPF inválido.');
  });

  it('does not flag an incomplete value as invalid on blur', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document value="111.444"></scarlet-input-document>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-input-document__message--error')).toBeNull();
  });

  it('never runs automatic validation when validate=false', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document value="111.444.777-30" validate="false"></scarlet-input-document>`,
    });

    const input = page.root?.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new Event('blur'));
    await page.waitForChanges();

    expect(page.root?.shadowRoot?.querySelector('.scarlet-input-document__message--error')).toBeNull();
  });

  it('lets an explicit errorMessage override the automatic validation message', async () => {
    const page = await newSpecPage({
      components: [ScarletInputDocument],
      html: `<scarlet-input-document value="111.444.777-30" error-message="Documento já cadastrado."></scarlet-input-document>`,
    });

    const message = page.root?.shadowRoot?.querySelector('.scarlet-input-document__message--error');
    expect(message?.textContent?.trim()).toBe('Documento já cadastrado.');
  });
});
