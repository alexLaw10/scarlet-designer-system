import { Component, Prop, State, Watch, h, Host } from '@stencil/core';
import type { Size } from '../../types';

export type ScarletAvatarShape = 'circle' | 'square';

/**
 * A user/entity avatar: shows an image, falling back to initials derived
 * from `name`, falling back to a generic icon.
 */
@Component({
  tag: 'scarlet-avatar',
  styleUrl: 'scarlet-avatar.scss',
  shadow: true,
})
export class ScarletAvatar {
  @State() private imageFailed = false;

  /** Image URL. */
  @Prop() readonly src?: string;

  /** Accessible alt text for the image. Defaults to `name` when omitted. */
  @Prop() readonly alt?: string;

  /** Full name used to derive initials and the default alt text. */
  @Prop() readonly name?: string;

  /** Size of the avatar. */
  @Prop() readonly size: Size = 'md';

  /** Shape of the avatar. */
  @Prop() readonly shape: ScarletAvatarShape = 'circle';

  @Watch('src')
  handleSrcChange(): void {
    this.imageFailed = false;
  }

  private handleImageError = (): void => {
    this.imageFailed = true;
  };

  private getInitials(): string {
    if (!this.name) return '';
    const parts = this.name.trim().split(/\s+/).filter(Boolean);
    const initials = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : [parts[0]];
    return initials
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  render() {
    const showImage = Boolean(this.src) && !this.imageFailed;
    const initials = this.getInitials();

    return (
      <Host
        class={{
          'scarlet-avatar-host': true,
          [`scarlet-avatar-host--${this.size}`]: true,
          [`scarlet-avatar-host--${this.shape}`]: true,
        }}
        role="img"
        aria-label={this.alt ?? this.name ?? 'Avatar'}
      >
        {showImage ? (
          <img class="scarlet-avatar__image" src={this.src} alt="" onError={this.handleImageError} />
        ) : initials ? (
          <span class="scarlet-avatar__initials" aria-hidden="true">
            {initials}
          </span>
        ) : (
          <svg class="scarlet-avatar__placeholder" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M4.5 20c1.5-4 5-6 7.5-6s6 2 7.5 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        )}
      </Host>
    );
  }
}
