import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: 'next-app-fbdce.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function addText({ title, path, order, realTitle }) {
  const newReplay = doc(collection(db, 'text'));
  await setDoc(newReplay, {
    id: newReplay.id,
    title,
    realTitle,
    path,
    order,
  });
  return {
    id: newReplay.id,
    title,
    path,
    order,
    realTitle,
  };
}

export async function getTexts() {
  const querySnapshot = await getDocs(query(collection(db, 'text')));
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedReplays = [];
  querySnapshot.forEach((doc) => {
    const aTodo = {
      id: doc.id,
      realTitle: doc.data()['realTitle'],
      title: doc.data()['title'],
      path: doc.data()['path'],
      order: doc.data()['order'],
    };
    fetchedReplays.push(aTodo);
  });
  return fetchedReplays;
}

export async function getSpecificText(id) {
  const querySnapshot = await getDocs(
    query(collection(db, 'text'), where('id', '==', id)),
  );
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedTexts = [];
  querySnapshot.forEach((doc) => {
    fetchedTexts.push({
      id: doc.id,
      title: doc.data()['title'],
      realTitle: doc.data()['realTitle'],
      path: doc.data()['path'],
      order: doc.data()['order'],
    });
  });
  return fetchedTexts;
}

export async function editSpecificTitle({ id, newTitle }) {
  const todoRef = doc(db, 'text', id);
  const fetched = await updateDoc(todoRef, {
    realTitle: newTitle,
  });
  return fetched;
}

export async function deleteSpecificText(id) {
  await deleteDoc(doc(db, 'text', id));
  return { status: '성공' };
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

export async function getPolls() {
  const querySnapshot = await getDocs(query(collection(db, 'poll')));
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedPolls = [];
  querySnapshot.forEach((doc) => {
    const poll = {
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      voters: doc.data()['voters'],
    };
    fetchedPolls.push(poll);
  });
  return fetchedPolls;
}

export async function getPoll({ id, title }) {
  const querySnapshot = await getDocs(
    query(collection(db, 'poll'), where('id', '==', id)),
  );
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedPoll = [];
  querySnapshot.forEach((doc) => {
    fetchedTexts.push({
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      voters: doc.data()['voters'],
    });
  });
  return fetchedPoll;
}

export async function addPoll({ categories, desc, title }) {
  const newPoll = doc(collection(db, 'poll'));
  const voters = '[]';
  const createdPoll = await setDoc(newPoll, {
    id: newPoll.id,
    categories: JSON.stringify(categories),
    title,
    voters,
    desc,
  });
  return createdPoll;
}
