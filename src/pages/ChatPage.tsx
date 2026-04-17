import { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, MessageCircle, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';

interface ChatRoom {
  id: string;
  name: string;
  createdAt: number;
}

interface Message {
  id: string;
  roomId: string;
  username: string;
  message: string;
  timestamp: number;
}

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

  // Popular emojis
  const emojis = ['😀', '😂', '❤️', '👍', '👋', '🎉', '🔥', '🙌', '😍', '🥳', '😎', '🙄', '😢', '😡', '🚀'];

  useEffect(() => {
    loadRooms();

    const socket = apiService.initSocket();

    socket.on('new-room', (room: ChatRoom) => setRooms(prev => [room, ...prev]));
    socket.on('room-joined', () => setIsJoined(true));
    socket.on('user-joined', ({ users }: { users: string[] }) => setActiveUsers(users));
    socket.on('user-left', ({ users }: { users: string[] }) => setActiveUsers(users));
    socket.on('receive-message', (message: Message) => {
      if (message.roomId === activeRoom) {
        setMessages(prev => [...prev, message]);
      }
    });
    socket.on('user-typing', ({ username: typingUser }: { username: string }) => {
      if (!typingUsers.includes(typingUser)) {
        setTypingUsers(prev => [...prev, typingUser]);
      }
      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== typingUser));
      }, 3000);
    });

    return () => socket.disconnect();
  }, [activeRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadRooms = async () => {
    try {
      const data = await apiService.getChatRooms();
      setRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    try {
      await apiService.createChatRoom(newRoomName.trim());
      setNewRoomName('');
      setShowNewRoomForm(false);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!username.trim()) {
      alert('Please enter a username first');
      return;
    }
    if (activeRoom) {
      const socket = apiService.getSocket();
      socket?.emit('leave-room', { roomId: activeRoom, username });
    }

    setActiveRoom(roomId);
    setMessages([]);
    setIsJoined(false);

    try {
      const messagesData = await apiService.getChatMessages(roomId);
      setMessages(messagesData);
      const socket = apiService.getSocket();
      socket?.emit('join-room', { roomId, username });
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom || !isJoined) return;

    const socket = apiService.getSocket();
    socket?.emit('send-message', {
      roomId: activeRoom,
      username,
      message: messageText.trim(),
    });
    setMessageText('');
    setShowEmojiPicker(false);
  };

  const handleTyping = () => {
    if (!activeRoom || !isJoined) return;
    const socket = apiService.getSocket();
    socket?.emit('typing', { roomId: activeRoom, username });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {}, 3000);
  };

  const insertEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
    // Keep focus on input
    setTimeout(() => document.getElementById('message-input')?.focus(), 10);
  };

  const activeRoomData = rooms.find(r => r.id === activeRoom);

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden rounded-2xl shadow-2xl border border-gray-200 bg-white">
        {/* Sidebar - Rooms */}
        <div className="w-72 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowNewRoomForm(!showNewRoomForm)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
            >
              <Plus size={20} />
              New Room
            </button>

            {showNewRoomForm && (
              <form onSubmit={handleCreateRoom} className="mt-4 space-y-2">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-xl">Create</button>
                  <button type="button" onClick={() => setShowNewRoomForm(false)} className="flex-1 bg-gray-200 py-2 rounded-xl">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Username input */}
          {!username && (
            <div className="p-4 border-b bg-amber-50">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your pseudonym..."
                className="w-full px-4 py-3 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Room list */}
          <div className="flex-1 overflow-y-auto">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => handleJoinRoom(room.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 flex flex-col gap-1 border-b border-gray-100 transition-all ${
                  activeRoom === room.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-gray-600" />
                  <span className="font-semibold text-gray-900">{room.name}</span>
                </div>
                <span className="text-xs text-gray-500">{format(room.createdAt, 'MMM d, yyyy')}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom && activeRoomData ? (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-xl text-gray-900">{activeRoomData.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={18} />
                    <span>{activeUsers.length} online</span>
                  </div>
                </div>
                <div className="text-sm font-medium text-blue-600">
                  You: <span className="text-gray-900">{username}</span>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MessageCircle size={64} className="mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No messages yet...</p>
                      <p className="text-sm">Be the first to say something!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.username === username ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border'} rounded-3xl px-5 py-3`}>
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="font-semibold text-sm">
                            {msg.username === username ? 'You' : msg.username}
                          </span>
                          <span className={`text-xs ${msg.username === username ? 'text-blue-200' : 'text-gray-400'}`}>
                            {format(msg.timestamp, 'HH:mm')}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Typing indicator */}
              {typingUsers.length > 0 && (
                <div className="px-6 py-1 text-sm text-gray-500 italic">
                  {typingUsers.filter(u => u !== username).join(', ')} typing...
                </div>
              )}

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                {!username ? (
                  <p className="text-center text-gray-500 py-3">Enter your pseudonym above to chat</p>
                ) : !isJoined ? (
                  <p className="text-center text-gray-500 py-3">Joining room...</p>
                ) : (
                  <form onSubmit={handleSendMessage} className="flex items-center gap-2 relative">
                    {/* Emoji Button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-3 hover:bg-gray-100 rounded-2xl transition"
                    >
                      <Smile size={26} className="text-gray-500" />
                    </button>

                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-16 left-4 bg-white border border-gray-200 shadow-xl rounded-2xl p-3 grid grid-cols-6 gap-2 z-50">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => insertEmoji(emoji)}
                            className="text-3xl hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      id="message-input"
                      type="text"
                      value={messageText}
                      onChange={(e) => {
                        setMessageText(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 px-6 py-4 bg-gray-100 rounded-3xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    />

                    <button
                      type="submit"
                      disabled={!messageText.trim()}
                      className="bg-blue-600 text-white p-4 rounded-3xl hover:bg-blue-700 transition disabled:opacity-40"
                    >
                      <Send size={24} />
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={80} className="mx-auto mb-6 opacity-20" />
                <p className="text-xl font-medium">Select a room to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
