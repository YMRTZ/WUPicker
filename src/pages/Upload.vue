<template>
  <q-page class="items-center justify-evenly">
    <q-layout class="q-ml-lg">
      <h4>Upload Flag</h4>
      <h6>Flags should be in format &lt;Country Code&gt;.png</h6>
      <input
        class="fileInputButton"
        ref="fileRef"
        type="file"
        accept="image/*"
      />
      <button @click="uploadImage()">Submit</button>
      <button @click="clearInput()">Clear</button>
    </q-layout>
    <q-footer><button @click="resizeImageTest()">Pain Upload</button></q-footer>
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
import { getStorage, uploadBytes, updateMetadata } from 'firebase/storage';
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
    resizeImageTest() {
      void this.resizeImage().then((testImage) => {
        // console.log('start');
        // console.log(testImage);
      });
    },
    resizeImage() {
      let htmlRef: HTMLInputElement = this.$refs.fileRef as HTMLInputElement;
      let fileRef = htmlRef.files;
      var resizedImage;
      return new Promise((resolve) => {
        if (fileRef) {
          var file = fileRef[0];
          const fr = new FileReader();
          fr.onload = function () {
            var image = new Image();
            image.src = fr.result as string;
            image.onload = function () {
              var canvas = document.createElement('canvas');
              canvas.width = 140;
              canvas.height = 140;
              canvas.getContext('2d')?.drawImage(image, 0, 0, 140, 140);
              resizedImage = canvas.toDataURL('image');
              resolve(resizedImage);
            };
          };
          fr.readAsDataURL(file);
        }
      });
    },
    clearInput() {
      let inputRef = this.$refs.fileRef as HTMLInputElement;
      inputRef.value = '';
    },
    async uploadImage() {
      // console.log('Upload start');
      let htmlRef: HTMLInputElement = this.$refs.fileRef as HTMLInputElement;
      let fileRef = htmlRef.files;
      let fileNameExtension: string;
      let fileName = 'default';
      // let fileExtension: string;
      if (fileRef) {
        // fr.readAsArrayBuffer(fileRef[0]);
        // let pngBuffer = fr.result as ArrayBuffer;
        // if (pngBuffer) {
        //   pngPixelArray = new Uint8Array(pngBuffer);
        // }

        //Get filename, file extension, and full filename+extension
        fileNameExtension = fileRef[0].name;
        fileName = fileNameExtension.slice(
          0,
          fileNameExtension.lastIndexOf('.')
        );
        // fileExtension = fileRef[0].name.slice(
        //   fileNameExtension.lastIndexOf('.')
        // );
      }

      const firebaseFileRef = doc(this.firestore_database, 'Tags', fileName);
      //Check if already added, add if not
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (!snapshot.exists()) {
          // console.log('DNE');
          void this.addToFirebase(firebaseFileRef, 0).then(() => {
            // console.log('Added');
          });
        }
      });
      //Get Firestore data
      await getDoc(firebaseFileRef).then((snapshot) => {
        if (snapshot.exists()) {
          //Import count from Firestore data
          let count: number = snapshot.data().count as number;
          //Update count
          count++;
          void this.addToFirebase(firebaseFileRef, count).then(() => {
            // console.log('Updated');
            //Create storage reference for file
            let storageRef = fireRef(
              this.cloudstore_database,
              fileName + '/' + count.toString()
            );
            let storageRefResized = fireRef(
              this.cloudstore_database,
              fileName + '/' + 'tga' + '/' + count.toString() + '.tga'
            );
            //Upload files
            if (fileRef) {
              void uploadBytes(storageRef, fileRef[0]).then(() => {
                // console.log('Uploaded');
              });
              void this.resizeImage().then((resizedImage) => {
                let resizedType = resizedImage as string;
                // console.log(resizedType.replace('data:image/png;base64,', ''));
                let byteCharacters = atob(
                  resizedType.replace('data:image/png;base64,', '')
                );
                let byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                let byteArray = new Uint8Array(byteNumbers);
                void uploadBytes(storageRefResized, byteArray).then(() => {
                  var metaData = {
                    contentDisposition: 'filename = "' + fileName + '.tga"',
                  };
                  // console.log(metaData);
                  void updateMetadata(storageRefResized, metaData);
                  alert('Upload success!');
                  this.clearInput();
                  // console.log('Uploaded resized');
                });
              });
            }
          });
        } else {
          // console.log('Something has gone very wrong!');
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
