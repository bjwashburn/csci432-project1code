<template>
  <div class="modal">
    <div class="modal-content">
      <h2>Edit Profile</h2>
      <form @submit.prevent="saveChanges">
        <label>
          First Name:
          <input v-model="localUser.firstName" type="text">
        </label>
        <label>
          Last Name:
          <input v-model="localUser.lastName" type="text">
        </label>
        <label>
          Email:
          <input v-model="localUser.email" type="email">
        </label>
        <label>
          Username:
          <input v-model="localUser.userName" type="text">
        </label>
        <button type="button" @click="closeModal">Close</button>
        <button type="button" @click="cancelChanges">Cancel</button>
        <button type="submit">Save</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'save']);

const localUser = ref({ ...props.user });

watch(() => props.user, (newUser) => {
  localUser.value = { ...newUser };
}, { immediate: true });

const closeModal = () => {
  emit('close');
};

const cancelChanges = () => {
  localUser.value = { ...props.user };
  closeModal();
};

const saveChanges = () => {
  emit('save', localUser.value);
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  color: white;
}

.modal-content {
  background-color: #FFAF42;
  padding: 20px;
  border-radius: 5px;
}

h2 {
  margin-bottom: 10px;
  color: white;
  font-size: larger;
}
</style>
