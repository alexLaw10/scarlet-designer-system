import { Component, Prop, State, Event, type EventEmitter, h, Host } from '@stencil/core';

export interface ScarletTableColumn {
  /** Key looked up on each row object for this column's cell content. */
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  /** Any valid CSS width, e.g. `'120px'` or `'20%'`. */
  width?: string;
}

export type ScarletTableSortDirection = 'asc' | 'desc';

export interface ScarletTableSortChange {
  key: string;
  direction: ScarletTableSortDirection;
}

export type ScarletTableRow = Record<string, unknown>;

/**
 * A data table: sortable columns, optional row selection (checkboxes),
 * empty/loading states, and a horizontally-scrolling wrapper so a wide
 * table never breaks the surrounding layout on a narrow viewport (same
 * pattern `scarlet-tabs` uses for its tab list).
 *
 * Cell content is `String(row[column.key])` by default — good enough for
 * plain text/numbers, but there's no per-cell slot system (that needs a
 * stable id per row and gets complex fast). For anything richer — a
 * `scarlet-badge` status, a formatted currency, a truncated link — pass
 * `formatCell`, a plain function `(row, column) => string` set as a JS
 * property (like `columns`/`rows` themselves, it isn't parseable from an
 * HTML attribute).
 *
 * Sorting is handled internally using a locale-aware comparator (numeric
 * for `number` values, `localeCompare` otherwise) — good for typical
 * text/number columns without any setup. `scarletSort` still fires on every
 * click if a consumer wants to replace that with their own comparator (e.g.
 * sorting a formatted date column by its real underlying timestamp) by
 * reassigning `rows` themselves in response.
 */
@Component({
  tag: 'scarlet-table',
  styleUrl: 'scarlet-table.scss',
  shadow: true,
})
export class ScarletTable {
  private selectAllEl?: HTMLInputElement;

  /** Column definitions, in display order. */
  @Prop() readonly columns: ScarletTableColumn[] = [];

  /** The data to render, one object per row. */
  @Prop() readonly rows: ScarletTableRow[] = [];

  /** Field on each row object holding its unique identifier — used for selection tracking. */
  @Prop() readonly rowKey = 'id';

  /** Shows a checkbox column and enables row selection. */
  @Prop() readonly selectable = false;

  /** Keys (from `rowKey`) of the currently selected rows. */
  @Prop({ mutable: true }) selectedRowKeys: Array<string | number> = [];

  /** Makes whole rows clickable (emits `scarletRowClick`), e.g. to open a detail view. */
  @Prop() readonly clickableRows = false;

  /** Message shown instead of rows when `rows` is empty. */
  @Prop() readonly emptyMessage = 'Nenhum registro encontrado.';

  /** Shows `loadingMessage` instead of rows/empty state. */
  @Prop() readonly loading = false;

  /** Message shown while `loading` is true. */
  @Prop() readonly loadingMessage = 'Carregando…';

  /** Accessible label for the table, when there is no visible heading nearby. */
  @Prop() readonly ariaLabel?: string;

  /** Optional per-cell formatter, overriding the default `String(row[column.key])`. Set as a JS property, not an HTML attribute. */
  @Prop() readonly formatCell?: (row: ScarletTableRow, column: ScarletTableColumn) => string;

  @State() private sortKey?: string;
  @State() private sortDirection: ScarletTableSortDirection = 'asc';

  /** Emitted when a sortable column header is activated. The table already re-sorts itself with a generic comparator — listen here only to replace that with custom logic. */
  @Event() scarletSort!: EventEmitter<ScarletTableSortChange>;

  /** Emitted with the full array of selected row keys whenever a row or the "select all" checkbox is toggled. */
  @Event() scarletSelectionChange!: EventEmitter<Array<string | number>>;

  /** Emitted with the row's data when a row is clicked. Only fires when `clickableRows` is set. */
  @Event() scarletRowClick!: EventEmitter<ScarletTableRow>;

  componentDidRender(): void {
    if (this.selectAllEl) {
      this.selectAllEl.indeterminate = this.someSelected();
    }
  }

  private get displayRows(): ScarletTableRow[] {
    if (!this.sortKey) return this.rows;
    const key = this.sortKey;
    const factor = this.sortDirection === 'asc' ? 1 : -1;

    return [...this.rows].sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -1 * factor;
      if (valueB == null) return 1 * factor;
      if (typeof valueA === 'number' && typeof valueB === 'number') return (valueA - valueB) * factor;
      return String(valueA).localeCompare(String(valueB), 'pt-BR', { numeric: true }) * factor;
    });
  }

  private handleSort(column: ScarletTableColumn): void {
    if (!column.sortable) return;
    const direction: ScarletTableSortDirection = this.sortKey === column.key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortKey = column.key;
    this.sortDirection = direction;
    this.scarletSort.emit({ key: column.key, direction });
  }

  private rowKeyValue(row: ScarletTableRow): string | number | undefined {
    return row[this.rowKey] as string | number | undefined;
  }

  private isRowSelected(row: ScarletTableRow): boolean {
    const key = this.rowKeyValue(row);
    return key !== undefined && this.selectedRowKeys.includes(key);
  }

  private someSelected(): boolean {
    return this.rows.some((row) => this.isRowSelected(row)) && !this.allSelected();
  }

  private allSelected(): boolean {
    return this.rows.length > 0 && this.rows.every((row) => this.isRowSelected(row));
  }

  private toggleRow(row: ScarletTableRow): void {
    const key = this.rowKeyValue(row);
    if (key === undefined) return;
    const next = this.isRowSelected(row) ? this.selectedRowKeys.filter((k) => k !== key) : [...this.selectedRowKeys, key];
    this.selectedRowKeys = next;
    this.scarletSelectionChange.emit(next);
  }

  private toggleAll(): void {
    const next = this.allSelected() ? [] : this.rows.map((row) => this.rowKeyValue(row)).filter((key): key is string | number => key !== undefined);
    this.selectedRowKeys = next;
    this.scarletSelectionChange.emit(next);
  }

  private cellContent(row: ScarletTableRow, column: ScarletTableColumn): string {
    if (this.formatCell) return this.formatCell(row, column);
    const value = row[column.key];
    return value == null ? '' : String(value);
  }

  render() {
    const rows = this.displayRows;
    const columnCount = this.columns.length + (this.selectable ? 1 : 0);

    return (
      <Host class="scarlet-table-host">
        <div class="scarlet-table__scroll">
          <table class="scarlet-table__table" aria-label={this.ariaLabel}>
            <thead class="scarlet-table__head">
              <tr>
                {this.selectable ? (
                  <th class="scarlet-table__cell scarlet-table__cell--checkbox" scope="col">
                    <input
                      ref={(el) => (this.selectAllEl = el)}
                      type="checkbox"
                      checked={this.allSelected()}
                      disabled={this.rows.length === 0}
                      aria-label="Selecionar todas as linhas"
                      onChange={() => this.toggleAll()}
                    />
                  </th>
                ) : null}
                {this.columns.map((column) => {
                  const isSorted = this.sortKey === column.key;
                  return (
                    <th
                      class={{
                        'scarlet-table__cell': true,
                        'scarlet-table__cell--head': true,
                        [`scarlet-table__cell--${column.align ?? 'left'}`]: true,
                      }}
                      scope="col"
                      style={column.width ? { width: column.width } : undefined}
                      aria-sort={isSorted ? (this.sortDirection === 'asc' ? 'ascending' : 'descending') : column.sortable ? 'none' : undefined}
                    >
                      {column.sortable ? (
                        <button type="button" class="scarlet-table__sort" onClick={() => this.handleSort(column)}>
                          {column.label}
                          <scarlet-icon
                            name={isSorted && this.sortDirection === 'desc' ? 'chevron-down' : 'chevron-up'}
                            size="0.9em"
                            class={{ 'scarlet-table__sort-icon': true, 'scarlet-table__sort-icon--inactive': !isSorted }}
                          />
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody class="scarlet-table__body">
              {this.loading ? (
                <tr>
                  <td class="scarlet-table__empty" colSpan={columnCount}>
                    {this.loadingMessage}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td class="scarlet-table__empty" colSpan={columnCount}>
                    {this.emptyMessage}
                  </td>
                </tr>
              ) : (
                rows.map((row, rowIndex) => (
                  <tr
                    class={{
                      'scarlet-table__row': true,
                      'scarlet-table__row--selected': this.selectable && this.isRowSelected(row),
                      'scarlet-table__row--clickable': this.clickableRows,
                    }}
                    onClick={this.clickableRows ? () => this.scarletRowClick.emit(row) : undefined}
                  >
                    {this.selectable ? (
                      <td class="scarlet-table__cell scarlet-table__cell--checkbox" onClick={(event) => event.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={this.isRowSelected(row)}
                          aria-label={`Selecionar linha ${rowIndex + 1}`}
                          onChange={() => this.toggleRow(row)}
                        />
                      </td>
                    ) : null}
                    {this.columns.map((column) => (
                      <td class={{ 'scarlet-table__cell': true, [`scarlet-table__cell--${column.align ?? 'left'}`]: true }}>
                        {this.cellContent(row, column)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Host>
    );
  }
}
