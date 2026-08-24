import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // Required so Angular's template compiler accepts <scarlet-*> tags as
  // native custom elements (Stencil web components) instead of raising
  // "is not a known element" errors.
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scarlet-angular-sandbox';
  inputValue = '';
  lastClicked = '-';
  clickCount = 0;
  alertVisible = true;

  onButtonClick(name: string): void {
    this.lastClicked = name;
    this.clickCount += 1;
  }

  onInputChange(event: Event): void {
    const customEvent = event as CustomEvent<string>;
    this.inputValue = customEvent.detail;
  }

  onAlertDismiss(): void {
    this.alertVisible = false;
  }
}
