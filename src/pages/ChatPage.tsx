import { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, MessageCircle, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { chatService } from '../services/firebaseService';

interface ChatRoom {
  id: string;
  name: string;
  createdAt: any;
}

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: any;
}

const ChatPage = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('');
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const emojis = ['😀', '😂', '❤️', '👍', '👋', '🎉', '🔥', '🙌', '😍', '🥳'];

  // Charger les rooms
  useEffect(() => {
    chatService.getRooms().then(setRooms);
  }, []);

  // Écouter les messages en temps réel
  useEffect(() => {
    if (!activeRoom) return;
    if (unsubscribeRef.current) unsubscribeRef.current();

    unsubscribeRef.current = chatService.subscribeToRoom(activeRoom, (msgs) => {
      setMessages(msgs);
    });

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [activeRoom]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    await chatService.createRoom(newRoomName.trim());
    setNewRoomName('');
    setShowNewRoomForm(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom || !username) return;

    await chatService.sendMessage(activeRoom, username, messageText.trim());
    setMessageText('');
    setShowEmojiPicker(false);
  };

  const insertEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
  };

  const activeRoomData = rooms.find((r) => r.id === activeRoom);

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col bg-gray-50 p-4">
      <div className="flex-1 flex overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-white">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b">
            <button
              onClick={() => setShowNewRoomForm(!showNewRoomForm)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Nouvelle Room
            </button>
          </div>

          {!username && (
            <div className="p-4 border-b bg-amber-50">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ton pseudonyme..."
                className="w-full px-4 py-3 border border-amber-300 rounded-2xl"
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2">
            {rooms.length === 0 ? (
              <div className="text-center text-gray-400 mt-10">
                <MessageCircle size={50} className="mx-auto mb-3 opacity-30" />
                <p>Aucune room pour l'instant</p>
                <p className="text-sm">Crée la première !</p>
              </div>
            ) : (
              rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoom(room.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 rounded-xl mb-1 transition-all ${
                    activeRoom === room.id ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="font-semibold">{room.name}</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {activeRoom && activeRoomData ? (
            <>
              <div className="px-6 py-4 border-b bg-gray-50 flex justify-between">
                <h2 className="font-bold text-xl">{activeRoomData.name}</h2>
                <div className="text-blue-600">Toi : {username}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-5 py-3 rounded-3xl ${
                      msg.username === username ? 'bg-blue-600 text-white' : 'bg-white shadow-sm border'
                    }`}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">
                          {msg.username === username ? 'Toi' : msg.username}
                        </span>
                        <span className="text-gray-400">
                          {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'HH:mm') : '??:??'}
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t bg-white flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-3 hover:bg-gray-100 rounded-2xl"
                >
                  <Smile size={28} />
                </button>

                {showEmojiPicker && (
                  <div className="absolute bottom-20 left-6 bg-white border shadow-xl rounded-2xl p-3 grid grid-cols-6 gap-2 z-50">
                    {emojis.map((emoji) => (
                      <button key={emoji} onClick={() => insertEmoji(emoji)} className="text-3xl hover:scale-125">
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écris un message..."
                  className="flex-1 px-6 py-4 bg-gray-100 rounded-3xl focus:outline-none"
                />

                <button type="submit" className="bg-blue-600 text-white px-8 rounded-3xl hover:bg-blue-700">
                  Envoyer
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={80} className="mx-auto mb-6 opacity-20" />
                <p className="text-xl">Sélectionne une room pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
