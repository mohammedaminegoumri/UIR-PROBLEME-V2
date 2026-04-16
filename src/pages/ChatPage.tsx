import { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, MessageCircle } from 'lucide-react';
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadRooms();
    
    const socket = apiService.initSocket();
    
    socket.on('new-room', (room: ChatRoom) => {
      setRooms(prev => [room, ...prev]);
    });

    socket.on('room-joined', () => {
      setIsJoined(true);
    });

    socket.on('user-joined', ({ users }: { username: string; users: string[] }) => {
      setActiveUsers(users);
    });

    socket.on('user-left', ({ users }: { users: string[] }) => {
      setActiveUsers(users);
    });

    socket.on('receive-message', (message: Message) => {
      if (message.roomId === activeRoom) {
        setMessages(prev => [...prev, message]);
      }
    });

    socket.on('user-typing', ({ username: typingUser }: { username: string }) => {
      setTypingUsers(prev => {
        if (!prev.includes(typingUser)) {
          return [...prev, typingUser];
        }
        return prev;
      });

      setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u !== typingUser));
      }, 3000);
    });
    
    return () => {
      socket.off('new-room');
      socket.off('room-joined');
      socket.off('user-joined');
      socket.off('user-left');
      socket.off('receive-message');
      socket.off('user-typing');
    };
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
      message: messageText.trim()
    });

    setMessageText('');
  };

  const handleTyping = () => {
    if (!activeRoom || !isJoined) return;

    const socket = apiService.getSocket();
    socket?.emit('typing', { roomId: activeRoom, username });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      // Typing indicator will automatically clear
    }, 3000);
  };

  const activeRoomData = rooms.find(r => r.id === activeRoom);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="grid grid-cols-12 h-full">
          {/* Sidebar - Room List */}
          <div className="col-span-3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <button
                onClick={() => setShowNewRoomForm(!showNewRoomForm)}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                New Room
              </button>

              {showNewRoomForm && (
                <form onSubmit={handleCreateRoom} className="mt-4">
                  <input
                    type="text"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    placeholder="Room name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 transition"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewRoomForm(false)}
                      className="flex-1 bg-gray-200 text-gray-700 py-1 rounded text-sm hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {!username && (
              <div className="p-4 bg-yellow-50 border-b border-yellow-200">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter pseudonym"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              {rooms.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No rooms yet. Create one to start chatting!
                </div>
              ) : (
                rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => handleJoinRoom(room.id)}
                    className={`w-full p-4 text-left hover:bg-gray-50 transition border-b border-gray-100 ${
                      activeRoom === room.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle size={16} className="text-gray-600" />
                      <span className="font-medium text-gray-900">{room.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(room.createdAt, 'MMM d, yyyy')}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-9 flex flex-col">
            {activeRoom && activeRoomData ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900">{activeRoomData.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users size={16} />
                        <span>{activeUsers.length} online</span>
                      </div>
                    </div>
                    {username && (
                      <div className="text-sm text-gray-600">
                        You: <span className="font-medium text-blue-600">{username}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.username === username ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-md px-4 py-2 rounded-lg ${
                            message.username === username
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-sm">
                              {message.username === username ? 'You' : message.username}
                            </span>
                            <span
                              className={`text-xs ${
                                message.username === username ? 'text-blue-200' : 'text-gray-500'
                              }`}
                            >
                              {format(message.timestamp, 'HH:mm')}
                            </span>
                          </div>
                          <p className="whitespace-pre-wrap break-words">{message.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing Indicator */}
                {typingUsers.length > 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    {typingUsers.filter(u => u !== username).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  {!username ? (
                    <div className="text-center text-gray-500 py-4">
                      Please enter a pseudonym to start chatting
                    </div>
                  ) : !isJoined ? (
                    <div className="text-center text-gray-500 py-4">
                      Joining room...
                    </div>
                  ) : (
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) => {
                          setMessageText(e.target.value);
                          handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="submit"
                        disabled={!messageText.trim()}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send size={20} />
                        Send
                      </button>
                    </form>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MessageCircle size={64} className="mx-auto text-gray-300 mb-4" />
                  <p>Select a room to start chatting</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
