<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onUnmounted} from 'vue'
import MessageContainer from '../components/MessageContainer.vue';
import EditProfileModal from '../components/EditProfileModal.vue';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

const showModal = ref(false);
const showDropdown = ref(false);
const showEditAccountModal = ref(false);


const searchQuery = ref('');
const allUsers = ref([]);

const fetchAllUsers = async () => {
  const token = userStore.getToken;
  if (!token) {
    alert('You are not logged in. Please log in again.');
    router.push({ name: 'login' });
    return;
  }

  const url = 'https://hap-app-api.azurewebsites.net/users';

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      allUsers.value = data;
      console.log('All Users:', data);
    } else if (response.status === 401) {
      alert('Unauthorized: Please log in again.');
      router.push({ name: 'login' });
    } else {
      console.error('Failed to fetch users:', response.status);
      console.error('Response:', await response.text());
    }
  } catch (error) {
    console.error('An error occurred while fetching users:', error);
  }
};

const filteredUsers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return allUsers.value;

  return allUsers.value.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const userName = user.userName.toLowerCase();
    return fullName.includes(query) || userName.includes(query);
  });
});

onMounted(() => {
  fetchAllUsers();
});

const currentUser = computed(() => ({
  userName: localStorage.getItem('userName'),
  firstName: localStorage.getItem('firstName'),
  lastName: localStorage.getItem('lastName'),
  email: localStorage.getItem('email'),
}));

function editAccountModal() {
  showEditAccountModal.value = true;
}

function closeEditModal() {
  showEditAccountModal.value = false;
}

async function handleSaveChanges(updatedUser) {
  const token = userStore.getToken;
  const url = 'https://hap-app-api.azurewebsites.net/user';

  const data = {
    userName: updatedUser.userName,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    email: updatedUser.email,
  };

  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  };

  const response = await fetch(url, options);

  if (response.ok) {
    const result = await response.json();
    console.log('Profile updated successfully:', result);
    userStore.setProfile(updatedUser);
    closeEditModal();
  } else {
    console.error('Failed to update profile:', response.status);
    alert('Failed to update profile. Please try again.');
  }
}

const text = ref('');

async function sendMessage() {
  if (text.value.length > 280) {
    alert('Message must be less than 280 characters.');
    return;
  }

  const url = 'https://hap-app-api.azurewebsites.net/message';
  const token = userStore.getToken;
  console.log('before sending token', token);

  const data = { text: text.value };

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  };

  let response = await fetch(url, options);

  if (response.status === 201) {
    const data = await response.json();
    if (data.token) {
      userStore.setToken(data.token);
    }
    console.log(data);
    console.log("Successfully sent message");
    text.value = '';
  } else if (response.status === 401) {
    console.log("HTTP-Error: " + response.status);
    alert("Your session has expired. Please log in again.");
    router.push({ name: 'login' });
  } else {
    console.log("HTTP-Error: " + response.status);
    alert("Message failed to send");
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function openDeleteConfirmation() {
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

async function deleteAccount() {
  const token = userStore.getToken

  const url = 'https://hap-app-api.azurewebsites.net/user'

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  let response = await fetch(url, options)

  if (response.ok) {
    if (response.status === 200) {
      userStore.clearUserData()

      console.log("Successfully deleted account")

      router.push({
        name: 'home'
      })
    }
  } else if (response.status === 401) {
    console.log("HTTP-Error: " + response.status)
  } else if (response.status === 500) {
    console.log("HTTP-Error: " + response.status)
  }
  closeModal()
}

async function signOut() {
  const token = userStore.getToken

  const url = 'https://hap-app-api.azurewebsites.net/user/logout';

  const options = {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`
    },
  };

  let response = await fetch(url, options);

  if (response.ok) {
    if (response.status === 200) {
      userStore.clearUserData();

      console.log("Successfully signed out");

      router.push({
        name: 'home'
      });
    }
  } else if (response.status === 401) {
    console.log("HTTP-Error: " + response.status);
    alert("Your session has expired. Please log in again.");
    router.push({ name: 'login' });
  } else {
    console.log("HTTP-Error: " + response.status);
  }

function closeDropdown(event) {
  if (!event.target.closest('.nav-item')) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
});
}

</script>

<template>
	<Header>
		<nav>
			<a @click="signOut">Sign Out</a>
      <ul class="navbar">
            <div class="nav-item">
                <a href="#" class="nav-link" @click.prevent="toggleDropdown">@</a>
                <ul v-if="showDropdown" class="dropdown">
                    <li><a @click="openDeleteConfirmation">Delete Account</a></li>
                    <li><a @click="router.push('/profile')">Profile</a></li>
                    <li><a @click="editAccountModal">Edit Account</a></li>
                </ul>
            </div>
        </ul>
    </nav>
	</Header>

  <EditProfileModal
    v-if="showEditAccountModal"
    :user="currentUser"
    @close="closeEditModal"
    @save="handleSaveChanges"
  />

  <div v-if="showModal" class="modal" @click.self="closeModal">
    <div class="modal-content">
      <h3>Are you sure you want to delete your account?</h3>
      <button @click="deleteAccount">Delete my account</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>



  <div class="main-view">
    <div class="columns">
      <div class="column left-column">
        <div class="search-bar">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name or username"
            class="search-input"
          />
        </div>

        <div class="user-list">
          <RouterLink
            v-for="user in filteredUsers"
            :key="user._id"
            :to="`/user/${user._id}?name=${user.userName}`"
            class="user-link"
          >
            {{ user.firstName }} {{ user.lastName }} (@{{ user.userName }})
          </RouterLink>
        </div>
      </div>

      <div class="column middle-column">
        <h1>N.E.M.O</h1>
        <input type="text" v-model="text" class="input-field" placeholder="Enter a message" />
        <button @click="sendMessage" class="send-button">Send</button>
        <MessageContainer />
      </div>

      <div class="column right-column">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(a) {
	    text-decoration: none;
  }
</style>
