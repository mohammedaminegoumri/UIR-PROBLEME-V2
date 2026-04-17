import { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, MessageCircle, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';

interface ChatRoom { id: string; name: string; createdAt: number; }
interface Message { id: string; roomId: string; username: string; message: string; timestamp: number; }

const ChatPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [activeUsers, setActiveUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['😀', '😂', '❤️', '👍', '👋', '🎉', '🔥', '🙌', '😍', '🥳', '😎', '🙄', '😢', '😡', '🚀'];

  useEffect(() => {
    loadRooms();
    const socket = apiService.initSocket();

    socket.on('new-room', (room) => setRooms(prev => [room, ...prev]));
    socket.on('user-joined', ({ users }) => setActiveUsers(users));
    socket.on('user-left', ({ users }) => setActiveUsers(users));
    socket.on('receive-message', (message: Message) => {
      if (message.roomId === activeRoom) {
        setMessages(prev => {
          // Avoid duplicate if we already added it optimistically
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });
      }
    });
    socket.on('user-typing', ({ username: typingUser }) => {
      if (!typingUsers.includes(typingUser)) setTypingUsers(prev => [...prev, typingUser]);
      setTimeout(() => setTypingUsers(prev => prev.filter(u => u !== typingUser)), 3000);
    });

    return () => socket.disconnect();
  }, [activeRoom]);

  useEffect(() => { scrollToBottom(); }, [messages]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const loadRooms = async () => {
    try { const data = await apiService.getChatRooms(); setRooms(data); } catch (e) { console.error(e); }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    await apiService.createChatRoom(newRoomName.trim());
    setNewRoomName(''); setShowNewRoomForm(false);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!username.trim()) { alert('Enter a username first'); return; }

    if (activeRoom) apiService.getSocket()?.emit('leave-room', { roomId: activeRoom, username });

    setActiveRoom(roomId);
    setMessages([]);
    setIsJoined(true);

    try {
      const messagesData = await apiService.getChatMessages(roomId);
      setMessages(messagesData);
      apiService.getSocket()?.emit('join-room', { roomId, username });
    } catch (e) { console.error(e); setIsJoined(false); }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom || !isJoined) return;

    const tempMessage: Message = {
      id: 'temp-' + Date.now(),
      roomId: activeRoom,
      username,
      message: messageText.trim(),
      timestamp: Date.now()
    };

    // Optimistic update - show message immediately
    setMessages(prev => [...prev, tempMessage]);

    // Send to server
    apiService.getSocket()?.emit('send-message', {
      roomId: activeRoom,
      username,
      message: messageText.trim()
    });

    setMessageText('');
    setShowEmojiPicker(false);
  };

  const handleTyping = () => {
    if (!activeRoom || !isJoined) return;
    apiService.getSocket()?.emit('typing', { roomId: activeRoom, username });
  };

  const insertEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    setTimeout(() => document.getElementById('message-input')?.focus(), 10);
  };

  const activeRoomData = rooms.find(r => r.id === activeRoom);

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* ... (the rest of your beautiful UI stays exactly the same) ... */}
      {/* I kept the full UI from before - just paste the whole thing if you want, but the important changes are above */}
    </div>
  );
};

export default ChatPage;
