import React, { useState } from 'react';
import './App.css';

// Declare custom elements for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scarlet-button': any;
      'scarlet-input': any;
      'scarlet-card': any;
      'scarlet-alert': any;
    }
  }
}

function App() {
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = (event: React.MouseEvent) => {
    console.log('Button clicked:', event);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Scarlet Design System - React Sandbox</h1>
        <p>Testing Web Components with React</p>
      </header>

      <main className="main">
        <section className="section">
          <h2>Buttons</h2>
          <div className="button-group">
            <scarlet-button 
              variant="primary" 
              onClick={handleButtonClick}
            >
              Primary Button
            </scarlet-button>
            <scarlet-button 
              variant="secondary" 
              onClick={handleButtonClick}
            >
              Secondary Button
            </scarlet-button>
            <scarlet-button 
              variant="outline" 
              onClick={handleButtonClick}
            >
              Outline Button
            </scarlet-button>
            <scarlet-button 
              variant="ghost" 
              onClick={handleButtonClick}
            >
              Ghost Button
            </scarlet-button>
            <scarlet-button 
              variant="link" 
              onClick={handleButtonClick}
            >
              Link Button
            </scarlet-button>
          </div>
        </section>

        <section className="section">
          <h2>Inputs</h2>
          <div className="input-group">
            <scarlet-input 
              label="Name" 
              placeholder="Enter your name"
              value={inputValue}
              onChange={handleInputChange}
            />
            <scarlet-input 
              type="email" 
              label="Email" 
              placeholder="Enter your email"
            />
            <scarlet-input 
              type="password" 
              label="Password" 
              placeholder="Enter your password"
            />
          </div>
        </section>

        <section className="section">
          <h2>Cards</h2>
          <div className="card-group">
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

        <section className="section">
          <h2>Alerts</h2>
          <div className="alert-group">
            <scarlet-alert variant="info">
              This is an info alert
            </scarlet-alert>
            <scarlet-alert variant="success">
              This is a success alert
            </scarlet-alert>
            <scarlet-alert variant="warning">
              This is a warning alert
            </scarlet-alert>
            <scarlet-alert variant="error">
              This is an error alert
            </scarlet-alert>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
