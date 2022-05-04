<template>
  <q-page class="items-center justify-evenly">
    <p>Upload Page</p>
    <input ref="fileRef" type="file" />
    <button @click="uploadImage()">Submit</button>
  </q-page>
</template>

<script lang="ts">
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage, uploadBytes } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent, Ref, ref } from 'vue';
import { firebaseConfig } from '../../firebase-config.js';
const app: FirebaseApp = initializeApp(firebaseConfig);

export default defineComponent({
  name: 'uploadComponent',
  setup() {
    const fileRef: Ref = ref(null);
  },
  data() {
    return {
      firestore_database: getFirestore(),
      cloudstore_database: getStorage(),
    };
  },
  methods: {
    uploadImage() {
      console.log('Upload start');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let htmlRef: HTMLInputElement = this.$refs.fileRef as HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let fileRef = htmlRef.files;
      let testRef = fireRef(this.cloudstore_database, 'test.png');
      console.log(this.cloudstore_database);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (fileRef) {
        console.log(fileRef[0]);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void uploadBytes(testRef, fileRef[0]).then((snapshot) => {
          console.log('Uploaded');
        });
      }
    },
  },
});
</script>

function storageRef(storageRef: any, file: any) { throw new Error('Function not
implemented.'); }
