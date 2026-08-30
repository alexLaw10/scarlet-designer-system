import { newSpecPage } from '@stencil/core/testing';
import { ScarletTable, type ScarletTableRow, type ScarletTableColumn } from './scarlet-table';

const columns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'age', label: 'Idade', sortable: true }
];

const rows = [
  { id: 1, name: 'Carla', age: 30 },
  { id: 2, name: 'Ana', age: 25 },
  { id: 3, name: 'Bruno', age: 40 }
];

// A plain, widened shape instead of `Partial<ScarletTable>`: Stencil's
// `@Prop() readonly loading = false;` (no explicit `: boolean`) infers the
// literal type `false`, not `boolean`, so `Partial<ScarletTable>` would make
// `loading` only ever accept `false` again — never the `true` these tests
// actually need to pass.
interface SetupOverrides {
  rows?: ScarletTableRow[];
  loading?: boolean;
  selectable?: boolean;
  clickableRows?: boolean;
  formatCell?: (row: ScarletTableRow, column: ScarletTableColumn) => string;
}

async function setup(overrides: SetupOverrides = {}) {
  const page = await newSpecPage({
    components: [ScarletTable],
    html: '<scarlet-table></scarlet-table>'
  });
  page.rootInstance.columns = columns;
  page.rootInstance.rows = rows;
  Object.assign(page.rootInstance, overrides);
  await page.waitForChanges();
  return page;
}

describe('scarlet-table', () => {
  it('renders one row per item, with a cell per column', async () => {
    const page = await setup();

    const bodyRows = page.root!.shadowRoot!.querySelectorAll(
      '.scarlet-table__body .scarlet-table__row'
    );
    expect(bodyRows.length).toBe(3);

    const firstRowCells = bodyRows[0].querySelectorAll('.scarlet-table__cell');
    expect(Array.from(firstRowCells).map(cell => cell.textContent?.trim())).toEqual([
      'Carla',
      '30'
    ]);
  });

  it('shows emptyMessage instead of rows when there is no data', async () => {
    const page = await setup({ rows: [] });

    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row').length).toBe(0);
    const empty = page.root!.shadowRoot!.querySelector('.scarlet-table__empty');
    expect(empty?.textContent?.trim()).toBe('Nenhum registro encontrado.');
  });

  it('shows loadingRowCount skeleton rows instead of rows/empty state while loading', async () => {
    const page = await setup({ loading: true, rows: [] });

    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__empty').length).toBe(0);
    const skeletonRows = page.root!.shadowRoot!.querySelectorAll('.scarlet-table__body .scarlet-table__row');
    expect(skeletonRows.length).toBe(5);
    expect(skeletonRows[0].querySelectorAll('scarlet-skeleton').length).toBe(columns.length);
    expect(page.root!.shadowRoot!.querySelector('table')?.getAttribute('aria-busy')).toBe('true');
  });

  it('respects a custom loadingRowCount', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.loading = true;
    page.rootInstance.loadingRowCount = 3;
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__body .scarlet-table__row').length).toBe(3);
  });

  it('sorts ascending on the first header click, descending on the second, and toggles aria-sort', async () => {
    const page = await setup();
    const sortSpy = jest.fn();
    page.root?.addEventListener('scarletSort', sortSpy);

    const nameHeaderButton = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')
    ).find(el => el.textContent?.includes('Nome')) as HTMLButtonElement;
    nameHeaderButton.click();
    await page.waitForChanges();

    let names = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map(
      row => row.querySelector('.scarlet-table__cell')?.textContent?.trim()
    );
    expect(names).toEqual(['Ana', 'Bruno', 'Carla']);
    expect(sortSpy).toHaveBeenCalledTimes(1);
    expect(sortSpy.mock.calls[0][0].detail).toEqual([{ key: 'name', direction: 'asc' }]);

    const nameHeaderCell = nameHeaderButton.closest('th');
    expect(nameHeaderCell?.getAttribute('aria-sort')).toBe('ascending');

    nameHeaderButton.click();
    await page.waitForChanges();

    names = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map(row =>
      row.querySelector('.scarlet-table__cell')?.textContent?.trim()
    );
    expect(names).toEqual(['Carla', 'Bruno', 'Ana']);
    expect(nameHeaderCell?.getAttribute('aria-sort')).toBe('descending');
  });

  it('sorts numeric columns numerically, not lexicographically', async () => {
    const page = await setup();

    const ageHeaderButton = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')
    ).find(el => el.textContent?.includes('Idade')) as HTMLButtonElement;
    ageHeaderButton.click();
    await page.waitForChanges();

    const ages = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map(
      row => row.querySelectorAll('.scarlet-table__cell')[1]?.textContent?.trim()
    );
    expect(ages).toEqual(['25', '30', '40']);
  });

  it('toggles a single row and emits the updated selection', async () => {
    const page = await setup({ selectable: true });
    const selectionSpy = jest.fn();
    page.root?.addEventListener('scarletSelectionChange', selectionSpy);

    const firstRowCheckbox = page.root!.shadowRoot!.querySelector(
      '.scarlet-table__row input[type="checkbox"]'
    ) as HTMLInputElement;
    firstRowCheckbox.checked = true;
    firstRowCheckbox.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(selectionSpy).toHaveBeenCalledTimes(1);
    expect(selectionSpy.mock.calls[0][0].detail).toEqual([1]);
    expect(page.rootInstance.selectedRowKeys).toEqual([1]);
  });

  it('selects and deselects every row via the header checkbox', async () => {
    const page = await setup({ selectable: true });

    const headerCheckbox = page.root!.shadowRoot!.querySelector(
      'thead input[type="checkbox"]'
    ) as HTMLInputElement;
    headerCheckbox.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(page.rootInstance.selectedRowKeys).toEqual([1, 2, 3]);

    headerCheckbox.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(page.rootInstance.selectedRowKeys).toEqual([]);
  });

  it('emits scarletRowClick with the row data when clickableRows is set', async () => {
    const page = await setup({ clickableRows: true });
    const rowClickSpy = jest.fn();
    page.root?.addEventListener('scarletRowClick', rowClickSpy);

    const firstRow = page.root!.shadowRoot!.querySelector('.scarlet-table__row') as HTMLElement;
    firstRow.click();

    expect(rowClickSpy).toHaveBeenCalledTimes(1);
    expect(rowClickSpy.mock.calls[0][0].detail).toEqual({ id: 1, name: 'Carla', age: 30 });
  });

  it('uses formatCell instead of the raw value when provided', async () => {
    const page = await setup({
      formatCell: (row, column) => (column.key === 'age' ? `${row.age} anos` : String(row.name))
    });

    const firstRow = page.root!.shadowRoot!.querySelector(
      '.scarlet-table__body .scarlet-table__row'
    ) as HTMLElement;
    const firstRowCells = firstRow.querySelectorAll('.scarlet-table__cell');
    expect(Array.from(firstRowCells).map(cell => cell.textContent?.trim())).toEqual([
      'Carla',
      '30 anos'
    ]);
  });

  it('marks the header sticky via a host class when stickyHeader is set', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table sticky-header></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.rows = rows;
    await page.waitForChanges();

    expect(page.root!.shadowRoot!.querySelector('thead')?.classList.contains('scarlet-table__head--sticky')).toBe(
      true
    );
  });

  // jsdom doesn't implement DragEvent/DataTransfer at all, so drag
  // interactions here are simulated with a plain Event carrying a
  // minimal fake dataTransfer — enough for the component's own handlers,
  // which only ever call `.setData`/read `.effectAllowed`.
  function fakeDragEvent(type: string): Event {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'dataTransfer', {
      value: { setData: jest.fn(), effectAllowed: '' },
      configurable: true
    });
    return event;
  }

  it('reorders columns by dragging a header onto another, preserving column definitions', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table reorderable-columns></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.rows = rows;
    await page.waitForChanges();

    const reorderSpy = jest.fn();
    page.root?.addEventListener('scarletColumnReorder', reorderSpy);

    const headerCells = page.root!.shadowRoot!.querySelectorAll('.scarlet-table__cell--head');
    const nameHandle = headerCells[0].querySelector('.scarlet-table__drag-handle') as HTMLElement;
    const ageHeader = headerCells[1] as HTMLElement;

    nameHandle.dispatchEvent(fakeDragEvent('dragstart'));
    ageHeader.dispatchEvent(fakeDragEvent('dragover'));
    ageHeader.dispatchEvent(fakeDragEvent('drop'));
    await page.waitForChanges();

    expect(reorderSpy).toHaveBeenCalledTimes(1);
    expect(reorderSpy.mock.calls[0][0].detail).toEqual([columns[1], columns[0]]);

    const labels = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__cell--head')).map(cell =>
      cell.textContent?.trim()
    );
    expect(labels[0]).toBe('Idade');
  });

  it('reorders rows by dragging one onto another, updating rows and emitting scarletRowReorder', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table reorderable-rows></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.rows = rows;
    await page.waitForChanges();

    const reorderSpy = jest.fn();
    page.root?.addEventListener('scarletRowReorder', reorderSpy);

    const bodyRows = page.root!.shadowRoot!.querySelectorAll('.scarlet-table__body .scarlet-table__row');
    const firstHandle = bodyRows[0].querySelector('.scarlet-table__drag-handle') as HTMLElement;

    firstHandle.dispatchEvent(fakeDragEvent('dragstart'));
    bodyRows[2].dispatchEvent(fakeDragEvent('dragover'));
    bodyRows[2].dispatchEvent(fakeDragEvent('drop'));
    await page.waitForChanges();

    expect(reorderSpy).toHaveBeenCalledTimes(1);
    expect(reorderSpy.mock.calls[0][0].detail).toEqual([rows[1], rows[2], rows[0]]);
    expect(page.rootInstance.rows).toEqual([rows[1], rows[2], rows[0]]);
  });

  it('does not let rows be dragged while a column sort is active', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table reorderable-rows></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.rows = rows;
    await page.waitForChanges();

    const nameHeaderButton = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')).find(el =>
      el.textContent?.includes('Nome')
    ) as HTMLButtonElement;
    nameHeaderButton.click();
    await page.waitForChanges();

    const handle = page.root!.shadowRoot!.querySelector('.scarlet-table__drag-handle') as HTMLElement;
    expect(handle.classList.contains('scarlet-table__drag-handle--disabled')).toBe(true);
    expect(handle.getAttribute('draggable')).toBe('false');
  });

  it('multiSort: shift-clicking a second sortable header adds it as a tiebreaker, cycling asc -> desc -> removed', async () => {
    const page = await newSpecPage({
      components: [ScarletTable],
      html: '<scarlet-table multi-sort></scarlet-table>'
    });
    page.rootInstance.columns = columns;
    page.rootInstance.rows = rows;
    await page.waitForChanges();

    const sortSpy = jest.fn();
    page.root?.addEventListener('scarletSort', sortSpy);
    const [nameButton, ageButton] = Array.from(
      page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')
    ) as HTMLButtonElement[];

    nameButton.click();
    ageButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: true }));
    await page.waitForChanges();

    expect(sortSpy.mock.calls[1][0].detail).toEqual([
      { key: 'name', direction: 'asc' },
      { key: 'age', direction: 'asc' }
    ]);

    ageButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: true }));
    await page.waitForChanges();
    expect(sortSpy.mock.calls[2][0].detail).toEqual([
      { key: 'name', direction: 'asc' },
      { key: 'age', direction: 'desc' }
    ]);

    ageButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, shiftKey: true }));
    await page.waitForChanges();
    expect(sortSpy.mock.calls[3][0].detail).toEqual([{ key: 'name', direction: 'asc' }]);

    // A plain (non-shift) click always collapses back to a single-column sort.
    ageButton.click();
    await page.waitForChanges();
    expect(sortSpy.mock.calls[4][0].detail).toEqual([{ key: 'age', direction: 'asc' }]);
  });
});
