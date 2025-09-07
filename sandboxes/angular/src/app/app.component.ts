import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'scarlet-angular-sandbox';
  inputValue = '';

  onButtonClick(event: Event) {
    console.log('Button clicked:', event);
  }

  onInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.inputValue = target.value;
  }
}
