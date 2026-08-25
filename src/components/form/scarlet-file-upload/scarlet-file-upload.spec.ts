import { newSpecPage } from '@stencil/core/testing';
import { ScarletFileUpload } from './scarlet-file-upload';

function selectFiles(input: HTMLInputElement, files: File[]): void {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  input.dispatchEvent(new Event('change'));
}

describe('scarlet-file-upload', () => {
  it('adds a selected file to the list and emits scarletChange', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload></scarlet-file-upload>'
    });
    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['conteúdo'], 'curriculo.pdf', { type: 'application/pdf' });
    selectFiles(input, [file]);
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toEqual([file]);

    const name = page.root!.shadowRoot!.querySelector('.scarlet-file-upload__name');
    expect(name?.textContent?.trim()).toBe('curriculo.pdf');
  });

  it('replaces the previous file instead of appending when multiple is not set', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload></scarlet-file-upload>'
    });
    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;

    selectFiles(input, [new File(['a'], 'primeiro.pdf')]);
    await page.waitForChanges();
    selectFiles(input, [new File(['b'], 'segundo.pdf')]);
    await page.waitForChanges();

    const names = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-file-upload__name')
    ).map(el => el.textContent?.trim());
    expect(names).toEqual(['segundo.pdf']);
  });

  it('appends files across selections when multiple is set', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload multiple></scarlet-file-upload>'
    });
    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;

    selectFiles(input, [new File(['a'], 'primeiro.pdf')]);
    await page.waitForChanges();
    selectFiles(input, [new File(['b'], 'segundo.pdf')]);
    await page.waitForChanges();

    const names = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-file-upload__name')
    ).map(el => el.textContent?.trim());
    expect(names).toEqual(['primeiro.pdf', 'segundo.pdf']);
  });

  it('rejects a file over maxSizeBytes with an error message, without adding it', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload max-size-bytes="10"></scarlet-file-upload>'
    });
    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;

    selectFiles(input, [new File(['conteúdo bem maior que dez bytes'], 'grande.pdf')]);
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-file-upload__name')).toBeNull();
    const error = page.root!.shadowRoot!.querySelector('.scarlet-file-upload__message--error');
    expect(error?.textContent).toContain('grande.pdf');
  });

  it('removes a file from the list and emits the updated array', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload multiple></scarlet-file-upload>'
    });
    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
    selectFiles(input, [new File(['a'], 'um.pdf'), new File(['b'], 'dois.pdf')]);
    await page.waitForChanges();

    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const removeButton = page.root!.shadowRoot!.querySelector(
      '.scarlet-file-upload__remove'
    ) as HTMLButtonElement;
    removeButton.click();
    await page.waitForChanges();

    expect(changeSpy.mock.calls[0][0].detail.map((f: File) => f.name)).toEqual(['dois.pdf']);
    const names = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-file-upload__name')
    ).map(el => el.textContent?.trim());
    expect(names).toEqual(['dois.pdf']);
  });

  it('clear() resets the file list', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload></scarlet-file-upload>'
    });
    const input = page.root!.shadowRoot!.querySelector('input[type="file"]') as HTMLInputElement;
    selectFiles(input, [new File(['a'], 'um.pdf')]);
    await page.waitForChanges();

    await page.rootInstance.clear();
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-file-upload__list')).toBeNull();
  });

  it('toggles the dragover state on dragover/dragleave', async () => {
    const page = await newSpecPage({
      components: [ScarletFileUpload],
      html: '<scarlet-file-upload></scarlet-file-upload>'
    });
    const dropzone = page.root!.shadowRoot!.querySelector(
      '.scarlet-file-upload__dropzone'
    ) as HTMLElement;

    dropzone.dispatchEvent(new Event('dragover', { cancelable: true }));
    await page.waitForChanges();
    expect(dropzone.classList.contains('scarlet-file-upload__dropzone--dragover')).toBe(true);

    dropzone.dispatchEvent(new Event('dragleave'));
    await page.waitForChanges();
    expect(dropzone.classList.contains('scarlet-file-upload__dropzone--dragover')).toBe(false);
  });
});
