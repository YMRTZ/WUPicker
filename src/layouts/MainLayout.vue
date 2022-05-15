<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="z-max">
      <q-toolbar>
        <q-tabs>
          <q-route-tab name="home" label="Home" to="/" />
          <q-route-tab name="select" label="Select" to="/select" />
          <q-route-tab
            v-if="signedIn"
            name="upload"
            label="Upload"
            to="/upload"
          />
        </q-tabs>
        <q-toolbar-title />
        WUPicker 0.1.0
        <q-btn @click="signIn()" class="q-ml-md" v-if="!signedIn"
          >Sign In</q-btn
        >
        <q-btn @click="signOut()" class="q-ml-md" v-if="signedIn"
          >Sign Out</q-btn
        >
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
//GCTO Refactor
// import { firebaseInit } from '@gcto/firebase-hooks';
// import { boot } from 'quasar/wrappers';
// import { firebaseConfig } from '../../firebase-config.js';
// const app = firebaseInit(firebaseConfig);
// export default boot(({ app }) => {
//   app.use(() => {
//     firebaseInit(firebaseConfig);
//   });
// });

//Original
import { defineComponent } from 'vue';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  // User,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../firebase-config.js';
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default defineComponent({
  name: 'MainLayout',
  data() {
    return {
      signedIn: false,
    };
  },
  methods: {
    initFirebaseAuth() {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      onAuthStateChanged(auth, this.authStateObserver);
    },
    authStateObserver(user: unknown) {
      //: User
      if (user) {
        this.signedIn = true;
      } else {
        this.signedIn = false;
      }
    },
    async signIn() {
      await signInWithPopup(auth, provider);
    },
    async signOut() {
      await signOut(getAuth());
      alert('Signed Out!');
    },
  },
  mounted() {
    this.initFirebaseAuth();
  },
});
</script>
