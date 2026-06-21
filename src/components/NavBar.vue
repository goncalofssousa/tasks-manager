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
  padding: 10px;

  background: var(--color-primary-dark);
  border-radius: 12px;
}

a {
  flex: 1;
  text-align: center;
  padding: 8px;
  border-radius: 10px;
  color: white;
  text-decoration: none;
}

.router-link-active {
  background: var(--color-accent);
}
</style>