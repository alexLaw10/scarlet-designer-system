import { Component, Prop, h, Host } from '@stencil/core';

export type ScarletTimelineStatus = 'default' | 'success' | 'warning' | 'error' | 'current';

export interface ScarletTimelineItem {
  title: string;
  description?: string;
  /** Any pre-formatted date/time text, e.g. "Hoje, 14:32". */
  timestamp?: string;
  /** Colors the marker — `current` highlights the in-progress step. */
  status?: ScarletTimelineStatus;
}

/**
 * A vertical sequence of events — an order's status history, an activity
 * feed, a step-by-step audit trail.
 */
@Component({
  tag: 'scarlet-timeline',
  styleUrl: 'scarlet-timeline.scss',
  shadow: true,
})
export class ScarletTimeline {
  /** The events, in order from first to last. */
  @Prop() readonly items: ScarletTimelineItem[] = [];

  render() {
    return (
      <Host class="scarlet-timeline-host">
        <ol class="scarlet-timeline__list">
          {this.items.map((item, index) => (
            <li class="scarlet-timeline__item">
              <span class={{ 'scarlet-timeline__marker': true, [`scarlet-timeline__marker--${item.status ?? 'default'}`]: true }} aria-hidden="true" />
              {index < this.items.length - 1 ? <span class="scarlet-timeline__line" aria-hidden="true" /> : null}
              <div class="scarlet-timeline__content">
                <div class="scarlet-timeline__heading">
                  <p class="scarlet-timeline__title">{item.title}</p>
                  {item.timestamp ? <time class="scarlet-timeline__timestamp">{item.timestamp}</time> : null}
                </div>
                {item.description ? <p class="scarlet-timeline__description">{item.description}</p> : null}
              </div>
            </li>
          ))}
        </ol>
      </Host>
    );
  }
}
