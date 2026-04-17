// src/pages/Forum.tsx
import { useState, useEffect } from 'react';
import { forumService } from '../services/firebaseService';
import { format } from 'date-fns';

const Forum = () => {
  const [threads, setThreads] = useState<any[]>([]);
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);
  const [newThread, setNewThread] = useState({
    category: 'Academic',
    subcategory: 'Engineering',
    title: '',
    content: '',
    author: ''
  });

  useEffect(() => {
    const loadThreads = async () => {
      const data = await forumService.getThreads();
      setThreads(data);
    };
    loadThreads();
  }, []);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThread.title || !newThread.content || !newThread.author) return;

    await forumService.createThread(newThread);
    setNewThread({ category: 'Academic', subcategory: 'Engineering', title: '', content: '', author: '' });
    setShowNewThreadForm(false);

    // Rafraîchir la liste
    const updated = await forumService.getThreads();
    setThreads(updated);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        <button
          onClick={() => setShowNewThreadForm(true)}
          className="bg-purple-600 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 hover:bg-purple-700"
        >
          + Nouveau Thread
        </button>
      </div>

      {showNewThreadForm && (
        <div className="bg-white p-6 rounded-3xl shadow mb-8">
          <form onSubmit={handleCreateThread}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label>Catégorie</label>
                <select value={newThread.category} onChange={(e) => setNewThread({...newThread, category: e.target.value})} className="w-full p-3 border rounded-xl">
                  <option>Academic</option>
                  <option>Student Life</option>
                  <option>Administrative</option>
                </select>
              </div>
              <div>
                <label>Sous-catégorie</label>
                <input type="text" value={newThread.subcategory} onChange={(e) => setNewThread({...newThread, subcategory: e.target.value})} className="w-full p-3 border rounded-xl" />
              </div>
            </div>

            <input
              type="text"
              placeholder="Titre du thread"
              value={newThread.title}
              onChange={(e) => setNewThread({...newThread, title: e.target.value})}
              className="w-full p-4 border rounded-2xl mb-4"
            />

            <textarea
              placeholder="Contenu..."
              value={newThread.content}
              onChange={(e) => setNewThread({...newThread, content: e.target.value})}
              className="w-full p-4 border rounded-2xl h-32 mb-4"
            />

            <input
              type="text"
              placeholder="Ton pseudo"
              value={newThread.author}
              onChange={(e) => setNewThread({...newThread, author: e.target.value})}
              className="w-full p-4 border rounded-2xl mb-6"
            />

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-green-600 text-white py-4 rounded-2xl">Poster le Thread</button>
              <button type="button" onClick={() => setShowNewThreadForm(false)} className="flex-1 bg-gray-200 py-4 rounded-2xl">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {threads.map(thread => (
          <div key={thread.id} className="bg-white p-6 rounded-3xl shadow hover:shadow-md transition">
            <div className="flex justify-between">
              <div>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">{thread.category}</span>
              </div>
              <span className="text-xs text-gray-500">{format(thread.timestamp?.toDate?.() || Date.now(), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <h3 className="font-bold text-xl mt-3 mb-2">{thread.title}</h3>
            <p className="text-gray-600 line-clamp-3">{thread.content}</p>
            <div className="mt-4 text-sm text-gray-500">Par : {thread.author}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
