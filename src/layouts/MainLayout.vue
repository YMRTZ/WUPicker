<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="z-max">
      <!--  class="z-top" -->
      <q-toolbar>
        <q-tabs>
          <q-route-tab name="home" label="Home" to="/" />
          <q-route-tab name="select" label="Select" to="/select" />
          <q-route-tab name="upload" label="Upload" to="/upload" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainLayout',

  components: {},

  setup() {
    return {};
  },
});
</script>
