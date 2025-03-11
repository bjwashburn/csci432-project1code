<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
        import Logo from './Logo.vue'
</script>

<template>
    <header>
        <div class="container">
            <Logo />
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:slotted(*) {
    font-size: var(--fs-600);
}

header {
  background-color: #F17720;
}

</style>
