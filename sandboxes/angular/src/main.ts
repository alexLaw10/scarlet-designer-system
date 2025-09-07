import { bootstrapApplication } from '@angular/platform-browser';
import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';
import { AppComponent } from './app/app.component';

// Define custom elements
defineCustomElements();

bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
