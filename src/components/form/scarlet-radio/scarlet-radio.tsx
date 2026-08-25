import { Component, Prop, Event, type EventEmitter, h, Host } from '@stencil/core';
import { generateId } from '@/utils';

/**
 * A single radio option. Use inside a `<scarlet-radio-group>` for mutually
 * exclusive selection — standalone, it behaves like an isolated toggle.
 */
@Component({
  tag: 'scarlet-radio',
  styleUrl: 'scarlet-radio.scss',
  shadow: true
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

  /**
   * Whether this radio is a tab stop. A parent `<scarlet-radio-group>` keeps
   * this `true` on exactly one radio at a time (roving tabindex, per the
   * WAI-ARIA radiogroup pattern) so the group has a single Tab stop and
   * arrow keys move both focus and selection — matching how native radio
   * buttons behave. Standalone (no group), this defaults to `true` so a
   * lone radio is reachable by Tab like any other control.
   */
  @Prop({ mutable: true }) focusable = true;

  /**
   * Emitted when this radio becomes selected via user interaction.
   * Deliberately non-bubbling: a parent `<scarlet-radio-group>` re-emits
   * its own `scarletChange` (with a different, string `detail`) once it
   * has processed this one, so this event must never reach a listener
   * attached to the group too, or such a listener would see both fire
   * under the same name. Listen directly on the radio (which still works
   * for standalone usage — the "at target" phase runs regardless of
   * `bubbles`) or on the group, not both.
   */
  @Event({ bubbles: false }) scarletChange!: EventEmitter<boolean>;

  /**
   * @internal Emitted alongside `scarletChange`, under a name and with the
   * bubbling behavior a parent `<scarlet-radio-group>` needs to coordinate
   * selection. Not meant for direct use outside this component pair.
   */
  @Event() scarletRadioChange!: EventEmitter<boolean>;

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.scarletChange.emit(this.checked);
    this.scarletRadioChange.emit(this.checked);
  };

  render() {
    return (
      <Host class='scarlet-radio-host'>
        <label
          class={{ 'scarlet-radio': true, 'scarlet-radio--disabled': this.disabled }}
          htmlFor={this.inputId}
        >
          <input
            id={this.inputId}
            class='scarlet-radio__input'
            type='radio'
            checked={this.checked}
            disabled={this.disabled}
            name={this.name}
            value={this.value}
            tabIndex={this.focusable ? 0 : -1}
            onChange={this.handleChange}
          />
          <span class='scarlet-radio__dot' aria-hidden='true' />
          {this.label ? <span class='scarlet-radio__label'>{this.label}</span> : null}
        </label>
      </Host>
    );
  }
}
