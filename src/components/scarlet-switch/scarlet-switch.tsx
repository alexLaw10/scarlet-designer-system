import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import { generateId } from '../../utils';

/**
 * A toggle switch for binary on/off settings.
 */
@Component({
  tag: 'scarlet-switch',
  styleUrl: 'scarlet-switch.scss',
  shadow: true,
})
export class ScarletSwitch {
  private readonly inputId = generateId('scarlet-switch');

  /** Whether the switch is on. */
  @Prop({ mutable: true }) checked = false;

  /** Disables the switch. */
  @Prop() readonly disabled = false;

  /** Marks the switch as required in a parent form. */
  @Prop() readonly required = false;

  /** Name submitted with a parent form. */
  @Prop() readonly name?: string;

  /** Value submitted with a parent form when on. */
  @Prop() readonly value?: string;

  /** Visible label rendered next to the switch. */
  @Prop() readonly label?: string;

  /** Emitted when the on/off state changes via user interaction. */
  @Event() scarletChange!: EventEmitter<boolean>;

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.scarletChange.emit(this.checked);
  };

  render() {
    return (
      <Host class="scarlet-switch-host">
        <label class={{ 'scarlet-switch': true, 'scarlet-switch--disabled': this.disabled }} htmlFor={this.inputId}>
          <input
            id={this.inputId}
            class="scarlet-switch__input"
            type="checkbox"
            role="switch"
            checked={this.checked}
            disabled={this.disabled}
            required={this.required}
            name={this.name}
            value={this.value}
            onChange={this.handleChange}
          />
          <span class="scarlet-switch__track" aria-hidden="true">
            <span class="scarlet-switch__thumb" />
          </span>
          {this.label ? <span class="scarlet-switch__label">{this.label}</span> : null}
        </label>
      </Host>
    );
  }
}
