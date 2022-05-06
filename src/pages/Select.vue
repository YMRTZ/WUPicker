<template>
  <q-page>
    <q-layout>
      <q-drawer :width="300" :breakpoint="500" bordered show-if-above>
        <q-scroll-area class="fit">
          <q-list>
            <q-item
              clickable
              v-ripple
              v-for="listTag in tags"
              :key="listTag"
              @click="getImages(listTag)"
            >
              <q-item-section>
                {{ listTag }}
              </q-item-section>
            </q-item>
            <q-separator />
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <q-page-container>
        <q-img
          v-for="image in images"
          :key="image.index"
          :src="image.url"
          :ratio="1"
          max-width:
          style="max-width: 300px"
          class="q-mr-xs q-mb-xs"
          @click="selectFlag(image.index)"
        />
      </q-page-container>
    </q-layout>
    <q-footer><button @click="printImages()">Pain</button></q-footer>
  </q-page>
</template>
<script lang="ts">
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, listAll, getDownloadURL } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent } from 'vue';
import { firebaseConfig } from '../../firebase-config.js';
const app: FirebaseApp = initializeApp(firebaseConfig);
export default defineComponent({
  name: 'uploadComponent',
  data() {
    return {
      selected: '' as string,
      selectedFlag: 0 as number,
      firestore_database: getFirestore(app),
      cloudstore_database: getStorage(),
      tags: [] as string[],
      images: [] as { index: number; url: string }[],
    };
  },
  methods: {
    printImages() {
      console.log('Images');
      console.log(this.images);
    },
    select(selectTag: string) {
      this.selected = selectTag;
    },
    selectFlag(selectedFlag: number) {
      this.selectedFlag = selectedFlag;
    },
    testPrint() {
      console.log(this.selected);
    },
    print() {
      console.log('Printing');
      let testRef = fireRef(this.cloudstore_database);
      void listAll(testRef).then(() => {
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
      void listAll(loadRef).then((res) => {
        res.prefixes.forEach((tempTag) => {
          this.tags.push(tempTag.name);
        });
      });
    },
    async getImages(tag: string) {
      this.images = [];
      this.select(tag);
      let tagFolderRef = fireRef(this.cloudstore_database, tag);
      let fileRef;
      let firebaseFileRef = doc(this.firestore_database, 'Tags', tag);

      let selectedCount = 0;
      void (await getDoc(firebaseFileRef).then((countSnap) => {
        if (countSnap.exists()) {
          selectedCount = countSnap.data().count as number;
        }
      }));

      for (let i = 1; i <= selectedCount; i++) {
        fileRef = fireRef(tagFolderRef, i.toString());
        void getDownloadURL(fileRef).then((gotFile) => {
          let tempHold = { index: 0, url: '' };
          console.log(gotFile);
          tempHold.url = gotFile;
          tempHold.index = i;
          this.images.push(tempHold);
        });
      }
    },
  },
  mounted() {
    this.loadTags();
  },
});
</script>
