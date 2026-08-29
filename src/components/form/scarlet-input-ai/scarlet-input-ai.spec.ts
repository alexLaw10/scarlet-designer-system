import { newSpecPage } from '@stencil/core/testing';
import { ScarletInputAi } from './scarlet-input-ai';

// Real (short) timers, not jest.useFakeTimers()/advanceTimersByTime(): mixing
// those with newSpecPage's own internal scheduling reliably hangs the test —
// see scarlet-toast's/scarlet-copy's specs for the same note.
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function setup(improve?: (value: string, context?: string) => Promise<string>) {
  const page = await newSpecPage({
    components: [ScarletInputAi],
    html: '<scarlet-input-ai value="ola mundo"></scarlet-input-ai>'
  });
  if (improve) {
    page.rootInstance.improve = improve;
    await page.waitForChanges();
  }
  const input = page.root!.shadowRoot!.querySelector('input') as HTMLInputElement;
  return { page, input };
}

describe('scarlet-input-ai', () => {
  it('hides the improve button entirely when no improve function is set', async () => {
    const { page } = await setup();
    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve')).toBeNull();
  });

  it('shows the improve button once improve is set, disabled when the field is empty', async () => {
    const { page } = await setup(async v => v);
    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    expect(button).not.toBeNull();

    page.rootInstance.value = '';
    await page.waitForChanges();
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('shows a suggestion preview with Aplicar/Descartar when improve resolves to different text', async () => {
    const { page, input } = await setup(async v => `${v}!`);
    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;

    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();

    const preview = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview');
    expect(preview).not.toBeNull();
    expect(preview!.querySelector('.scarlet-input-ai__suggestion')?.textContent).toBe('ola mundo!');
    // Applying hasn't happened yet — the field itself is untouched.
    expect(input.value).toBe('ola mundo');
  });

  it('Aplicar replaces the value and emits scarletChange/scarletImprove', async () => {
    const { page, input } = await setup(async v => `${v}!`);
    const changeSpy = jest.fn();
    const improveSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);
    page.root?.addEventListener('scarletImprove', improveSpy);

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();

    const applyButton = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__apply') as HTMLButtonElement;
    applyButton.click();
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('ola mundo!');
    expect(input.value).toBe('ola mundo!');
    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe('ola mundo!');
    expect(improveSpy).toHaveBeenCalledTimes(1);
    expect(improveSpy.mock.calls[0][0].detail).toBe('ola mundo!');
    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).toBeNull();
  });

  it('Descartar dismisses the suggestion, keeping the original value', async () => {
    const { page, input } = await setup(async v => `${v}!`);

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();

    const discardButton = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__discard') as HTMLButtonElement;
    discardButton.click();
    await page.waitForChanges();

    expect(page.rootInstance.value).toBe('ola mundo');
    expect(input.value).toBe('ola mundo');
    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).toBeNull();
  });

  it('shows the "already good" note instead of a preview when the suggestion matches the value', async () => {
    const { page } = await setup(async v => v);

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).toBeNull();
    const note = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__note');
    expect(note?.classList.contains('scarlet-input-ai__note--visible')).toBe(true);
    expect(note?.textContent).toBe('Já está bom 👍');
  });

  it('shows an error note and emits scarletImproveError when improve rejects', async () => {
    const { page } = await setup(async () => {
      throw new Error('boom');
    });
    const errorSpy = jest.fn();
    page.root?.addEventListener('scarletImproveError', errorSpy);

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect((errorSpy.mock.calls[0][0].detail as Error).message).toBe('boom');
    const note = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__note');
    expect(note?.classList.contains('scarlet-input-ai__note--error')).toBe(true);
    expect(note?.textContent).toBe('Não foi possível melhorar o texto.');
  });

  it('editing the field while a suggestion is showing dismisses it', async () => {
    const { page, input } = await setup(async v => `${v}!`);

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();
    await wait(10);
    await page.waitForChanges();
    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).not.toBeNull();

    input.value = 'ola mundo editado';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).toBeNull();
  });

  it('drops a response that arrives after the value already changed', async () => {
    let resolveImprove!: (value: string) => void;
    const { page, input } = await setup(
      () =>
        new Promise<string>(resolve => {
          resolveImprove = resolve;
        })
    );

    const button = page.root!.shadowRoot!.querySelector('.scarlet-input-ai__improve') as HTMLButtonElement;
    button.click();
    await page.waitForChanges();

    // The user keeps editing while the request is still in flight.
    input.value = 'valor novo';
    input.dispatchEvent(new Event('input'));
    await page.waitForChanges();

    resolveImprove('ola mundo!');
    await wait(10);
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('.scarlet-input-ai__preview')).toBeNull();
    expect(page.rootInstance.value).toBe('valor novo');
  });

  it('setFocus() focuses the internal input', async () => {
    const { page, input } = await setup();
    const focusSpy = jest.fn();
    input.focus = focusSpy;

    await page.rootInstance.setFocus();

    expect(focusSpy).toHaveBeenCalledTimes(1);
  });
});
