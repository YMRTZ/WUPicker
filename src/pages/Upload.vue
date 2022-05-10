<template>
  <q-page class="items-center justify-evenly">
    <q-layout class="q-ml-lg">
      <h4>Upload Flag</h4>
      <h6>Flags should be in format &lt;Country Code&gt;.png</h6>
      <input class="fileInputButton" ref="fileRef" type="file" />
      <button @click="uploadImage()">Submit</button>
      <button @click="clearInput()">Clear</button>
    </q-layout>
  </q-page>
</template>

<script lang="ts">
import {
  doc,
  DocumentReference,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, uploadBytes } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent, ref } from 'vue';
import { firebaseConfig } from '../../firebase-config.js';

const app: FirebaseApp = initializeApp(firebaseConfig);

export default defineComponent({
  name: 'uploadComponent',
  data() {
    return {
      fileRef: ref(null),
      firestore_database: getFirestore(app),
      cloudstore_database: getStorage(),
    };
  },
  methods: {
    clearInput() {
      let inputRef = this.$refs.fileRef as HTMLInputElement;
      inputRef.value = '';
    },
    async uploadImage() {
      console.log('Upload start');
      let htmlRef: HTMLInputElement = this.$refs.fileRef as HTMLInputElement;
      let fileRef = htmlRef.files;

      let fileNameExtension: string;
      let fileName = 'default';
      let fileExtension: string;

      if (fileRef) {
        fileNameExtension = fileRef[0].name;
        fileName = fileNameExtension.slice(
          0,
          fileNameExtension.lastIndexOf('.')
        );
        fileExtension = fileRef[0].name.slice(
          fileNameExtension.lastIndexOf('.')
        );
        console.log(fileNameExtension);
        console.log(fileName);
        console.log(fileExtension);
      }

      const firebaseFileRef = doc(this.firestore_database, 'Tags', fileName);
      //Check if already added, add if not
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (!snapshot.exists()) {
          console.log('DNE');
          void this.addToFirebase(firebaseFileRef, 0).then(() => {
            console.log('Added');
          });
        }
      });
      //Update count
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (snapshot.exists()) {
          let count: number = snapshot.data().count as number;
          count++;
          void this.addToFirebase(firebaseFileRef, count).then(() => {
            console.log('Updated');
            let storageRef = fireRef(
              this.cloudstore_database,
              fileName + '/' + count.toString()
            );
            console.log(storageRef);
            if (fileRef) {
              void uploadBytes(storageRef, fileRef[0]).then(() => {
                alert('Upload success!');
                this.clearInput();
                console.log('Uploaded');
              });
            }
          });
        } else {
          console.log('Something has gone very wrong!');
        }
      });
    },
    async addToFirebase(
      firebaseFileRef: DocumentReference,
      updatedCount: number
    ) {
      await setDoc(firebaseFileRef, { count: updatedCount });
    },
  },
});
</script>
