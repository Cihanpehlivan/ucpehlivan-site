import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, addDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { clone, fileToDataUrl } from './util.js';

export const ADMIN_EMAIL = 'pehlivan.uc@gmail.com';
export const SEED_VERSION = 'seed-1';
const clean = (o) => JSON.parse(JSON.stringify(o, (k, v) => (v === undefined ? null : v)));
const strip = ({ id, ...rest }) => rest;

// Sitenin okuduğu tek doküman: site/public
export function buildBundle(d, version = String(Date.now())) {
  const cases = [...d.cases].filter((c) => c.visible !== false).sort((a, b) => (a.order ?? 999) - (b.order ?? 999)).map(strip);
  const posts = d.posts.filter((p) => p.status === 'published' && p.slug).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))).map(strip);
  return clean({ version, settings: d.settings, home: d.home, cases, posts });
}

function firebaseStore(config) {
  const app = initializeApp(config);
  const auth = getAuth(app), db = getFirestore(app);
  const mediaCache = {};
  return {
    mode: 'firebase',
    onUser: (cb) => onAuthStateChanged(auth, cb),
    signIn: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signOut: () => signOut(auth),
    async loadAll() {
      const [s, hm, cs, ps] = await Promise.all([getDoc(doc(db, 'content/settings')), getDoc(doc(db, 'content/home')), getDocs(collection(db, 'cases')), getDocs(collection(db, 'posts'))]);
      return { settings: s.data() || null, home: hm.data() || null, cases: cs.docs.map((d) => ({ id: d.id, ...d.data() })), posts: ps.docs.map((d) => ({ id: d.id, ...d.data() })) };
    },
    saveSettings: (v) => setDoc(doc(db, 'content/settings'), clean(v)),
    saveHome: (v) => setDoc(doc(db, 'content/home'), clean(v)),
    async saveItem(col, item) {
      const data = clean({ ...strip(item), updatedAt: new Date().toISOString() });
      if (item.id) { await setDoc(doc(db, col, item.id), data); return item.id; }
      return (await addDoc(collection(db, col), data)).id;
    },
    deleteItem: (col, id) => deleteDoc(doc(db, col, id)),
    async publish(bundle) {
      const size = new Blob([JSON.stringify(bundle)]).size;
      if (size > 950_000) throw new Error('Yayın paketi çok büyük (1 MB sınırı). Eski yazıları taslağa al veya metinleri kısalt.');
      await setDoc(doc(db, 'site/public'), bundle);
    },
    async seed(data) {
      const b = writeBatch(db);
      b.set(doc(db, 'content/settings'), clean(data.settings));
      b.set(doc(db, 'content/home'), clean(data.home));
      data.cases.forEach((c) => b.set(doc(collection(db, 'cases')), clean(c)));
      data.posts.forEach((p) => b.set(doc(db, 'posts', p.slug), clean(p)));
      b.set(doc(db, 'site/public'), buildBundle(data, SEED_VERSION));
      await b.commit();
    },
    async upload(file) {
      const { dataUrl, type } = await fileToDataUrl(file);
      const ref = await addDoc(collection(db, 'media'), { data: dataUrl, type, name: file.name, createdAt: new Date().toISOString() });
      mediaCache[ref.id] = dataUrl;
      return `media:${ref.id}`;
    },
    async media(id) {
      if (!(id in mediaCache)) { const s = await getDoc(doc(db, 'media', id)); mediaCache[id] = s.data()?.data || ''; }
      return mediaCache[id];
    },
    mediaSync: (id) => mediaCache[id],
  };
}

function mockStore(seed) {
  let data = clone(seed);
  data.cases = data.cases.map((c, i) => ({ id: 'c' + i, ...c }));
  data.posts = data.posts.map((p) => ({ id: p.slug, ...p }));
  let user = null; const subs = []; const media = {}; let n = 0;
  const emit = () => subs.forEach((f) => f(user));
  return {
    mode: 'mock',
    onUser: (cb) => { subs.push(cb); setTimeout(() => cb(user), 0); },
    signIn: async () => { user = { email: ADMIN_EMAIL, displayName: 'Deneme modu' }; emit(); },
    signOut: async () => { user = null; emit(); },
    loadAll: async () => clone(data),
    saveSettings: async (v) => { data.settings = clone(v); },
    saveHome: async (v) => { data.home = clone(v); },
    async saveItem(col, item) { const id = item.id || 'n' + Date.now(); const list = data[col]; const i = list.findIndex((x) => x.id === id); const v = { ...clone(item), id }; if (i >= 0) list[i] = v; else list.push(v); return id; },
    deleteItem: async (col, id) => { data[col] = data[col].filter((x) => x.id !== id); },
    publish: async () => {},
    seed: async () => {},
    async upload(file) { const { dataUrl } = await fileToDataUrl(file); const id = 'mock' + String(++n).padStart(4, '0'); media[id] = dataUrl; return `media:${id}`; },
    media: async (id) => media[id] || '',
    mediaSync: (id) => media[id],
  };
}

export async function createStore() {
  const seed = await (await fetch('/admin/seed.json')).json();
  const mock = new URLSearchParams(location.search).has('mock');
  if (mock) return { store: mockStore(seed), seed };
  const res = await fetch('/__/firebase/init.json');
  if (!res.ok) throw new Error('Firebase yapılandırması bulunamadı. Panel Firebase Hosting üzerinde çalışmalı (veya ?mock ile deneme modunu kullan).');
  return { store: firebaseStore(await res.json()), seed };
}
