<template>
  <div id="app">
    <RouterView v-slot="{ Component, route }">
      <!-- ֻ������ҳ������������ҳ -->
      <keep-alive :include="['Home']">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </RouterView>
  </div>
</template>



<script setup lang="ts">
  import {RouterView} from 'vue-router'
</script>
  


<style>



</style>