import { newSpecPage } from '@stencil/core/testing';
import { ScarletTable, type ScarletTableRow, type ScarletTableColumn } from './scarlet-table';

const columns = [
  { key: 'name', label: 'Nome', sortable: true },
  { key: 'age', label: 'Idade', sortable: true },
];

const rows = [
  { id: 1, name: 'Carla', age: 30 },
  { id: 2, name: 'Ana', age: 25 },
  { id: 3, name: 'Bruno', age: 40 },
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
    html: `<scarlet-table></scarlet-table>`,
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

    const bodyRows = page.root!.shadowRoot!.querySelectorAll('.scarlet-table__body .scarlet-table__row');
    expect(bodyRows.length).toBe(3);

    const firstRowCells = bodyRows[0].querySelectorAll('.scarlet-table__cell');
    expect(Array.from(firstRowCells).map((cell) => cell.textContent?.trim())).toEqual(['Carla', '30']);
  });

  it('shows emptyMessage instead of rows when there is no data', async () => {
    const page = await setup({ rows: [] });

    expect(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row').length).toBe(0);
    const empty = page.root!.shadowRoot!.querySelector('.scarlet-table__empty');
    expect(empty?.textContent?.trim()).toBe('Nenhum registro encontrado.');
  });

  it('shows loadingMessage instead of rows/empty state while loading', async () => {
    const page = await setup({ loading: true, rows: [] });

    const empty = page.root!.shadowRoot!.querySelector('.scarlet-table__empty');
    expect(empty?.textContent?.trim()).toBe('Carregando…');
  });

  it('sorts ascending on the first header click, descending on the second, and toggles aria-sort', async () => {
    const page = await setup();
    const sortSpy = jest.fn();
    page.root?.addEventListener('scarletSort', sortSpy);

    const nameHeaderButton = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')).find(
      (el) => el.textContent?.includes('Nome'),
    ) as HTMLButtonElement;
    nameHeaderButton.click();
    await page.waitForChanges();

    let names = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map(
      (row) => row.querySelector('.scarlet-table__cell')?.textContent?.trim(),
    );
    expect(names).toEqual(['Ana', 'Bruno', 'Carla']);
    expect(sortSpy).toHaveBeenCalledTimes(1);
    expect(sortSpy.mock.calls[0][0].detail).toEqual({ key: 'name', direction: 'asc' });

    const nameHeaderCell = nameHeaderButton.closest('th');
    expect(nameHeaderCell?.getAttribute('aria-sort')).toBe('ascending');

    nameHeaderButton.click();
    await page.waitForChanges();

    names = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map(
      (row) => row.querySelector('.scarlet-table__cell')?.textContent?.trim(),
    );
    expect(names).toEqual(['Carla', 'Bruno', 'Ana']);
    expect(nameHeaderCell?.getAttribute('aria-sort')).toBe('descending');
  });

  it('sorts numeric columns numerically, not lexicographically', async () => {
    const page = await setup();

    const ageHeaderButton = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__sort')).find((el) =>
      el.textContent?.includes('Idade'),
    ) as HTMLButtonElement;
    ageHeaderButton.click();
    await page.waitForChanges();

    const ages = Array.from(page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row')).map((row) =>
      row.querySelectorAll('.scarlet-table__cell')[1]?.textContent?.trim(),
    );
    expect(ages).toEqual(['25', '30', '40']);
  });

  it('toggles a single row and emits the updated selection', async () => {
    const page = await setup({ selectable: true });
    const selectionSpy = jest.fn();
    page.root?.addEventListener('scarletSelectionChange', selectionSpy);

    const firstRowCheckbox = page.root!.shadowRoot!.querySelector('.scarlet-table__row input[type="checkbox"]') as HTMLInputElement;
    firstRowCheckbox.checked = true;
    firstRowCheckbox.dispatchEvent(new Event('change'));
    await page.waitForChanges();

    expect(selectionSpy).toHaveBeenCalledTimes(1);
    expect(selectionSpy.mock.calls[0][0].detail).toEqual([1]);
    expect(page.rootInstance.selectedRowKeys).toEqual([1]);
  });

  it('selects and deselects every row via the header checkbox', async () => {
    const page = await setup({ selectable: true });

    const headerCheckbox = page.root!.shadowRoot!.querySelector('thead input[type="checkbox"]') as HTMLInputElement;
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
    const page = await setup({ formatCell: (row, column) => (column.key === 'age' ? `${row.age} anos` : String(row.name)) });

    const firstRowCells = page.root!.shadowRoot!.querySelectorAll('.scarlet-table__row .scarlet-table__cell');
    expect(Array.from(firstRowCells).map((cell) => cell.textContent?.trim())).toEqual(['Carla', '30 anos']);
  });
});
