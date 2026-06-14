import { initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { upload } from '@vercel/blob/client'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseReady = Object.values(config).every(Boolean)

const app = firebaseReady ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null

const studioRef = (userId) => doc(db, 'studios', userId)

const ensureStudio = async (user) => {
  const reference = studioRef(user.uid)
  const snapshot = await getDoc(reference)
  if (!snapshot.exists()) {
    await setDoc(reference, {
      name: user.displayName || 'Yeni Stüdyo',
      email: user.email,
      plan: 'starter',
      credits: 25,
      createdAt: serverTimestamp(),
    })
  }
}

export function watchAuth(callback) {
  if (!auth) {
    callback({ user: null, studio: null, loading: false })
    return () => {}
  }

  let unsubscribeStudio = () => {}
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    unsubscribeStudio()
    if (!user) {
      callback({ user: null, studio: null, loading: false })
      return
    }

    unsubscribeStudio = onSnapshot(studioRef(user.uid), (snapshot) => {
      callback({ user, studio: snapshot.data() || null, loading: false })
    })
  })

  return () => {
    unsubscribeAuth()
    unsubscribeStudio()
  }
}

export async function registerStudio({ email, password, name }) {
  if (!auth) throw new Error('Firebase yapılandırması eksik.')
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(result.user, { displayName: name })
  await setDoc(studioRef(result.user.uid), {
    name,
    email,
    plan: 'starter',
    credits: 25,
    createdAt: serverTimestamp(),
  })
  return result.user
}

export async function login(email, password) {
  if (!auth) throw new Error('Firebase yapılandırması eksik.')
  return signInWithEmailAndPassword(auth, email, password)
}

export async function loginWithGoogle() {
  if (!auth) throw new Error('Firebase yapılandırması eksik.')
  const result = await signInWithPopup(auth, new GoogleAuthProvider())
  await ensureStudio(result.user)
  return result.user
}

export function logout() {
  if (!auth) return Promise.resolve()
  return signOut(auth)
}

export function watchProjects(userId, callback) {
  if (!db || !userId) return () => {}
  const projectsQuery = query(
    collection(db, 'projects'),
    where('ownerId', '==', userId),
    orderBy('createdAt', 'desc'),
  )

  return onSnapshot(projectsQuery, (snapshot) => {
    callback(
      snapshot.docs.map((project) => ({
        id: project.id,
        ...project.data(),
        createdLabel: project.data().createdAt?.toDate().toLocaleDateString('tr-TR') || 'Şimdi',
      })),
    )
  })
}

export async function createProject(userId, form, files) {
  if (!db || !auth?.currentUser) throw new Error('Firebase oturumu bulunamadı.')

  const project = await addDoc(collection(db, 'projects'), {
    ownerId: userId,
    coupleName: form.coupleName,
    product: form.product,
    style: form.style,
    aspectRatio: form.aspectRatio,
    status: 'uploading',
    progress: 4,
    assetCount: files.length,
    createdAt: serverTimestamp(),
  })

  const idToken = await auth.currentUser.getIdToken()
  const assets = await Promise.all(files.map(async (file, index) => {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const pathname = `studios/${userId}/projects/${project.id}/${index}-${safeName}`
    const blob = await upload(pathname, file, {
      access: 'public',
      handleUploadUrl: '/api/upload',
      headers: { Authorization: `Bearer ${idToken}` },
      contentType: file.type,
      multipart: file.size > 5 * 1024 * 1024,
    })
    return blob.url
  }))

  await updateDoc(project, {
    assets,
    coverUrl: assets[0] || '',
    status: 'queued',
    progress: 12,
  })

  await addDoc(collection(db, 'generations'), {
    ownerId: userId,
    projectId: project.id,
    product: form.product,
    style: form.style,
    aspectRatio: form.aspectRatio,
    status: 'queued',
    creditCost: 1,
    createdAt: serverTimestamp(),
  })

  // Üretimi anında tetikle (cron yalnızca yedek). Token ile kullanıcının kuyruğu işlenir.
  fetch('/api/process', {
    method: 'POST',
    headers: { Authorization: `Bearer ${idToken}` },
  }).catch(() => {})

  return project.id
}
