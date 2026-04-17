// src/services/firebaseService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  arrayUnion
} from "firebase/firestore";
import { db } from "../firebase";

// ================== CHAT (déjà fonctionnel) ==================
export const chatService = {
  subscribeToRoom: (roomId: string, callback: (messages: any[]) => void) => {
    const q = query(collection(db, "chatRooms", roomId, "messages"), orderBy("timestamp"));
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(messages);
    });
  },

  sendMessage: async (roomId: string, username: string, message: string) => {
    await addDoc(collection(db, "chatRooms", roomId, "messages"), {
      username,
      message,
      timestamp: serverTimestamp()
    });
  },

  createRoom: async (name: string) => {
    const docRef = await addDoc(collection(db, "chatRooms"), {
      name,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  getRooms: async () => {
    const q = query(collection(db, "chatRooms"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// ================== PROBLEMS ==================
export const problemService = {
  getProblems: async () => {
    const q = query(collection(db, "problems"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createProblem: async (problem: any) => {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problem,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...problem };
  }
};

// ================== CRUSHES ==================
export const crushService = {
  getCrushes: async () => {
    const q = query(collection(db, "crushes"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createCrush: async (crush: any) => {
    const docRef = await addDoc(collection(db, "crushes"), {
      ...crush,
      timestamp: serverTimestamp()
    });
    return { id: docRef.id, ...crush };
  }
};

// ================== FORUM ==================
export const forumService = {
  getThreads: async () => {
    const q = query(collection(db, "forumThreads"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createThread: async (thread: any) => {
    const docRef = await addDoc(collection(db, "forumThreads"), {
      ...thread,
      timestamp: serverTimestamp(),
      likes: 0,
      replies: []
    });
    return { id: docRef.id, ...thread };
  }
};

export default { chatService, problemService, crushService, forumService };
