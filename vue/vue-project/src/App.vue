<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import MainForm from './components/MainForm.vue'
</script>

<template>
  <header>
    <div>
      <a href="#">12</a>
      <a href="http://">12</a>
    </div>
  </header>

  <main>
    <MainForm />
  </main>
</template>

<style scoped>
header {
  border-bottom: 1px #000 solid;
  text-align: center;
}
header a {
  display: inline-block;
  width: 60px;
  text-decoration: none;
  text-align: center;
}
</style>
