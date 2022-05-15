<template>
  <q-page class="items-center justify-evenly">
    <q-layout class="q-ml-lg">
      <button @click="testFunc()">Test</button>
      <q-btn @click="signIn()">Sign In</q-btn>
      <q-btn @click="signOut()">Sign Out</q-btn>
    </q-layout>
  </q-page>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export default defineComponent({
  name: 'MainLayout',
  methods: {
    async signIn() {
      await signInWithPopup(auth, provider);
    },
    async signOut() {
      await signOut(getAuth());
      alert('Signed Out!');
    },
    testFunc() {
      console.log(getAuth().currentUser?.email);
      void getAuth()
        .currentUser?.getIdToken()
        .then((pog) => {
          console.log(pog);
        });
    },
  },
});
</script>
