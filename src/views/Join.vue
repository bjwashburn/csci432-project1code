<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const firstName = ref('')
const lastName = ref('')
const userName = ref('')

async function createAccount (event) {
  event.preventDefault();

  console.log(email.value);
  console.log(password.value);
  console.log(confirmPassword.value);
  console.log(firstName.value);
  console.log(lastName.value);
  console.log(userName.value);

  if(firstName.value == '' || lastName.value == '' || userName.value == '' || email.value == '' || password.value == '') {
    alert('Please fill out all fields.');
    return;
  }

  if(password.value.length < 8) {
    alert('Password must be at least 8 characters.');
    return;
  }

  if(!email.value.includes('@')) {
    alert('Please enter a valid email.');
    return;
  }

  if(confirmPassword.value && password.value !== confirmPassword.value) {
    alert('Passwords do not match.');
    return;
  }

  const data = {email: email.value, userName: userName.value, password: password.value, firstName: firstName.value, lastName: lastName.value};

  const url = 'https://hap-app-api.azurewebsites.net/user'

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	let response = await fetch(url, options)

	if (response.status === 201) {
		const data = await response.json()

		localStorage.setItem("token", data.token)
		console.log(data)

    localStorage.setItem("username", userName.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("firstName", firstName.value);
    localStorage.setItem("lastName", lastName.value);


    console.log("Successfully signed up")

		router.push({
			name: 'main'
		})
	}
	else if (response.status === 400) {
    alert("Invalid email or password")
		console.log("Invalid email or password")
	}
}

</script>

<template>
	<Header>
		<nav>
			<RouterLink to="/">Home</RouterLink>
		</nav>
	</Header>

	<main class="padding-block-700">
		<section class="container center">
            <form id="joinForm">
              <label for="firstName">First Name</label>
              <input type="text" v-model="firstName" value="" placeholder="Example" required/>
              <label for="lastName">Last Name</label>
              <input id="lastName" type="text" v-model="lastName" value="" placeholder="Example" required/>
              <label for="username">Username</label>
              <input id="username" type="text" v-model="userName" value="" placeholder="Example" required/>
              <label for="email">Email</label>
              <input id="email" type="email" v-model="email" value="" placeholder="example@example.com" required/>
              <label for="password">Password</label>
              <input id="password" type="password" v-model="password" value="" minlength="8" placeholder="Minimum 8 characters" required/>
              <label for="confirmPassword">Confirm Password</label>
              <input id="confirmPassword" type="password" v-model="confirmPassword" value="" minlength="8" placeholder="Must match password" required/>
              <button class="button" type="submit" @click="createAccount">Create Account</button>
            </form>
    </section>
	</main>
</template>

<style scoped>
:deep(a) {
	text-decoration: none;
}

form {
  max-width: 500px;
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

input[type="text"],
input[type="email"],
input[type="password"] {
  width: 100%;
  height: 40px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

main {
  background-image: linear-gradient(to bottom, #FF8303, #B6F5FF);
  background-size: 100% 100vh;
  background-attachment: fixed;
}
</style>
