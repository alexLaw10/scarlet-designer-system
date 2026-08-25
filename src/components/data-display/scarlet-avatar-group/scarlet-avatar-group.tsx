import { Component, Prop, State, Watch, h, Host, Element } from '@stencil/core';
import type { Size } from '@/types';

/**
 * Overlaps a set of `<scarlet-avatar>` children into a stack, with an
 * optional "+N" indicator when there are more than `max`. Propagates `size`
 * down to every avatar so they all render at the same size regardless of
 * what each one was given individually.
 *
 * @slot - Default slot for `<scarlet-avatar>` children.
 */
@Component({
  tag: 'scarlet-avatar-group',
  styleUrl: 'scarlet-avatar-group.scss',
  shadow: true,
})
export class ScarletAvatarGroup {
  private slotEl?: HTMLSlotElement;

  @Element() el!: HTMLElement;

  /** Caps how many avatars are shown before the rest collapse into a "+N" indicator. Unset shows every avatar. */
  @Prop() readonly max?: number;

  /** Size applied to every avatar in the group. */
  @Prop() readonly size: Size = 'md';

  @State() private avatarCount = 0;

  @Watch('max')
  handleMaxChange(): void {
    this.syncChildren();
  }

  @Watch('size')
  handleSizeChange(): void {
    this.syncChildren();
  }

  componentDidLoad(): void {
    this.syncChildren();
  }

  private getAvatars(): HTMLElement[] {
    return Array.from(this.el.querySelectorAll('scarlet-avatar'));
  }

  private syncChildren = (): void => {
    const avatars = this.getAvatars();
    this.avatarCount = avatars.length;
    avatars.forEach((avatar, index) => {
      (avatar as unknown as { size: Size }).size = this.size;
      if (this.max !== undefined && index >= this.max) {
        avatar.setAttribute('hidden', '');
      } else {
        avatar.removeAttribute('hidden');
      }
    });
  };

  // Attached via ref instead of a JSX `onSlotchange` prop, since that event
  // name isn't part of every JSX typings surface for <slot>. Guarded so the
  // listener is only ever attached once, even though `ref` fires on re-renders.
  private handleSlotRef = (el?: HTMLSlotElement): void => {
    if (el && el !== this.slotEl) {
      el.addEventListener('slotchange', this.syncChildren);
    }
    this.slotEl = el;
  };

  render() {
    const overflow = this.max !== undefined && this.avatarCount > this.max ? this.avatarCount - this.max : 0;

    return (
      <Host class={{ 'scarlet-avatar-group-host': true, [`scarlet-avatar-group-host--${this.size}`]: true }}>
        <slot ref={this.handleSlotRef} />
        {overflow > 0 ? <span class="scarlet-avatar-group__overflow">+{overflow}</span> : null}
      </Host>
    );
  }
}
