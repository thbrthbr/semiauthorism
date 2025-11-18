import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
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

export async function getTodaySetting() {
  const querySnapshot = await getDocs(query(collection(db, 'poll-of-today')));
  if (querySnapshot.empty) {
    return [];
  }
  const setting = { pod: {}, polls: [] };
  let pod = '';
  querySnapshot.forEach((doc) => {
    pod = doc.data()['pod'];
  });
  const querySnapshot2 = await getDocs(query(collection(db, 'poll')));
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedPolls = [];
  querySnapshot2.forEach((doc) => {
    const poll = {
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      voters: doc.data()['voters'],
      dup: Number(doc.data()['dup']),
      publicId: doc.data()['publicId'],
    };
    fetchedPolls.push(poll);
    if (pod == doc.data()['id']) {
      setting.pod = poll;
    }
  });

  setting.polls = fetchedPolls;

  return setting;
}

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
      dup: Number(doc.data()['dup']),
      voters: doc.data()['voters'],
      publicId: doc.data()['publicId'],
    };
    fetchedPolls.push(poll);
  });
  return fetchedPolls;
}

export async function getPoll({ id }) {
  let querySnapshot;
  if (/^-?\d+(\.\d+)?$/.test(id)) {
    querySnapshot = await getDocs(
      query(collection(db, 'poll'), where('publicId', '==', Number(id))),
    );
  } else {
    querySnapshot = await getDocs(
      query(collection(db, 'poll'), where('id', '==', id)),
    );
  }
  if (querySnapshot.empty) {
    return [];
  }
  const fetchedPoll = [];
  querySnapshot.forEach((doc) => {
    fetchedPoll.push({
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      dup: Number(doc.data()['dup']),
      title: doc.data()['title'],
      voters: doc.data()['voters'],
      publicId: doc.data()['publicId'],
    });
  });
  return fetchedPoll;
}

export async function addPoll({ categories, desc, title, dup, pw }) {
  const newPoll = doc(collection(db, 'poll'));
  const voters = '[]';
  const createdPoll = await setDoc(newPoll, {
    id: newPoll.id,
    pw,
    categories,
    title,
    voters,
    desc,
    dup,
    publicId: Date.now(),
  });
  return createdPoll;
}

export async function editPoll({ id, title, desc, dup, categories }) {
  const pollRef = doc(db, 'poll', id);
  const fetched = await updateDoc(pollRef, {
    title,
    desc,
    dup,
    categories,
  });
  return fetched;
}

export async function editPod({ id, pod }) {
  const pollRef = doc(db, 'poll-of-today', id);
  const fetched = await updateDoc(pollRef, {
    pod,
  });
  return fetched;
}

export async function addVote({ id, vote }) {
  const pollRef = doc(db, 'poll', id);
  const snapshot = await getDoc(pollRef);
  const currentData = JSON.parse(snapshot.data().categories);
  const obj = vote.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {});
  const updatedItems = currentData.map((item) => {
    const add = obj[item.id] || 0;
    return {
      ...item,
      percentage: item.percentage + add,
    };
  });
  const final = JSON.stringify(updatedItems);
  const fetched = await updateDoc(pollRef, {
    categories: final,
  });
  return fetched;
}
