import { firebaseInit } from '@gcto/firebase-hooks';
import { boot } from 'quasar/wrappers';
import { firebaseConfig } from '../../firebase-config.js';
export default boot(({ app }) => {
  app.use(() => {
    firebaseInit(firebaseConfig);
  });
});
