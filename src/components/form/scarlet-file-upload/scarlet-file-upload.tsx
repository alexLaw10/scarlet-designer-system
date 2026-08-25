import { Component, Prop, State, Event, type EventEmitter, h, Host, Method } from '@stencil/core';
import { generateId } from '@/utils';

/**
 * A drag-and-drop file picker, backed by a real (visually hidden) native
 * `<input type="file">` — so it's a real form control and works with no JS
 * at all for the "click to browse" path; only the drag-and-drop layer is
 * enhancement on top.
 */
@Component({
  tag: 'scarlet-file-upload',
  styleUrl: 'scarlet-file-upload.scss',
  shadow: true,
})
export class ScarletFileUpload {
  private inputEl?: HTMLInputElement;
  private readonly inputId = generateId('scarlet-file-upload');
  private readonly helperId = generateId('scarlet-file-upload-helper');
  private readonly errorId = generateId('scarlet-file-upload-error');

  @State() private files: File[] = [];
  @State() private dragOver = false;
  /** Set when a dropped/selected file fails the `maxSizeBytes` check; cleared as soon as a valid selection is made. */
  @State() private autoError?: string;

  /** Native `accept` attribute, e.g. `"image/*"` or `".pdf,.docx"`. */
  @Prop() readonly accept?: string;

  /** Allows more than one file. */
  @Prop() readonly multiple = false;

  /** Disables the dropzone and the native input. */
  @Prop() readonly disabled = false;

  /** Visible label rendered above the dropzone. */
  @Prop() readonly label?: string;

  /** Helper text rendered below the dropzone. Hidden while an error is shown. */
  @Prop() readonly helperText?: string;

  /** Error message rendered below the dropzone. Takes priority over the automatic max-size error. */
  @Prop() readonly errorMessage?: string;

  /** Rejects any file over this size, showing a default error message instead of accepting it. */
  @Prop() readonly maxSizeBytes?: number;

  /** Emitted with the full current file list whenever it changes — a selection, a drop, or a removal. */
  @Event() scarletChange!: EventEmitter<File[]>;

  /** Clears every selected file. */
  @Method()
  async clear(): Promise<void> {
    this.files = [];
    this.autoError = undefined;
    if (this.inputEl) this.inputEl.value = '';
    this.scarletChange.emit(this.files);
  }

  private acceptFiles(incoming: File[]): void {
    if (this.maxSizeBytes !== undefined) {
      const tooLarge = incoming.find((file) => file.size > this.maxSizeBytes!);
      if (tooLarge) {
        this.autoError = `"${tooLarge.name}" excede o tamanho máximo permitido (${this.formatSize(this.maxSizeBytes)}).`;
        return;
      }
    }
    this.autoError = undefined;
    this.files = this.multiple ? [...this.files, ...incoming] : incoming.slice(0, 1);
    this.scarletChange.emit(this.files);
  }

  private handleInputChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    if (target.files?.length) {
      this.acceptFiles(Array.from(target.files));
    }
    // Reset so picking the exact same file again still fires a change.
    target.value = '';
  };

  private handleDrop = (event: DragEvent): void => {
    event.preventDefault();
    this.dragOver = false;
    if (this.disabled) return;
    const dropped = event.dataTransfer?.files;
    if (dropped?.length) {
      this.acceptFiles(Array.from(dropped));
    }
  };

  private handleDragOver = (event: DragEvent): void => {
    event.preventDefault();
    if (!this.disabled) this.dragOver = true;
  };

  private handleDragLeave = (): void => {
    this.dragOver = false;
  };

  private removeFile(file: File): void {
    this.files = this.files.filter((existing) => existing !== file);
    this.scarletChange.emit(this.files);
  }

  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  render() {
    const effectiveError = this.errorMessage ?? this.autoError;
    const describedBy = effectiveError ? this.errorId : this.helperText ? this.helperId : undefined;

    return (
      <Host class="scarlet-file-upload-host">
        {this.label ? (
          <label class="scarlet-file-upload__label" htmlFor={this.inputId}>
            {this.label}
          </label>
        ) : null}
        <div
          class={{
            'scarlet-file-upload__dropzone': true,
            'scarlet-file-upload__dropzone--dragover': this.dragOver,
            'scarlet-file-upload__dropzone--disabled': this.disabled,
            'scarlet-file-upload__dropzone--invalid': Boolean(effectiveError),
          }}
          onDrop={this.handleDrop}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
        >
          <input
            ref={(el) => (this.inputEl = el)}
            id={this.inputId}
            class="scarlet-file-upload__input"
            type="file"
            accept={this.accept}
            multiple={this.multiple}
            disabled={this.disabled}
            aria-invalid={effectiveError ? 'true' : undefined}
            aria-describedby={describedBy}
            onChange={this.handleInputChange}
          />
          <scarlet-icon name="upload" size="1.5em" class="scarlet-file-upload__icon" />
          <span class="scarlet-file-upload__hint">
            Arraste um arquivo aqui ou <span class="scarlet-file-upload__browse">clique para selecionar</span>
          </span>
        </div>
        {this.files.length > 0 ? (
          <ul class="scarlet-file-upload__list">
            {this.files.map((file) => (
              <li class="scarlet-file-upload__item">
                <scarlet-icon name="file" size="1em" class="scarlet-file-upload__file-icon" />
                <span class="scarlet-file-upload__name">{file.name}</span>
                <span class="scarlet-file-upload__size">{this.formatSize(file.size)}</span>
                <button
                  type="button"
                  class="scarlet-file-upload__remove"
                  aria-label={`Remover ${file.name}`}
                  onClick={() => this.removeFile(file)}
                >
                  <scarlet-icon name="x" size="0.85em" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {effectiveError ? (
          <p class="scarlet-file-upload__message scarlet-file-upload__message--error" id={this.errorId} role="alert">
            {effectiveError}
          </p>
        ) : this.helperText ? (
          <p class="scarlet-file-upload__message" id={this.helperId}>
            {this.helperText}
          </p>
        ) : null}
      </Host>
    );
  }
}
