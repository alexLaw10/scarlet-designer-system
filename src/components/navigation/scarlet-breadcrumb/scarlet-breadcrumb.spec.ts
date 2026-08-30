import { newSpecPage } from '@stencil/core/testing';
import { ScarletBreadcrumb } from './scarlet-breadcrumb';

describe('scarlet-breadcrumb', () => {
  it('renders every item with a link except the last, which is plain text with aria-current="page"', async () => {
    const page = await newSpecPage({
      components: [ScarletBreadcrumb],
      html: '<scarlet-breadcrumb></scarlet-breadcrumb>'
    });
    page.rootInstance.items = [
      { label: 'Início', href: '/' },
      { label: 'Produtos', href: '/produtos' },
      { label: 'Mouse' }
    ];
    await page.waitForChanges();

    const links = page.root!.shadowRoot!.querySelectorAll('a.scarlet-breadcrumb__link');
    expect(links.length).toBe(2);
    expect(Array.from(links).map(link => link.textContent?.trim())).toEqual(['Início', 'Produtos']);

    const current = page.root!.shadowRoot!.querySelector('.scarlet-breadcrumb__current');
    expect(current?.textContent?.trim()).toBe('Mouse');
    expect(current?.getAttribute('aria-current')).toBe('page');
  });

  it('renders an item with no href as plain text even when it is not the last one', async () => {
    const page = await newSpecPage({
      components: [ScarletBreadcrumb],
      html: '<scarlet-breadcrumb></scarlet-breadcrumb>'
    });
    page.rootInstance.items = [
      { label: 'Início', href: '/' },
      { label: 'Sem link' },
      { label: 'Atual', href: '/atual' }
    ];
    await page.waitForChanges();

    const currentTexts = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-breadcrumb__current')
    ).map(el => el.textContent?.trim());
    expect(currentTexts).toContain('Sem link');
  });

  it('renders a separator between items but not after the last one', async () => {
    const page = await newSpecPage({
      components: [ScarletBreadcrumb],
      html: '<scarlet-breadcrumb></scarlet-breadcrumb>'
    });
    page.rootInstance.items = [
      { label: 'Início', href: '/' },
      { label: 'Produtos', href: '/produtos' },
      { label: 'Mouse' }
    ];
    await page.waitForChanges();

    const separators = page.root!.shadowRoot!.querySelectorAll('.scarlet-breadcrumb__separator');
    expect(separators.length).toBe(2);
  });

  it('emits a cancelable scarletNavigate on link click, and lets a listener stop the real navigation', async () => {
    const page = await newSpecPage({
      components: [ScarletBreadcrumb],
      html: '<scarlet-breadcrumb></scarlet-breadcrumb>'
    });
    page.rootInstance.items = [{ label: 'Início', href: '/' }, { label: 'Atual' }];
    await page.waitForChanges();

    // Typed as the real EventListener signature (event: Event), matching
    // addEventListener's own expectation — CustomEvent-specific access
    // (.detail) happens below, cast at the read site instead.
    const navigateSpy = jest.fn((event: Event) => event.preventDefault());
    page.root?.addEventListener('scarletNavigate', navigateSpy);

    const link = page.root!.shadowRoot!.querySelector(
      'a.scarlet-breadcrumb__link'
    ) as HTMLAnchorElement;
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true });
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');
    link.dispatchEvent(clickEvent);

    expect(navigateSpy).toHaveBeenCalledTimes(1);
    expect((navigateSpy.mock.calls[0][0] as CustomEvent).detail).toEqual({
      label: 'Início',
      href: '/'
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
