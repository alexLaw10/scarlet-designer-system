import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';

type ScarletPaginationItem = number | 'ellipsis';

/**
 * Page number navigation, following the WAI-ARIA pattern of a `<nav>`
 * landmark wrapping a list of buttons — the current page is a real button
 * (not a link, since this component doesn't own routing) marked
 * `aria-current="page"`. Collapses distant page numbers into an ellipsis
 * once `totalPages` is large, always keeping the first page, the last page,
 * and `siblingCount` pages on each side of the current one visible.
 */
@Component({
  tag: 'scarlet-pagination',
  styleUrl: 'scarlet-pagination.scss',
  shadow: true,
})
export class ScarletPagination {
  /** Total number of pages. */
  @Prop() readonly totalPages = 1;

  /** Current page (1-indexed). */
  @Prop({ mutable: true }) page = 1;

  /** How many page numbers to show on each side of the current page before collapsing into an ellipsis. */
  @Prop() readonly siblingCount = 1;

  /** Accessible label for the `<nav>` landmark. */
  @Prop() readonly ariaLabel = 'Paginação';

  /** Emitted when the page changes via any control (a page number, prev, or next). */
  @Event() scarletChange!: EventEmitter<number>;

  private goTo(page: number): void {
    const clamped = Math.min(Math.max(1, page), this.totalPages);
    if (clamped === this.page) return;
    this.page = clamped;
    this.scarletChange.emit(clamped);
  }

  private getItems(): ScarletPaginationItem[] {
    const total = this.totalPages;
    const current = this.page;
    const sibling = Math.max(0, this.siblingCount);
    // 1 (first) + 1 (last) + current + 2*siblings + 2 possible ellipses.
    const maxVisible = sibling * 2 + 5;

    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const leftSibling = Math.max(current - sibling, 1);
    const rightSibling = Math.min(current + sibling, total);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    const items: ScarletPaginationItem[] = [1];
    if (showLeftEllipsis) items.push('ellipsis');
    for (let p = leftSibling; p <= rightSibling; p++) {
      if (p !== 1 && p !== total) items.push(p);
    }
    if (showRightEllipsis) items.push('ellipsis');
    if (total > 1) items.push(total);
    return items;
  }

  render() {
    const items = this.getItems();

    return (
      <Host class="scarlet-pagination-host">
        <nav aria-label={this.ariaLabel}>
          <ul class="scarlet-pagination__list">
            <li>
              <button
                type="button"
                class="scarlet-pagination__nav"
                disabled={this.page === 1}
                aria-label="Página anterior"
                onClick={() => this.goTo(this.page - 1)}
              >
                <scarlet-icon name="chevron-left" size="1em" />
              </button>
            </li>
            {items.map((item) =>
              item === 'ellipsis' ? (
                <li class="scarlet-pagination__ellipsis" aria-hidden="true">
                  …
                </li>
              ) : (
                <li>
                  <button
                    type="button"
                    class={{ 'scarlet-pagination__page': true, 'scarlet-pagination__page--current': item === this.page }}
                    aria-current={item === this.page ? 'page' : undefined}
                    aria-label={`Página ${item}`}
                    onClick={() => this.goTo(item)}
                  >
                    {item}
                  </button>
                </li>
              ),
            )}
            <li>
              <button
                type="button"
                class="scarlet-pagination__nav"
                disabled={this.page === this.totalPages}
                aria-label="Próxima página"
                onClick={() => this.goTo(this.page + 1)}
              >
                <scarlet-icon name="chevron-right" size="1em" />
              </button>
            </li>
          </ul>
        </nav>
      </Host>
    );
  }
}
