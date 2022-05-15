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
          style="max-width: 280px"
          @click="selectFlag(image.index)"
          :class="[
            'q-mr-xs',
            'q-mb-xs',
            'flagDisplay',
            { selectedOutline: selectedFlag === image.index },
          ]"
        />
      </q-page-container>
    </q-layout>
  </q-page>
</template>
<script lang="ts">
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getStorage, listAll, getDownloadURL } from 'firebase/storage';
import { ref as fireRef } from 'firebase/storage';
import { defineComponent } from 'vue';
import { firebaseConfig } from 'app/firebase-config';
// import { firebaseConfig } from '../../firebase-config.js';
//GCTO Refactor
// import { useFirestoreDoc, firebaseInit } from '@gcto/firebase-hooks';
// const app = firebaseInit(firebaseConfig);

//Original
const app: FirebaseApp = initializeApp(firebaseConfig);

export default defineComponent({
  name: 'uploadComponent',
  data() {
    return {
      selected: '' as string,
      selectedFlag: 0 as number,
      //Original
      firestore_database: getFirestore(app),
      cloudstore_database: getStorage(),
      tags: [] as string[],
      images: [] as { index: number; url: string }[],
    };
  },
  methods: {
    select(selectTag: string) {
      this.selected = selectTag;
    },
    selectFlag(selectedFlag: number) {
      this.selectedFlag = selectedFlag;
      let smallTagFolderRef = fireRef(
        this.cloudstore_database,
        this.selected + '/tga'
      );
      let smallTagRef = fireRef(
        smallTagFolderRef,
        this.selectedFlag.toString() + '.tga'
      );
      void getDownloadURL(smallTagRef).then((gotFile) => {
        const link = document.createElement('a');
        link.href = gotFile;
        link.download = this.selected;
        link.click();
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
      //async
      this.images = [];
      this.select(tag);
      let tagFolderRef = fireRef(this.cloudstore_database, tag);
      let fileRef;
      //Original
      let firebaseFileRef = doc(this.firestore_database, 'Tags', tag);

      let selectedCount = 0;

      // GCTO Refactor
      // type countStore = { count: number };
      // console.log(tag);
      // let gctoDoc = useFirestoreDoc<countStore>('Tags', () => tag);
      // console.log(gctoDoc);
      // console.log(gctoDoc.data);
      // if (gctoDoc.data.value) {
      //   selectedCount = gctoDoc.data.value?.count;
      // }

      //Original
      void (await getDoc(firebaseFileRef).then((countSnap) => {
        if (countSnap.exists()) {
          selectedCount = countSnap.data().count as number;
        }
      }));

      for (let i = 1; i <= selectedCount; i++) {
        fileRef = fireRef(tagFolderRef, i.toString());
        void getDownloadURL(fileRef).then((gotFile) => {
          let tempHold = { index: 0, url: '' };
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

<style scoped lang="scss">
.selectedOutline {
  border: 4px solid blue;
}
</style>
