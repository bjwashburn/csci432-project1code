<template>
  <div class="messages-container" @scroll="handleScroll">
    <div v-if="newMessagesCount > 0" class="new-messages-indicator" @click="fetchNewMessages">
      {{ newMessagesCount }} new messages
    </div>
    <div v-for="(message, index) in messages" :key="index">
      <Message :senderName="message.senderName" :updatedAt="message.updatedAt" :text="message.text" />
    </div>
    <div v-if="loading" class="loading-indicator">Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Message from './Message.vue';

const messages = ref([]);
const loading = ref(false);
const newMessagesCount = ref(0);
const lastMessageDate = ref(new Date().toISOString());

async function fetchMessages(before = new Date().toISOString()) {
  loading.value = true;
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const url = `https://hap-app-api.azurewebsites.net/messages?limit=10&before=${before}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}` // Include the Bearer token
    }
  });
  if (response.ok) {
    const data = await response.json();
    messages.value = [...messages.value, ...data];
    if (data.length > 0) {
      lastMessageDate.value = data[data.length - 1].updatedAt;
    }
  } else if (response.status === 401) {
    console.error('Unauthorized: Invalid or missing token');
    alert('You are not authorized. Please log in again.');
  } else {
    console.error('Failed to fetch messages:', response.status);
  }
  loading.value = false;
}

async function fetchNewMessages() {
  const token = localStorage.getItem('token'); // Get the token from localStorage
  const url = `https://hap-app-api.azurewebsites.net/messages/count?after=${lastMessageDate.value}`;
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}` // Include the Bearer token
    }
  });
  if (response.ok) {
    const count = await response.json();
    newMessagesCount.value = count;
  } else if (response.status === 401) {
    console.error('Unauthorized: Invalid or missing token');
    alert('You are not authorized. Please log in again.');
  } else {
    console.error('Failed to fetch new messages count:', response.status);
  }
}

function handleScroll(event) {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollHeight - scrollTop === clientHeight) {
    fetchMessages(lastMessageDate.value);
  }
}

onMounted(() => {
  fetchMessages();
});
</script>

<style scoped>
.messages-container {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
}

.new-messages-indicator {
  text-align: center;
  padding: 10px;
  background-color: #f0f0f0;
  cursor: pointer;
}

.loading-indicator {
  text-align: center;
  padding: 10px;
}
</style>
