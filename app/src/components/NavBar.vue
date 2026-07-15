<template>
  <nav class="navbar">
    <router-link to="/">Tasks</router-link>
    <router-link to="/history">History</router-link>
  </nav>

</template>

<style scoped>
.navbar {
  width: 100%;
  max-width: 700px;
  margin: 20px auto;

  display: flex;
  gap: 10px;
  padding: 8px;

  background: var(--color-primary-dark);
  border-radius: 12px;
}

a {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px;

  border-radius: 10px;

  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;

  transition: all .2s ease;
}

a:not(.router-link-active):hover {
  background: rgba(255,255,255,.05);
  color: var(--color-light);
}

.router-link-active {
  background: rgba(255,255,255,.12);
  color: var(--color-light);
  box-shadow:0 0 12px rgba(255,255,255,.04);
}
</style>