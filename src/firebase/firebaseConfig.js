import { initializeApp } from 'firebase/app'
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
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: 'next-app-fbdce.appspot.com',
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const storage = getStorage(app)

export async function getTodaySetting() {
  const querySnapshot = await getDocs(query(collection(db, 'poll-of-today')))
  let pod = ''
  const setting = { pod: {}, polls: [] }
  if (!querySnapshot.empty) {
    querySnapshot.forEach((doc) => {
      pod = doc.data()['pod']
    })
  }
  const querySnapshot2 = await getDocs(query(collection(db, 'poll')))
  if (querySnapshot.empty) {
    return []
  }
  const fetchedPolls = []
  querySnapshot2.forEach((doc) => {
    const poll = {
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      voters: doc.data()['voters'],
      dup: Number(doc.data()['dup']),
      end: Number(doc.data()['end']),
      publicId: doc.data()['publicId'],
      nick: doc.data()['nick'],
      pw: doc.data()['pw'],
      ngrams: doc.data()['ngrams'],
    }
    fetchedPolls.push(poll)
    if (pod == doc.data()['id']) {
      setting.pod = poll
    }
  })

  setting.polls = fetchedPolls
  if (!setting.pod.id) {
    setting.pod = null
  }

  return setting
}

export async function getPolls() {
  const querySnapshot = await getDocs(query(collection(db, 'poll')))
  if (querySnapshot.empty) {
    return []
  }
  const fetchedPolls = []
  querySnapshot.forEach((doc) => {
    const poll = {
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      dup: Number(doc.data()['dup']),
      end: Number(doc.data()['end']),
      voters: doc.data()['voters'],
      publicId: doc.data()['publicId'],
      nick: doc.data()['nick'],
      pw: doc.data()['pw'],
      ngrams: doc.data()['ngrams'],
    }
    fetchedPolls.push(poll)
  })
  return fetchedPolls
}

export async function getPoll({ id }) {
  let querySnapshot
  if (/^-?\d+(\.\d+)?$/.test(id)) {
    querySnapshot = await getDocs(
      query(collection(db, 'poll'), where('publicId', '==', Number(id))),
    )
  } else {
    querySnapshot = await getDocs(
      query(collection(db, 'poll'), where('id', '==', id)),
    )
  }
  if (querySnapshot.empty) {
    return []
  }
  const fetchedPoll = []
  querySnapshot.forEach((doc) => {
    fetchedPoll.push({
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      dup: Number(doc.data()['dup']),
      end: Number(doc.data()['end']),
      title: doc.data()['title'],
      voters: doc.data()['voters'],
      publicId: doc.data()['publicId'],
      nick: doc.data()['nick'],
      pw: doc.data()['pw'],
      ngrams: doc.data()['ngrams'],
    })
  })
  return fetchedPoll
}

export async function addPoll({
  categories,
  desc,
  title,
  dup,
  end,
  pw,
  nick,
  ngrams,
}) {
  const newPoll = doc(collection(db, 'poll'))
  const voters = '[]'
  const data = {
    id: newPoll.id,
    pw,
    categories,
    title,
    voters,
    desc,
    dup,
    end,
    nick,
    ngrams,
    publicId: Date.now(),
  }
  await setDoc(newPoll, data)
  return data
}

export async function editPoll({
  id,
  title,
  desc,
  dup,
  end,
  categories,
  nick,
  ngrams,
}) {
  const pollRef = doc(db, 'poll', id)
  const fetched = await updateDoc(pollRef, {
    title,
    desc,
    dup,
    end,
    categories,
    nick,
    ngrams,
  })
  return fetched
}

export async function editPod({ id, pod }) {
  const pollRef = doc(db, 'poll-of-today', id)
  const fetched = await updateDoc(pollRef, {
    pod,
  })
  return fetched
}

export async function deletePoll(id) {
  await deleteDoc(doc(db, 'poll', id))
  return { status: '성공' }
}

export async function addVote({ id, vote, voter }) {
  const pollRef = doc(db, 'poll', id)
  const snapshot = await getDoc(pollRef)
  const currentData = JSON.parse(snapshot.data().categories)
  let newVoters = [...JSON.parse(snapshot.data().voters)]
  const isVoted = newVoters.find((n) => n === voter)
  if (isVoted === undefined) {
    const obj = vote.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1
      return acc
    }, {})
    const updatedItems = currentData.map((item) => {
      const add = obj[item.id] || 0
      return {
        ...item,
        percentage: item.percentage + add,
      }
    })
    const final = JSON.stringify(updatedItems)
    newVoters.push(voter)
    await updateDoc(pollRef, {
      categories: final,
      voters: JSON.stringify(newVoters),
    })
    return {
      categories: final,
      voters: JSON.stringify(newVoters),
    }
  } else {
    return null
  }
}

export async function searchPolls({ searchOption, type }) {
  let q

  if (type === 'title') {
    q = query(
      collection(db, 'poll'),
      where('ngrams', 'array-contains', `title:${searchOption}`),
    )
  } else if (type === 'nick') {
    q = query(
      collection(db, 'poll'),
      where('ngrams', 'array-contains', `nick:${searchOption}`),
    )
  } else if (type === 'all') {
    q = query(
      collection(db, 'poll'),
      where('ngrams', 'array-contains', searchOption),
    )
  } else {
    return [] // 잘못된 type이면 빈 배열 반환
  }

  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    return []
  }
  const fetchedPolls = []
  querySnapshot.forEach((doc) => {
    const poll = {
      categories: doc.data()['categories'],
      desc: doc.data()['desc'],
      id: doc.data()['id'],
      title: doc.data()['title'],
      dup: Number(doc.data()['dup']),
      end: Number(doc.data()['end']),
      voters: doc.data()['voters'],
      publicId: doc.data()['publicId'],
      nick: doc.data()['nick'],
      pw: doc.data()['pw'],
      ngrams: doc.data()['ngrams'],
    }
    fetchedPolls.push(poll)
  })
  return fetchedPolls
}

export async function checkPW({ id, pw }) {
  const querySnapshot = await getDocs(
    query(collection(db, 'poll'), where('id', '==', id)),
  )
  if (querySnapshot.empty) {
    return 'NO'
  }
  let fetched = 'NO'
  querySnapshot.forEach((doc) => {
    if (doc.data()['pw'] === pw) {
      fetched = 'OK'
    }
  })
  return fetched
}
