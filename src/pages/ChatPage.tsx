import { useState, useEffect, useRef } from 'react';
import { Send, Users, Plus, MessageCircle, Smile } from 'lucide-react';
import { format } from 'date-fns';
import { chatService } from '../services/firebaseService';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: any;
}

const ChatPage = () => {
  const [rooms, setRooms] = useState<any[]>([]);
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

  useEffect(() => {
    chatService.getRooms().then(setRooms);
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    if (unsubscribeRef.current) unsubscribeRef.current();

    unsubscribeRef.current = chatService.subscribeToRoom(activeRoom, (newMessages) => {
      setMessages(newMessages);
    });

    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [activeRoom]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeRoom || !username) return;

    await chatService.sendMessage(activeRoom, username, messageText.trim());
    setMessageText('');
    setShowEmojiPicker(false);
  };

  const insertEmoji = (emoji: string) => {
    setMessageText(prev => prev + emoji);
  };

  return (
    <div className="max-w-7xl mx-auto h-screen flex flex-col bg-gray-50 p-4">
      <div className="flex-1 flex overflow-hidden rounded-3xl shadow-2xl border border-gray-200 bg-white">
        {/* Sidebar des rooms */}
        <div className="w-72 border-r border-gray-200 flex flex-col">
          {/* ... (je garde la sidebar simple pour l'instant) */}
          <div className="flex-1 overflow-y-auto p-2">
            {rooms.map(room => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`w-full p-4 text-left hover:bg-gray-50 rounded-xl mb-1 ${activeRoom === room.id ? 'bg-blue-100' : ''}`}
              >
                {room.name}
              </button>
            ))}
          </div>
        </div>

        {/* Zone principale du chat */}
        <div className="flex-1 flex flex-col">
          {activeRoom ? (
            <>
              <div className="p-4 border-b font-bold text-lg">Room : {rooms.find(r => r.id === activeRoom)?.name}</div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-5 py-3 rounded-3xl ${msg.username === username ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                      <div className="text-xs mb-1 opacity-70">
                        {msg.username} • {msg.timestamp?.toDate ? format(msg.timestamp.toDate(), 'HH:mm') : '??:??'}
                      </div>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Écris un message..."
                  className="flex-1 px-5 py-4 bg-gray-100 rounded-3xl focus:outline-none"
                />
                <button type="submit" className="bg-blue-600 text-white px-8 rounded-3xl">Envoyer</button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Sélectionne une room
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
