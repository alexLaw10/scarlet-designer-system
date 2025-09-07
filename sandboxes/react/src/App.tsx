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
      chamada dos futuros Components
      </main>
    </div>
  );
}

export default App;
