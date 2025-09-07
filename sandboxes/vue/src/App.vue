<template>
  <div id="app">
    <header class="header">
      <h1>Scarlet Design System - Vue Sandbox</h1>
      <p>Testing Web Components with Vue.js</p>
    </header>

    <main class="main">
      chamada dos futuros Components
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
