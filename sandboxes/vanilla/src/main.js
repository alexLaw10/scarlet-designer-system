import '@scarlet/design-system/dist/scarlet/scarlet.css';
import { defineCustomElements } from '@scarlet/design-system/loader';
import './style.css';

// Define custom elements
defineCustomElements();

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app">
      <header class="header">
        <h1>Scarlet Design System - Vanilla JS Sandbox</h1>
        <p>Testing Web Components with Vanilla JavaScript</p>
      </header>

      <main class="main">
       chamada dos futuros Components
      </main>
    </div>
  `;

  // Add event listeners
  setupEventListeners();
});

function setupEventListeners() {
  let clickCount = 0;

  // Button click handlers
  const buttons = [
    { id: 'primary-btn', name: 'Primary' },
    { id: 'secondary-btn', name: 'Secondary' },
    { id: 'outline-btn', name: 'Outline' },
    { id: 'ghost-btn', name: 'Ghost' },
    { id: 'link-btn', name: 'Link' }
  ];

  buttons.forEach(button => {
    const element = document.getElementById(button.id);
    if (element) {
      element.addEventListener('click', (event) => {
        clickCount++;
        console.log(`${button.name} button clicked:`, event);
        
        // Update UI
        document.getElementById('click-count').textContent = clickCount;
        document.getElementById('last-clicked').textContent = button.name;
      });
    }
  });

  // Input change handlers
  const inputs = ['name-input', 'email-input', 'password-input'];
  
  inputs.forEach(inputId => {
    const element = document.getElementById(inputId);
    if (element) {
      element.addEventListener('input', (event) => {
        console.log(`${inputId} changed:`, event.target.value);
        
        // Update UI
        document.getElementById('input-value').textContent = event.target.value || '-';
      });
    }
  });

  // Alert close handlers
  const alerts = ['info-alert', 'success-alert', 'warning-alert', 'error-alert'];
  
  alerts.forEach(alertId => {
    const element = document.getElementById(alertId);
    if (element) {
      element.addEventListener('close', (event) => {
        console.log(`${alertId} closed:`, event);
      });
    }
  });
}
