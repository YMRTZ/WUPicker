<template>
  <q-page class="items-center justify-evenly">
    <p>Upload Page</p>
    <input ref="fileRef" type="file" />
    <button @click="uploadImage()">Submit</button>
  </q-page>
</template>

<script lang="ts">
import {
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, uploadBytes } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent, Ref, ref } from 'vue';
import { firebaseConfig } from '../../firebase-config.js';
const app: FirebaseApp = initializeApp(firebaseConfig);

export default defineComponent({
  name: 'uploadComponent',
  // setup() {
  //   const fileRef: Ref = ref(null);
  // },
  data() {
    return {
      fileRef: ref(null),
      firestore_database: getFirestore(app),
      cloudstore_database: getStorage(),
    };
  },
  methods: {
    async uploadImage() {
      console.log('Upload start');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let htmlRef: HTMLInputElement = this.$refs.fileRef as HTMLInputElement;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      let fileRef = htmlRef.files;
      let testRef = fireRef(this.cloudstore_database, 'test.png');

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

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      const firebaseFileRef = doc(this.firestore_database, 'Tags', fileName);
      //Check if already added, add if not
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (!snapshot.exists()) {
          console.log('DNE');
          const addFile = this.addToFirebase(firebaseFileRef, 0).then(() => {
            console.log('Added');
          });
        }
      });
      //Update count
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (snapshot.exists()) {
          let count: number = snapshot.data().count as number;
          count++;
          const addFile = this.addToFirebase(firebaseFileRef, count).then(
            () => {
              console.log('Updated');
              let storageRef = fireRef(
                this.cloudstore_database,
                fileName + '/' + count.toString()
              );
              console.log(storageRef);
              if (fileRef) {
                const uploadImage = uploadBytes(storageRef, fileRef[0]).then(
                  () => {
                    console.log('Uploaded');
                  }
                );
              }
            }
          );
        } else {
          console.log('Something has gone very wrong!');
        }
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      // if (fileRef) {
      //   console.log(fileRef[0]);
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      //   void uploadBytes(testRef, fileRef[0]).then((snapshot) => {
      //     console.log('Uploaded');
      //   });
      // }
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
