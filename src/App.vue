<script setup lang="ts">
import { ref } from 'vue';
import TipTap from './components/TipTap.vue';

const textContent = ref(`
I'm running Tiptap with Vue.js. 🎉
<table>
  <tbody>
    <tr>
      <th>Name</th>
      <th colspan="3">Description</th>
    </tr>
    <tr>
      <td>Cyndi Lauper</td>
      <td>singer</td>
      <td>songwriter</td>
      <td>actress</td>
    </tr>
  </tbody>
</table>
`);
</script>

<template>
  <div id="app">
    <h1>TipTap Testing</h1>

    <TipTap v-model="textContent"/>
  </div>
</template>

<style scoped>
  #app {
    padding: 24px;
    max-width: 800px;
    text-align: center;
    margin: 0 auto;
  }

  h1 {
    margin-bottom: 50px;
  }
</style>
