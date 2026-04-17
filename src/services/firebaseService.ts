// src/services/firebaseService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../firebase";

// ================== CHAT ==================
export const chatService = {
  // Écouter les messages en temps réel
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

  // Envoyer un message
  sendMessage: async (roomId: string, username: string, message: string) => {
    await addDoc(collection(db, "chatRooms", roomId, "messages"), {
      username,
      message,
      timestamp: serverTimestamp()
    });
  },

  // Créer une nouvelle room
  createRoom: async (name: string) => {
    const docRef = await addDoc(collection(db, "chatRooms"), {
      name,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  },

  // Récupérer toutes les rooms
  getRooms: async () => {
    const q = query(collection(db, "chatRooms"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }
};

// ================== AUTRES FONCTIONS (on les ajoutera plus tard) ==================
export const problemService = {};   // à remplir plus tard
export const crushService = {};     // à remplir plus tard
export const forumService = {};     // à remplir plus tard

export default chatService;
