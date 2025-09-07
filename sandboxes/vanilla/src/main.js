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
        <section class="section">
          <h2>Buttons</h2>
          <div class="button-group">
            <scarlet-button variant="primary" id="primary-btn">
              Primary Button
            </scarlet-button>
            <scarlet-button variant="secondary" id="secondary-btn">
              Secondary Button
            </scarlet-button>
            <scarlet-button variant="outline" id="outline-btn">
              Outline Button
            </scarlet-button>
            <scarlet-button variant="ghost" id="ghost-btn">
              Ghost Button
            </scarlet-button>
            <scarlet-button variant="link" id="link-btn">
              Link Button
            </scarlet-button>
          </div>
        </section>

        <section class="section">
          <h2>Inputs</h2>
          <div class="input-group">
            <scarlet-input 
              id="name-input"
              label="Name" 
              placeholder="Enter your name"
            ></scarlet-input>
            <scarlet-input 
              id="email-input"
              type="email" 
              label="Email" 
              placeholder="Enter your email"
            ></scarlet-input>
            <scarlet-input 
              id="password-input"
              type="password" 
              label="Password" 
              placeholder="Enter your password"
            ></scarlet-input>
          </div>
        </section>

        <section class="section">
          <h2>Cards</h2>
          <div class="card-group">
            <scarlet-card variant="default">
              <h3>Default Card</h3>
              <p>This is a default card component.</p>
            </scarlet-card>
            <scarlet-card variant="elevated">
              <h3>Elevated Card</h3>
              <p>This is an elevated card component.</p>
            </scarlet-card>
            <scarlet-card variant="outlined">
              <h3>Outlined Card</h3>
              <p>This is an outlined card component.</p>
            </scarlet-card>
          </div>
        </section>

        <section class="section">
          <h2>Alerts</h2>
          <div class="alert-group">
            <scarlet-alert variant="info" id="info-alert">
              This is an info alert
            </scarlet-alert>
            <scarlet-alert variant="success" id="success-alert">
              This is a success alert
            </scarlet-alert>
            <scarlet-alert variant="warning" id="warning-alert">
              This is a warning alert
            </scarlet-alert>
            <scarlet-alert variant="error" id="error-alert">
              This is an error alert
            </scarlet-alert>
          </div>
        </section>

        <section class="section">
          <h2>Interactive Demo</h2>
          <div class="demo-group">
            <p>Input value: <span id="input-value">-</span></p>
            <p>Button clicks: <span id="click-count">0</span></p>
            <p>Last clicked: <span id="last-clicked">-</span></p>
          </div>
        </section>
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
