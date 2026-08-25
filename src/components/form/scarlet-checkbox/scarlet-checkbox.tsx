import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import { generateId } from '@/utils';

/**
 * A checkbox input with label, indeterminate state and accessible wiring.
 */
@Component({
  tag: 'scarlet-checkbox',
  styleUrl: 'scarlet-checkbox.scss',
  shadow: true,
})
export class ScarletCheckbox {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-checkbox');

  /** Whether the checkbox is checked. */
  @Prop({ mutable: true }) checked = false;

  /** Shows a visual "partially checked" state, independent of `checked`. */
  @Prop() readonly indeterminate = false;

  /** Disables the checkbox. */
  @Prop() readonly disabled = false;

  /** Marks the checkbox as required in a parent form. */
  @Prop() readonly required = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Value submitted with a parent form when checked. */
  @Prop() readonly value?: string;

  /** Visible label rendered next to the checkbox. */
  @Prop() readonly label?: string;

  /** Emitted when the checked state changes via user interaction. */
  @Event() scarletChange!: EventEmitter<boolean>;

  componentDidRender(): void {
    if (this.inputEl) {
      this.inputEl.indeterminate = this.indeterminate;
    }
  }

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.scarletChange.emit(this.checked);
  };

  render() {
    return (
      <Host class="scarlet-checkbox-host">
        <label class={{ 'scarlet-checkbox': true, 'scarlet-checkbox--disabled': this.disabled }} htmlFor={this.inputId}>
          <input
            ref={(el) => (this.inputEl = el)}
            id={this.inputId}
            class="scarlet-checkbox__input"
            type="checkbox"
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            name={this.name}
            value={this.value}
            onChange={this.handleChange}
          />
          <span class="scarlet-checkbox__box" aria-hidden="true">
            <svg class="scarlet-checkbox__check" viewBox="0 0 16 16">
              <polyline
                points="3.5,8.5 6.5,11.5 12.5,4.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span class="scarlet-checkbox__dash" />
          </span>
          {this.label ? <span class="scarlet-checkbox__label">{this.label}</span> : null}
        </label>
      </Host>
    );
  }
}
