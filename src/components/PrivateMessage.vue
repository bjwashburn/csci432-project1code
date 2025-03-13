<template>
  <div class="private-messages">
    <h2>Private Messages with {{ userName }}</h2>

    <div v-if="messageCount !== null" class="message-count">
      Total Messages: {{ messageCount }}
    </div>

    <div class="messages-container">
      <div v-for="message in messages" :key="message._id" class="message">
        <p><strong>{{ message.senderName }}</strong>: {{ message.text }}</p>
        <small>{{ formatDate(message.updatedAt) }}</small>
      </div>
    </div>

    <form @submit.prevent="sendMessage" class="message-form">
      <input
        v-model="newMessage"
        type="text"
        placeholder="Type a message"
        class="message-input"
      />
      <button type="submit" class="send-button">Send</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const userId = route.params.userId;
const userName = route.query.name;

const messages = ref([]);
const newMessage = ref('');
const messageCount = ref(null);

const userStore = useUserStore();

async function fetchMessages() {
  const token = userStore.getToken;
  const url = `https://hap-app-api.azurewebsites.net/messages/${userId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      messages.value = data;
    } else if (response.status === 401) {
      alert('Unauthorized please try to log in again.');
    } else {
      console.error('Failed to fetch the messages:', response.status);
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  }
}

async function fetchMessageCount() {
  const token = userStore.getToken;
  const url = `https://hap-app-api.azurewebsites.net/messages/${userId}/count`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      messageCount.value = data.total;
    } else if (response.status === 401) {
      alert('Unauthorized please try to log in again.');
    } else {
      console.error('Cannot fetch message count:', response.status);
    }
  } catch (error) {
    console.error('Error fetching message count:', error);
  }
}

async function sendMessage() {
  if (!newMessage.value.trim()) {
    alert('Enter a message.');
    return;
  }

  const token = userStore.getToken;
  const url = `https://hap-app-api.azurewebsites.net/message/${userId}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newMessage.value }),
    });

    if (response.ok) {
      newMessage.value = '';
      fetchMessages();
      fetchMessageCount();
    } else if (response.status === 401) {
      alert('Unauthorized please log in again.');
    } else {
      console.error('Failed to send message:', response.status);
    }
  } catch (error) {
    console.error('Error sending the message:', error);
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

onMounted(() => {
  fetchMessages();
  fetchMessageCount();
});
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: var(--size-200);
  margin: var(--size-400) auto;
  max-width: 600px;
  padding: 0 var(--size-400);
}

.search-input {
  flex: 1;
  padding: var(--size-200);
  border: 1px solid var(--clr-accent-100);
  border-radius: var(--size-100);
  font-size: var(--fs-400);
}

.search-button {
  padding: var(--size-200) var(--size-400);
  background-color: var(--clr-accent-400);
  color: var(--clr-neutral-100);
  border: none;
  border-radius: var(--size-100);
  font-size: var(--fs-400);
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.search-button:hover {
  background-color: var(--clr-accent-300);
}

.user-list {
  margin: var(--size-400) auto;
  max-width: 600px;
  padding: 0 var(--size-400);
}

.user-link {
  display: block;
  padding: var(--size-200);
  margin-bottom: var(--size-100);
  background-color: var(--clr-neutral-100);
  border: 1px solid var(--clr-accent-100);
  border-radius: var(--size-100);
  color: var(--clr-neutral-900);
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;
}

.user-link:hover {
  background-color: var(--clr-accent-100);
}
</style>
