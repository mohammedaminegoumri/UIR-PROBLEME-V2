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

// ================== CHAT ==================
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

// ================== PROBLEMS + COMMENTAIRES ==================
export const problemService = {
  getProblems: async () => {
    const q = query(collection(db, "problems"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createProblem: async (problem: any) => {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problem,
      timestamp: serverTimestamp(),
      votes: 0,
      comments: []
    });
    return { id: docRef.id, ...problem };
  },

  addComment: async (problemId: string, comment: { text: string; author: string; anonymous: boolean }) => {
    const problemRef = doc(db, "problems", problemId);
    await updateDoc(problemRef, {
      comments: arrayUnion({
        id: Date.now().toString(),
        ...comment,
        timestamp: serverTimestamp()
      })
    });
  }
};

// ================== CRUSHES + COMMENTAIRES ==================
export const crushService = {
  getCrushes: async () => {
    const q = query(collection(db, "crushes"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  createCrush: async (crush: any) => {
    const docRef = await addDoc(collection(db, "crushes"), {
      ...crush,
      timestamp: serverTimestamp(),
      votes: 0,
      comments: []
    });
    return { id: docRef.id, ...crush };
  },

  addComment: async (crushId: string, comment: { text: string; author: string; anonymous: boolean }) => {
    const crushRef = doc(db, "crushes", crushId);
    await updateDoc(crushRef, {
      comments: arrayUnion({
        id: Date.now().toString(),
        ...comment,
        timestamp: serverTimestamp()
      })
    });
  }
};

// ================== FORUM + REPLIES ==================
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
  },

  addReply: async (threadId: string, reply: { content: string; author: string }) => {
    const threadRef = doc(db, "forumThreads", threadId);
    await updateDoc(threadRef, {
      replies: arrayUnion({
        id: Date.now().toString(),
        ...reply,
        timestamp: serverTimestamp()
      })
    });
  }
};

export default { chatService, problemService, crushService, forumService };
