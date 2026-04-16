import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class APIService {
  private socket: Socket | null = null;

  // Initialize socket connection
  initSocket() {
    if (!this.socket) {
      this.socket = io(API_URL);
    }
    return this.socket;
  }

  getSocket() {
    return this.socket;
  }

  // Problems API
  async getProblems() {
    const response = await fetch(`${API_URL}/api/problems`);
    return response.json();
  }

  async createProblem(problem: any) {
    const response = await fetch(`${API_URL}/api/problems`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(problem)
    });
    return response.json();
  }

  async voteProblem(id: string, delta: number) {
    const response = await fetch(`${API_URL}/api/problems/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return response.json();
  }

  async commentOnProblem(id: string, comment: any) {
    const response = await fetch(`${API_URL}/api/problems/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    return response.json();
  }

  // Crushes API
  async getCrushes() {
    const response = await fetch(`${API_URL}/api/crushes`);
    return response.json();
  }

  async createCrush(crush: any) {
    const response = await fetch(`${API_URL}/api/crushes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crush)
    });
    return response.json();
  }

  async voteCrush(id: string, delta: number) {
    const response = await fetch(`${API_URL}/api/crushes/${id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta })
    });
    return response.json();
  }

  async commentOnCrush(id: string, comment: any) {
    const response = await fetch(`${API_URL}/api/crushes/${id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });
    return response.json();
  }

  // Forum API
  async getForumThreads() {
    const response = await fetch(`${API_URL}/api/forum-threads`);
    return response.json();
  }

  async createForumThread(thread: any) {
    const response = await fetch(`${API_URL}/api/forum-threads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(thread)
    });
    return response.json();
  }

  async likeForumThread(id: string) {
    const response = await fetch(`${API_URL}/api/forum-threads/${id}/like`, {
      method: 'POST'
    });
    return response.json();
  }

  async replyToForumThread(id: string, reply: any) {
    const response = await fetch(`${API_URL}/api/forum-threads/${id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reply)
    });
    return response.json();
  }

  // Chat API
  async getChatRooms() {
    const response = await fetch(`${API_URL}/api/chat-rooms`);
    return response.json();
  }

  async createChatRoom(name: string) {
    const response = await fetch(`${API_URL}/api/chat-rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    return response.json();
  }

  async getChatMessages(roomId: string) {
    const response = await fetch(`${API_URL}/api/chat-messages/${roomId}`);
    return response.json();
  }
}

export const apiService = new APIService();
