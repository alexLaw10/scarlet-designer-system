<template>
  <div id="app">
    <header class="header">
      <h1>Scarlet Design System - Vue Sandbox</h1>
      <p>Testing Web Components with Vue.js</p>
    </header>

    <main class="main">
      <section class="section">
        <h2>Buttons</h2>
        <div class="button-group">
          <scarlet-button variant="primary">Primary Button</scarlet-button>
          <scarlet-button variant="secondary">Secondary Button</scarlet-button>
          <scarlet-button variant="outline">Outline Button</scarlet-button>
          <scarlet-button variant="ghost">Ghost Button</scarlet-button>
          <scarlet-button variant="link">Link Button</scarlet-button>
        </div>
      </section>

      <section class="section">
        <h2>Inputs</h2>
        <div class="input-group">
          <scarlet-input 
            label="Name" 
            placeholder="Enter your name"
            v-model="inputValue"
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
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      inputValue: ''
    };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.header h1 {
  margin: 0 0 10px 0;
  color: #0ea5e9;
}

.header p {
  margin: 0;
  color: #64748b;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.section {
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
}

.section h2 {
  margin: 0 0 20px 0;
  color: #1e293b;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.card-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.alert-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 600px;
}
</style>
