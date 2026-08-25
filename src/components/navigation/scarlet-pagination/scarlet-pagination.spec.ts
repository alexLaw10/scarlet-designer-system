import { newSpecPage } from '@stencil/core/testing';
import { ScarletPagination } from './scarlet-pagination';

function pageButtons(page: Awaited<ReturnType<typeof newSpecPage>>) {
  return Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__page')).map((el) => el.textContent?.trim());
}

describe('scarlet-pagination', () => {
  it('shows every page when totalPages fits without collapsing', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="5" page="2"></scarlet-pagination>`,
    });

    expect(pageButtons(page)).toEqual(['1', '2', '3', '4', '5']);
    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__ellipsis').length).toBe(0);
  });

  it('collapses distant pages into an ellipsis, keeping first, last and siblings around the current page', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="20" page="10" sibling-count="1"></scarlet-pagination>`,
    });

    expect(pageButtons(page)).toEqual(['1', '9', '10', '11', '20']);
    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__ellipsis').length).toBe(2);
  });

  it('marks the current page with aria-current="page"', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="5" page="3"></scarlet-pagination>`,
    });

    const current = page.root!.shadowRoot!.querySelector('[aria-current="page"]');
    expect(current?.textContent?.trim()).toBe('3');
  });

  it('emits scarletChange with the new page when a page button is clicked', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="5" page="1"></scarlet-pagination>`,
    });
    const changeSpy = jest.fn();
    page.root?.addEventListener('scarletChange', changeSpy);

    const buttons = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__page')) as HTMLButtonElement[];
    buttons[2].click();
    await page.waitForChanges();

    expect(changeSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy.mock.calls[0][0].detail).toBe(3);
    expect(page.rootInstance.page).toBe(3);
  });

  it('disables the previous button on the first page and the next button on the last page', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="5" page="1"></scarlet-pagination>`,
    });

    const [prevButton, nextButton] = page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__nav') as NodeListOf<HTMLButtonElement>;
    expect(prevButton.disabled).toBe(true);
    expect(nextButton.disabled).toBe(false);

    page.rootInstance.page = 5;
    await page.waitForChanges();

    expect(prevButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(true);
  });

  it('advances one page via the next button', async () => {
    const page = await newSpecPage({
      components: [ScarletPagination],
      html: `<scarlet-pagination total-pages="5" page="2"></scarlet-pagination>`,
    });

    const nextButton = page.root!.shadowRoot!.querySelectorAll('.scarlet-pagination__nav')[1] as HTMLButtonElement;
    nextButton.click();
    await page.waitForChanges();

    expect(page.rootInstance.page).toBe(3);
  });
});
