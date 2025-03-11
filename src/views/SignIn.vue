<script setup>
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const email = ref('')
const password = ref('')

async function signIn(event){
  event.preventDefault();

  console.log(email.value);
  console.log(password.value);

  if (email.value === '' || password.value === '') {
    alert('Please enter a email and password');
    return;
  }

  const data = {
    email: email.value,
    password: password.value
  }

  const url = 'https://hap-app-api.azurewebsites.net/user/login'

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	let response = await fetch(url, options)

	if (response.status === 200) {
		const data = await response.json()

		localStorage.setItem("token", data.token)
		console.log(data)
    console.log("Successfully signed in")


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
            <form>
              <label for="email">Email</label>
              <input id="email" type="email" value=""  v-model="email" required/>
              <label for="password">Password</label>
              <input id="password" type="password" value="" v-model="password" required/>
			        <button class="button" @click="signIn">Sign In</button>
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}

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
