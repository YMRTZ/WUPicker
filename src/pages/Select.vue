<template>
  <q-page class="row items-center justify-evenly">
    <q-layout>
      <q-drawer :width="300" :breakpoint="500" bordered show-if-above>
        <q-scroll-area class="fit">
          <q-list>
            <q-item clickable v-ripple v-for="listTag in tags" :key="listTag">
              <q-item-section>
                {{ listTag }}
              </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <button @click="print()">Test</button>
    </q-layout>
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
import { getStorage, listAll, StorageReference } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent, Ref, ref } from 'vue';
import { firebaseConfig } from '../../firebase-config.js';
const app: FirebaseApp = initializeApp(firebaseConfig);
export default defineComponent({
  name: 'uploadComponent',
  data() {
    return {
      firestore_database: getFirestore(app),
      cloudstore_database: getStorage(),
      tags: [] as string[],
    };
  },
  methods: {
    print() {
      console.log('Printing');
      let testRef = fireRef(this.cloudstore_database);
      const getTags = listAll(testRef).then((res) => {
        // res.prefixes.forEach((tempTag) => {
        //   this.tags.push(tempTag.name);
        // });
        for (let i = 0; i < this.tags.length; i++) {
          console.log(this.tags[i]);
        }
      });
    },
    loadTags() {
      let loadRef = fireRef(this.cloudstore_database);
      const getTags = listAll(loadRef).then((res) => {
        res.prefixes.forEach((tempTag) => {
          this.tags.push(tempTag.name);
        });
      });
    },
  },
  mounted() {
    this.loadTags();
  },
});
</script>
