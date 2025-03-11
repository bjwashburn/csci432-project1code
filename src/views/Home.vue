<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { RouterLink } from 'vue-router';
import Header from '../components/Header.vue'
</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/signin">Sign In</RouterLink>
            <RouterLink to="/join">Join</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center vertical">
            <h1 class="fs-primary-heading">Home</h1>
            <p>Welcome to the fish bowl!</p>
        </section>
    </main>
</template>

<style scoped>

:deep(a) {
  text-decoration: none;
}
nav {
  display: flex;
  gap: 1rem;
}

h1 {
  text-align: center;
  font-size: 200px;
}

p {
  text-align: center;
  font-size: 75px;
}

main {
  background-image: linear-gradient(to bottom, #FF8303, #B6F5FF);
  background-size: 100% 100vh;
  background-attachment: fixed;
}
</style>

