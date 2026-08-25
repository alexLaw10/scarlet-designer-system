// Scarlet Design System - Shared form-field rendering
//
// scarlet-input, scarlet-textarea and scarlet-select (and every masked
// input built on top of them) all render the exact same three things:
// a <label> with an optional required asterisk, an aria-describedby that
// points at whichever of helper/error text is showing, and that helper/
// error <p> itself. Pulled out once here instead of copy-pasted per
// component. These are plain functions (not a Stencil component) called
// from within each component's own render() — Stencil doesn't support
// sharing @Prop/render logic via class inheritance the way some other
// component frameworks do.
import { h } from '@stencil/core';

export interface FormFieldIds {
  helperId: string;
  errorId: string;
}

/** `aria-describedby` value for a field with optional helper/error text — error wins when both are set. */
export function computeDescribedBy(errorMessage: string | undefined, helperText: string | undefined, ids: FormFieldIds): string | undefined {
  return (
    [errorMessage ? ids.errorId : null, !errorMessage && helperText ? ids.helperId : null].filter(Boolean).join(' ') || undefined
  );
}

export interface FieldLabelProps {
  htmlFor: string;
  label?: string;
  required?: boolean;
  labelClass: string;
  requiredClass: string;
}

/** A `<label>`, with a visually-marked-but-`aria-hidden` `*` when the field is required. Renders nothing without a `label`. */
export function renderFieldLabel(props: FieldLabelProps) {
  if (!props.label) return null;
  return (
    <label class={props.labelClass} htmlFor={props.htmlFor}>
      {props.label}
      {props.required ? (
        <span class={props.requiredClass} aria-hidden="true">
          {' '}
          *
        </span>
      ) : null}
    </label>
  );
}

export interface FieldMessageProps {
  errorMessage?: string;
  helperText?: string;
  ids: FormFieldIds;
  errorClass: string;
  helperClass: string;
}

/** The helper/error `<p>` below a field — error text (announced via `role="alert"`) takes priority over helper text. */
export function renderFieldMessage(props: FieldMessageProps) {
  if (props.errorMessage) {
    return (
      <p class={props.errorClass} id={props.ids.errorId} role="alert">
        {props.errorMessage}
      </p>
    );
  }
  if (props.helperText) {
    return (
      <p class={props.helperClass} id={props.ids.helperId}>
        {props.helperText}
      </p>
    );
  }
  return null;
}
