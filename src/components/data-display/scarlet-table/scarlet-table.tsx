import { Component, Prop, State, Watch, Event, type EventEmitter, h, Host } from '@stencil/core';

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
 * A data table: sortable columns (including multi-column sort), optional
 * row selection (checkboxes), drag-and-drop column/row reordering, empty/
 * loading states, and a horizontally-scrolling wrapper so a wide table
 * never breaks the surrounding layout on a narrow viewport (same pattern
 * `scarlet-tabs` uses for its tab list).
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
 * reassigning `rows` themselves in response. A plain click always sorts by
 * that column alone (toggling asc/desc); with `multiSort`, shift-clicking a
 * second sortable header adds it as a tiebreaker instead of replacing the
 * first, cycling asc → desc → removed on repeated shift-clicks.
 * `scarletSort` always emits the *complete* current sort, in priority
 * order — an empty array once every column is cleared.
 *
 * `reorderableColumns`/`reorderableRows` add drag handles for reordering
 * columns and rows by dragging. Known limitation: native HTML5 drag-and-
 * drop isn't keyboard-accessible — there's no non-pointer way to reorder.
 * Row reordering is disabled while any sort is active, since the row order
 * would just be re-derived from the sort on the next render; clear the
 * sort first (or don't combine the two features) to drag rows freely.
 */
@Component({
  tag: 'scarlet-table',
  styleUrl: 'scarlet-table.scss',
  shadow: true
})
export class ScarletTable {
  private selectAllEl?: HTMLInputElement;

  /** Column definitions, in display order — unless `reorderableColumns` has been used to drag them into a different order since. */
  @Prop() readonly columns: ScarletTableColumn[] = [];

  /** The data to render, one object per row. */
  @Prop({ mutable: true }) rows: ScarletTableRow[] = [];

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

  /** Shows placeholder skeleton rows instead of rows/empty state. */
  @Prop() readonly loading = false;

  /** Message shown alongside/instead of the skeleton rows while `loading` is true — kept for consumers that prefer plain text, or as the `aria-label` describing the skeleton state. */
  @Prop() readonly loadingMessage = 'Carregando…';

  /** Number of placeholder skeleton rows rendered while `loading` is true. */
  @Prop() readonly loadingRowCount = 5;

  /** Accessible label for the table, when there is no visible heading nearby. */
  @Prop() readonly ariaLabel?: string;

  /** Optional per-cell formatter, overriding the default `String(row[column.key])`. Set as a JS property, not an HTML attribute. */
  @Prop() readonly formatCell?: (row: ScarletTableRow, column: ScarletTableColumn) => string;

  /** Keeps the header row visible while the table's own body scrolls vertically — set `maxHeight` too, or there's nothing for it to stick against. */
  @Prop() readonly stickyHeader = false;

  /** Caps the table's height and makes it scroll vertically (in addition to the horizontal scroll it already has). Any valid CSS length, e.g. `'320px'`. */
  @Prop() readonly maxHeight?: string;

  /** Allows shift-clicking a second (third, ...) sortable header to sort by it as a tiebreaker, instead of replacing the current sort outright. */
  @Prop() readonly multiSort = false;

  /** Shows a drag handle per column header for reordering columns by dragging. */
  @Prop() readonly reorderableColumns = false;

  /** Shows a drag handle per row for reordering rows by dragging. Disabled while any column sort is active — see the class doc comment. */
  @Prop() readonly reorderableRows = false;

  @State() private sortState: ScarletTableSortChange[] = [];
  @State() private columnOrder: string[] = [];
  @State() private draggedColumnKey?: string;
  @State() private dragOverColumnKey?: string;
  @State() private draggedRowIndex?: number;
  @State() private dragOverRowIndex?: number;

  /** Emitted with the complete current sort (in priority order; empty once cleared) whenever a sortable header is clicked. The table already re-sorts itself with a generic comparator — listen here only to replace that with custom logic. */
  @Event() scarletSort!: EventEmitter<ScarletTableSortChange[]>;

  /** Emitted with the full array of selected row keys whenever a row or the "select all" checkbox is toggled. */
  @Event() scarletSelectionChange!: EventEmitter<Array<string | number>>;

  /** Emitted with the row's data when a row is clicked. Only fires when `clickableRows` is set. */
  @Event() scarletRowClick!: EventEmitter<ScarletTableRow>;

  /** Emitted with the columns in their new order after a drag-and-drop column reorder. */
  @Event() scarletColumnReorder!: EventEmitter<ScarletTableColumn[]>;

  /** Emitted with `rows` in their new order after a drag-and-drop row reorder — `rows` itself is already updated to match by the time this fires. */
  @Event() scarletRowReorder!: EventEmitter<ScarletTableRow[]>;

  componentWillLoad(): void {
    this.syncColumnOrder();
  }

  componentDidRender(): void {
    if (this.selectAllEl) {
      this.selectAllEl.indeterminate = this.someSelected();
    }
  }

  @Watch('columns')
  handleColumnsChange(): void {
    this.syncColumnOrder();
  }

  // Preserves drag-reordered position for columns that still exist, and
  // appends any newly-added ones at the end — so reassigning `columns`
  // from outside (e.g. toggling a column's visibility upstream) doesn't
  // silently discard a reorder the user just did.
  private syncColumnOrder(): void {
    const currentKeys = this.columns.map(column => column.key);
    const stillPresent = this.columnOrder.filter(key => currentKeys.includes(key));
    const added = currentKeys.filter(key => !this.columnOrder.includes(key));
    this.columnOrder = [...stillPresent, ...added];
  }

  private get orderedColumns(): ScarletTableColumn[] {
    return this.columnOrder
      .map(key => this.columns.find(column => column.key === key))
      .filter((column): column is ScarletTableColumn => column !== undefined);
  }

  private get displayRows(): ScarletTableRow[] {
    if (this.sortState.length === 0) return this.rows;

    return [...this.rows].sort((a, b) => {
      for (const { key, direction } of this.sortState) {
        const factor = direction === 'asc' ? 1 : -1;
        const valueA = a[key];
        const valueB = b[key];
        let cmp: number;
        if (valueA == null && valueB == null) cmp = 0;
        else if (valueA == null) cmp = -1;
        else if (valueB == null) cmp = 1;
        else if (typeof valueA === 'number' && typeof valueB === 'number') cmp = valueA - valueB;
        else cmp = String(valueA).localeCompare(String(valueB), 'pt-BR', { numeric: true });

        const result = cmp * factor;
        if (result !== 0) return result;
      }
      return 0;
    });
  }

  private handleSort(column: ScarletTableColumn, event: MouseEvent): void {
    if (!column.sortable) return;
    const index = this.sortState.findIndex(entry => entry.key === column.key);

    if (this.multiSort && event.shiftKey) {
      let next: ScarletTableSortChange[];
      if (index === -1) {
        next = [...this.sortState, { key: column.key, direction: 'asc' }];
      } else if (this.sortState[index].direction === 'asc') {
        next = [...this.sortState];
        next[index] = { key: column.key, direction: 'desc' };
      } else {
        next = this.sortState.filter((_, i) => i !== index);
      }
      this.sortState = next;
    } else {
      // A plain click always sorts by this column alone — toggling asc/desc
      // if it's already the sole active sort, starting fresh (ascending)
      // otherwise, discarding any other multi-sort columns.
      const isOnlyActiveSort = this.sortState.length === 1 && index === 0;
      const nextDirection: ScarletTableSortDirection =
        isOnlyActiveSort && this.sortState[0].direction === 'asc' ? 'desc' : 'asc';
      this.sortState = [{ key: column.key, direction: nextDirection }];
    }

    this.scarletSort.emit(this.sortState);
  }

  private rowKeyValue(row: ScarletTableRow): string | number | undefined {
    return row[this.rowKey] as string | number | undefined;
  }

  private isRowSelected(row: ScarletTableRow): boolean {
    const key = this.rowKeyValue(row);
    return key !== undefined && this.selectedRowKeys.includes(key);
  }

  private someSelected(): boolean {
    return this.rows.some(row => this.isRowSelected(row)) && !this.allSelected();
  }

  private allSelected(): boolean {
    return this.rows.length > 0 && this.rows.every(row => this.isRowSelected(row));
  }

  private toggleRow(row: ScarletTableRow): void {
    const key = this.rowKeyValue(row);
    if (key === undefined) return;
    const next = this.isRowSelected(row) ?
      this.selectedRowKeys.filter(k => k !== key) :
      [...this.selectedRowKeys, key];
    this.selectedRowKeys = next;
    this.scarletSelectionChange.emit(next);
  }

  private toggleAll(): void {
    const next = this.allSelected() ?
      [] :
      this.rows
        .map(row => this.rowKeyValue(row))
        .filter((key): key is string | number => key !== undefined);
    this.selectedRowKeys = next;
    this.scarletSelectionChange.emit(next);
  }

  private cellContent(row: ScarletTableRow, column: ScarletTableColumn): string {
    if (this.formatCell) return this.formatCell(row, column);
    const value = row[column.key];
    return value == null ? '' : String(value);
  }

  private handleColumnDragStart(event: DragEvent, key: string): void {
    this.draggedColumnKey = key;
    event.dataTransfer?.setData('text/plain', key);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private handleColumnDragOver(event: DragEvent, key: string): void {
    if (this.draggedColumnKey === undefined) return;
    event.preventDefault();
    if (this.draggedColumnKey !== key) this.dragOverColumnKey = key;
  }

  private handleColumnDrop(event: DragEvent, targetKey: string): void {
    event.preventDefault();
    const draggedKey = this.draggedColumnKey;
    this.draggedColumnKey = undefined;
    this.dragOverColumnKey = undefined;
    if (draggedKey === undefined || draggedKey === targetKey) return;

    const order = [...this.columnOrder];
    const fromIndex = order.indexOf(draggedKey);
    const toIndex = order.indexOf(targetKey);
    if (fromIndex === -1 || toIndex === -1) return;
    order.splice(fromIndex, 1);
    order.splice(toIndex, 0, draggedKey);
    this.columnOrder = order;
    this.scarletColumnReorder.emit(this.orderedColumns);
  }

  private handleColumnDragEnd(): void {
    this.draggedColumnKey = undefined;
    this.dragOverColumnKey = undefined;
  }

  private handleRowDragStart(event: DragEvent, index: number): void {
    if (this.sortState.length > 0) return;
    this.draggedRowIndex = index;
    event.dataTransfer?.setData('text/plain', String(index));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
  }

  private handleRowDragOver(event: DragEvent, index: number): void {
    if (this.draggedRowIndex === undefined) return;
    event.preventDefault();
    if (this.draggedRowIndex !== index) this.dragOverRowIndex = index;
  }

  private handleRowDrop(event: DragEvent, targetIndex: number): void {
    event.preventDefault();
    const fromIndex = this.draggedRowIndex;
    this.draggedRowIndex = undefined;
    this.dragOverRowIndex = undefined;
    if (fromIndex === undefined || fromIndex === targetIndex) return;

    const next = [...this.rows];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(targetIndex, 0, moved);
    this.rows = next;
    this.scarletRowReorder.emit(next);
  }

  private handleRowDragEnd(): void {
    this.draggedRowIndex = undefined;
    this.dragOverRowIndex = undefined;
  }

  render() {
    const rows = this.displayRows;
    const columns = this.orderedColumns;
    const rowDragEnabled = this.reorderableRows && this.sortState.length === 0;
    const columnCount =
      columns.length + (this.selectable ? 1 : 0) + (this.reorderableRows ? 1 : 0);

    return (
      <Host class='scarlet-table-host'>
        <div
          class='scarlet-table__scroll'
          style={this.maxHeight ? { maxHeight: this.maxHeight, overflowY: 'auto' } : undefined}
        >
          <table class='scarlet-table__table' aria-label={this.ariaLabel} aria-busy={this.loading ? 'true' : 'false'}>
            <thead
              class={{
                'scarlet-table__head': true,
                'scarlet-table__head--sticky': this.stickyHeader
              }}
            >
              <tr>
                {this.reorderableRows ? (
                  <th class='scarlet-table__cell scarlet-table__cell--head scarlet-table__cell--drag-handle' scope='col' aria-hidden='true' />
                ) : null}
                {this.selectable ? (
                  <th class='scarlet-table__cell scarlet-table__cell--head scarlet-table__cell--checkbox' scope='col'>
                    <input
                      ref={el => (this.selectAllEl = el)}
                      type='checkbox'
                      checked={this.allSelected()}
                      disabled={this.rows.length === 0}
                      aria-label='Selecionar todas as linhas'
                      onChange={() => this.toggleAll()}
                    />
                  </th>
                ) : null}
                {columns.map(column => {
                  const sortIndex = this.sortState.findIndex(entry => entry.key === column.key);
                  const isSorted = sortIndex !== -1;
                  const direction = isSorted ? this.sortState[sortIndex].direction : undefined;

                  return (
                    <th
                      class={{
                        'scarlet-table__cell': true,
                        'scarlet-table__cell--head': true,
                        [`scarlet-table__cell--${column.align ?? 'left'}`]: true,
                        'scarlet-table__cell--dragging': this.draggedColumnKey === column.key,
                        'scarlet-table__cell--drag-over': this.dragOverColumnKey === column.key
                      }}
                      scope='col'
                      style={column.width ? { width: column.width } : undefined}
                      aria-sort={
                        sortIndex === 0 ?
                          direction === 'asc' ?
                            'ascending' :
                            'descending' :
                          isSorted ?
                            'other' :
                            column.sortable ?
                              'none' :
                              undefined
                      }
                      onDragOver={
                        this.reorderableColumns ?
                          event => this.handleColumnDragOver(event, column.key) :
                          undefined
                      }
                      onDrop={
                        this.reorderableColumns ?
                          event => this.handleColumnDrop(event, column.key) :
                          undefined
                      }
                    >
                      {this.reorderableColumns ? (
                        // draggable/dragstart live on just the handle, not
                        // the whole <th> — otherwise starting a drag from
                        // inside the sort button below would fight with
                        // clicking it.
                        <scarlet-icon
                          name='grip-vertical'
                          size='1em'
                          class='scarlet-table__drag-handle'
                          aria-hidden='true'
                          draggable={true}
                          onDragStart={event => this.handleColumnDragStart(event, column.key)}
                          onDragEnd={() => this.handleColumnDragEnd()}
                        />
                      ) : null}
                      {column.sortable ? (
                        <button
                          type='button'
                          class='scarlet-table__sort'
                          onClick={event => this.handleSort(column, event)}
                        >
                          {column.label}
                          <scarlet-icon
                            name={direction === 'desc' ? 'chevron-down' : 'chevron-up'}
                            size='0.9em'
                            class={{
                              'scarlet-table__sort-icon': true,
                              'scarlet-table__sort-icon--inactive': !isSorted
                            }}
                          />
                          {this.multiSort && this.sortState.length > 1 && isSorted ? (
                            <span class='scarlet-table__sort-priority'>{sortIndex + 1}</span>
                          ) : null}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody class='scarlet-table__body'>
              {this.loading ? (
                Array.from({ length: this.loadingRowCount }).map(() => (
                  <tr class='scarlet-table__row' aria-hidden='true'>
                    {this.reorderableRows ? <td class='scarlet-table__cell scarlet-table__cell--drag-handle' /> : null}
                    {this.selectable ? <td class='scarlet-table__cell scarlet-table__cell--checkbox' /> : null}
                    {columns.map(() => (
                      <td class='scarlet-table__cell'>
                        <scarlet-skeleton variant='text' />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td class='scarlet-table__empty' colSpan={columnCount}>
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
                      'scarlet-table__row--dragging': this.draggedRowIndex === rowIndex,
                      'scarlet-table__row--drag-over': this.dragOverRowIndex === rowIndex
                    }}
                    onClick={this.clickableRows ? () => this.scarletRowClick.emit(row) : undefined}
                    onDragOver={rowDragEnabled ? event => this.handleRowDragOver(event, rowIndex) : undefined}
                    onDrop={rowDragEnabled ? event => this.handleRowDrop(event, rowIndex) : undefined}
                  >
                    {this.reorderableRows ? (
                      <td
                        class='scarlet-table__cell scarlet-table__cell--drag-handle'
                        onClick={event => event.stopPropagation()}
                      >
                        <scarlet-icon
                          name='grip-vertical'
                          size='1em'
                          class={{
                            'scarlet-table__drag-handle': true,
                            'scarlet-table__drag-handle--disabled': !rowDragEnabled
                          }}
                          aria-hidden='true'
                          draggable={rowDragEnabled}
                          onDragStart={rowDragEnabled ? event => this.handleRowDragStart(event, rowIndex) : undefined}
                          onDragEnd={rowDragEnabled ? () => this.handleRowDragEnd() : undefined}
                        />
                      </td>
                    ) : null}
                    {this.selectable ? (
                      <td
                        class='scarlet-table__cell scarlet-table__cell--checkbox'
                        onClick={event => event.stopPropagation()}
                      >
                        <input
                          type='checkbox'
                          checked={this.isRowSelected(row)}
                          aria-label={`Selecionar linha ${rowIndex + 1}`}
                          onChange={() => this.toggleRow(row)}
                        />
                      </td>
                    ) : null}
                    {columns.map(column => (
                      <td
                        class={{
                          'scarlet-table__cell': true,
                          [`scarlet-table__cell--${column.align ?? 'left'}`]: true
                        }}
                      >
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
