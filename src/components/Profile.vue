<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="profile-view">
    <h1>Profile</h1>
    <p>First Name: {{ firstName }}</p>
    <p>Last Name: {{ lastName }}</p>
    <p>Email: {{ email }}</p>
    <p>Password: I'm not showing you my password :)</p>
    <button class="back-button" @click="$router.push('/main')">Back</button>
  </div>
</template>

<script>
import { useUserStore } from '../stores/userStore';

export default {
  setup() {
    const userStore = useUserStore();

    const firstName = userStore.getProfile?.firstName || '';
    const lastName = userStore.getProfile?.lastName || '';
    const email = userStore.getProfile?.email || '';

    return {
      firstName,
      lastName,
      email,
    };
  },
};
</script>

<style>
.profile-view {
  padding: 20px;
  background-color: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.back-button {
  background-color: #FFAF42;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #FF8303;
}

h1 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
  font-size: 20px;
  font-weight: bold;
  text-decoration: underline;
}

p {
  margin-bottom: 10px;
  color: #666;
  font-size: 16px;
  text-align: center;
}
</style>
