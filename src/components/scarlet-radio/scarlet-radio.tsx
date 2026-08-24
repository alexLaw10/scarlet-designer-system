import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import { generateId } from '../../utils';

/**
 * A single radio option. Use inside a `<scarlet-radio-group>` for mutually
 * exclusive selection — standalone, it behaves like an isolated toggle.
 */
@Component({
  tag: 'scarlet-radio',
  styleUrl: 'scarlet-radio.scss',
  shadow: true,
})
export class ScarletRadio {
  private readonly inputId = generateId('scarlet-radio');

  /** Value identifying this option within its group. */
  @Prop() readonly value?: string;

  /** Whether this radio is selected. Managed by the parent `<scarlet-radio-group>` when present. */
  @Prop({ mutable: true }) checked = false;

  /** Disables this radio. Set by a parent `<scarlet-radio-group>` when the whole group is disabled. */
  @Prop({ mutable: true }) disabled = false;

  /** Name submitted with a parent form. Set by a parent `<scarlet-radio-group>` when present. */
  @Prop({ mutable: true }) name?: string;

  /** Visible label rendered next to the radio. */
  @Prop() readonly label?: string;

  /** Emitted when this radio becomes selected via user interaction. */
  @Event() scarletChange!: EventEmitter<boolean>;

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.scarletChange.emit(this.checked);
  };

  render() {
    return (
      <Host class="scarlet-radio-host">
        <label class={{ 'scarlet-radio': true, 'scarlet-radio--disabled': this.disabled }} htmlFor={this.inputId}>
          <input
            id={this.inputId}
            class="scarlet-radio__input"
            type="radio"
            checked={this.checked}
            disabled={this.disabled}
            name={this.name}
            value={this.value}
            onChange={this.handleChange}
          />
          <span class="scarlet-radio__dot" aria-hidden="true" />
          {this.label ? <span class="scarlet-radio__label">{this.label}</span> : null}
        </label>
      </Host>
    );
  }
}
