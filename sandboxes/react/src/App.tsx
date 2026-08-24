import React, { useEffect, useRef, useState } from 'react';
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
  const [lastClicked, setLastClicked] = useState('-');
  const [clickCount, setClickCount] = useState(0);
  const [alertVisible, setAlertVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  // React 18 does not auto-wire `onScarletClick`-style props to custom
  // element events (that lands in React 19). Until this sandbox upgrades,
  // listen with a plain DOM listener instead — Stencil events bubble and
  // are composed by default, so one delegated listener on a container works.
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const handleClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const name = target.getAttribute('data-name') ?? target.tagName.toLowerCase();
      setLastClicked(name);
      setClickCount((count) => count + 1);
    };

    const handleInput = (event: Event) => {
      setInputValue((event as CustomEvent<string>).detail);
    };

    const handleDismiss = () => setAlertVisible(false);

    container.addEventListener('scarletClick', handleClick);
    container.addEventListener('scarletInput', handleInput);
    container.addEventListener('scarletDismiss', handleDismiss);

    return () => {
      container.removeEventListener('scarletClick', handleClick);
      container.removeEventListener('scarletInput', handleInput);
      container.removeEventListener('scarletDismiss', handleDismiss);
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Scarlet Design System - React Sandbox</h1>
        <p>Testing Web Components with React</p>
      </header>

      <main className="main" ref={mainRef}>
        <section className="section">
          <h2>Button</h2>
          <div className="button-group">
            <scarlet-button data-name="Primary" variant="solid" color="primary">
              Primary
            </scarlet-button>
            <scarlet-button data-name="Secondary" variant="solid" color="secondary">
              Secondary
            </scarlet-button>
            <scarlet-button data-name="Outline" variant="outline">
              Outline
            </scarlet-button>
            <scarlet-button data-name="Ghost" variant="ghost">
              Ghost
            </scarlet-button>
            <scarlet-button data-name="Link" variant="link">
              Link
            </scarlet-button>
            <scarlet-button variant="solid" disabled>
              Disabled
            </scarlet-button>
          </div>
          <p>
            Último clicado: <strong>{lastClicked}</strong> — Total de cliques: <strong>{clickCount}</strong>
          </p>
        </section>

        <section className="section">
          <h2>Input</h2>
          <div className="input-group">
            <scarlet-input label="Nome" placeholder="Digite seu nome" value={inputValue} />
            <scarlet-input type="email" label="E-mail" placeholder="voce@exemplo.com" />
            <scarlet-input type="password" label="Senha" helper-text="Mínimo de 8 caracteres" />
            <scarlet-input label="Com erro" error-message="Este campo é obrigatório" invalid />
          </div>
          <p>
            Valor digitado: <strong>{inputValue || '-'}</strong>
          </p>
        </section>

        <section className="section">
          <h2>Card</h2>
          <div className="card-group">
            <scarlet-card variant="elevated">
              <span slot="header">Card elevado</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
            <scarlet-card variant="outlined">
              <span slot="header">Card com borda</span>
              <p>Conteúdo de exemplo dentro do card.</p>
            </scarlet-card>
            <scarlet-card data-name="Card interativo" interactive>
              <span slot="header">Card interativo</span>
              <p>Clique em qualquer lugar deste card.</p>
            </scarlet-card>
          </div>
        </section>

        <section className="section">
          <h2>Alert</h2>
          <div className="alert-group">
            <scarlet-alert status="info">Este é um alerta informativo.</scarlet-alert>
            <scarlet-alert status="success">Operação concluída com sucesso.</scarlet-alert>
            <scarlet-alert status="warning">Atenção: revise os dados informados.</scarlet-alert>
            {alertVisible && (
              <scarlet-alert status="error" dismissible>
                Ocorreu um erro ao processar sua solicitação.
              </scarlet-alert>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
