import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';

export interface ScarletBreadcrumbItem {
  label: string;
  /** Omit on the current page's own item — it renders as plain text instead of a link, regardless of position. */
  href?: string;
}

/**
 * A trail of links showing the current page's position in a hierarchy,
 * following the WAI-ARIA breadcrumb pattern (`<nav aria-label>` wrapping an
 * ordered list, the last item marked `aria-current="page"`).
 *
 * Items render as real `<a href>` elements — usable with no JS at all — but
 * every click first emits a cancelable `scarletNavigate`, so a framework
 * router can call `preventDefault()` and handle the navigation itself
 * instead of a full page load.
 */
@Component({
  tag: 'scarlet-breadcrumb',
  styleUrl: 'scarlet-breadcrumb.scss',
  shadow: true
})
export class ScarletBreadcrumb {
  /** The trail of items, in order from the root down to the current page. */
  @Prop() readonly items: ScarletBreadcrumbItem[] = [];

  /** Accessible label for the `<nav>` landmark. */
  @Prop() readonly ariaLabel = 'Navegação estrutural';

  /** Text rendered between items. Purely decorative (hidden from assistive tech) — the DOM order already conveys the hierarchy. */
  @Prop() readonly separator = '›';

  /**
   * Emitted when a link item is clicked, before the browser navigates.
   * Cancelable: call `event.preventDefault()` (on the emitted `CustomEvent`,
   * not the click) to stop the real navigation and handle it yourself, e.g.
   * with a client-side router.
   */
  @Event({ cancelable: true }) scarletNavigate!: EventEmitter<ScarletBreadcrumbItem>;

  private handleClick = (item: ScarletBreadcrumbItem, event: MouseEvent): void => {
    const navigateEvent = this.scarletNavigate.emit(item);
    if (navigateEvent.defaultPrevented) {
      event.preventDefault();
    }
  };

  render() {
    return (
      <Host class='scarlet-breadcrumb-host'>
        <nav aria-label={this.ariaLabel}>
          <ol class='scarlet-breadcrumb__list'>
            {this.items.map((item, index) => {
              const isLast = index === this.items.length - 1;
              return (
                <li class='scarlet-breadcrumb__item'>
                  {item.href && !isLast ? (
                    <a
                      class='scarlet-breadcrumb__link'
                      href={item.href}
                      onClick={event => this.handleClick(item, event)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      class='scarlet-breadcrumb__current'
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                  {!isLast ? (
                    <span class='scarlet-breadcrumb__separator' aria-hidden='true'>
                      {this.separator}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </Host>
    );
  }
}
