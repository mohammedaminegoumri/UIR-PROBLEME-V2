import { useState, useEffect } from 'react';
import { Users, Send, ThumbsUp, MessageSquare, Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';

interface Reply {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  likes: number;
}

interface ForumThread {
  id: string;
  category: string;
  subcategory: string;
  title: string;
  content: string;
  author: string;
  timestamp: number;
  replies: Reply[];
  likes: number;
}

const categories = [
  { name: 'Academic', subcategories: ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law', 'General'] },
  { name: 'Student Life', subcategories: ['Campus Events', 'Housing', 'Transportation', 'Food & Dining', 'General'] },
  { name: 'Administrative', subcategories: ['Registration', 'Financial Aid', 'Graduation', 'General'] },
  { name: 'Year Groups', subcategories: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', 'Graduate'] },
  { name: 'General Discussion', subcategories: ['Off-Topic', 'Advice', 'Success Stories', 'General'] },
];

const generatePseudonym = () => {
  const adj = ['Smart', 'Curious', 'Helpful', 'Kind', 'Brave', 'Wise', 'Friendly', 'Creative'];
  const noun = ['Student', 'Scholar', 'Learner', 'Thinker', 'Helper', 'Friend', 'Mate', 'Peer'];
  return `${adj[Math.floor(Math.random() * adj.length)]}${noun[Math.floor(Math.random() * noun.length)]}${Math.floor(Math.random() * 999)}`;
};

const ForumPage = () => {
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadCategory, setNewThreadCategory] = useState('');
  const [newThreadSubcategory, setNewThreadSubcategory] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiService.getForumThreads().then(data => {
      setThreads(data);
      setLoading(false);
    }).catch(() => setLoading(false));

    const socket = apiService.initSocket();

    socket.on('new-forum-thread', (thread: ForumThread) => {
      setThreads(prev => [thread, ...prev]);
    });

    socket.on('forum-thread-liked', ({ id, likes }: { id: string; likes: number }) => {
      setThreads(prev => prev.map(t => t.id === id ? { ...t, likes } : t));
    });

    socket.on('forum-reply-added', ({ threadId, reply }: { threadId: string; reply: Reply }) => {
      setThreads(prev => prev.map(t =>
        t.id === threadId ? { ...t, replies: [...t.replies, reply] } : t
      ));
    });

    return () => {
      socket.off('new-forum-thread');
      socket.off('forum-thread-liked');
      socket.off('forum-reply-added');
    };
  }, []);

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !newThreadCategory || !newThreadSubcategory) return;
    try {
      await apiService.createForumThread({
        category: newThreadCategory,
        subcategory: newThreadSubcategory,
        title: newThreadTitle.trim(),
        content: newThreadContent.trim(),
        author: generatePseudonym(),
      });
      setNewThreadTitle(''); setNewThreadContent(''); setNewThreadCategory(''); setNewThreadSubcategory('');
      setShowNewThread(false);
    } catch (err) { console.error(err); }
  };

  const handleAddReply = async (threadId: string) => {
    if (!replyContent.trim()) return;
    try {
      await apiService.replyToForumThread(threadId, { content: replyContent.trim(), author: generatePseudonym() });
      setReplyContent('');
    } catch (err) { console.error(err); }
  };

  const handleLikeThread = async (threadId: string) => {
    try { await apiService.likeForumThread(threadId); } catch (err) { console.error(err); }
  };

  const filteredThreads = selectedCategory ? threads.filter(t => t.category === selectedCategory) : threads;
  const currentCategory = categories.find(c => c.name === newThreadCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center gap-3">
          <Users className="h-10 w-10 text-purple-600" />
          University Forum
        </h1>
        <p className="text-lg text-gray-600">Organized discussions by major, year, and topic. Connect with fellow students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
            <button onClick={() => setShowNewThread(true)} className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mb-4">
              <Plus className="h-5 w-5" /> New Thread
            </button>
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              <button onClick={() => setSelectedCategory(null)} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>All Topics</button>
              {categories.map(cat => (
                <button key={cat.name} onClick={() => setSelectedCategory(cat.name)} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.name ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}>{cat.name}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          {showNewThread && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Thread</h3>
              <form onSubmit={handleCreateThread}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select value={newThreadCategory} onChange={(e) => { setNewThreadCategory(e.target.value); setNewThreadSubcategory(''); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" required>
                      <option value="">Select category...</option>
                      {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Subcategory</label>
                    <select value={newThreadSubcategory} onChange={(e) => setNewThreadSubcategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" disabled={!newThreadCategory} required>
                      <option value="">Select subcategory...</option>
                      {currentCategory?.subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thread Title</label>
                  <input type="text" value={newThreadTitle} onChange={(e) => setNewThreadTitle(e.target.value)} placeholder="Enter thread title..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent" maxLength={100} required />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
                  <textarea value={newThreadContent} onChange={(e) => setNewThreadContent(e.target.value)} placeholder="Write your post..." rows={6} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none" maxLength={2000} required />
                  <p className="text-sm text-gray-500 mt-1">{newThreadContent.length}/2000 characters</p>
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">Post Thread</button>
                  <button type="button" onClick={() => setShowNewThread(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading threads...</div>
          ) : filteredThreads.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No threads yet. Start a discussion!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <div key={thread.id} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-2 mb-3">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">{thread.category}</span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">{thread.subcategory}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{thread.title}</h3>
                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                    {selectedThread === thread.id ? thread.content : thread.content.length > 200 ? thread.content.substring(0, 200) + '...' : thread.content}
                  </p>
                  {thread.content.length > 200 && selectedThread !== thread.id && (
                    <button onClick={() => setSelectedThread(thread.id)} className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center gap-1 mb-3">
                      Read more <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="font-semibold">{thread.author}</span>
                    <span>•</span>
                    <span>{format(new Date(thread.timestamp), 'MMM d, yyyy HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                    <button onClick={() => handleLikeThread(thread.id)} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <ThumbsUp className="h-5 w-5" /><span className="font-semibold">{thread.likes}</span>
                    </button>
                    <button onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)} className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                      <MessageSquare className="h-5 w-5" /><span className="font-semibold">{thread.replies.length}</span>
                    </button>
                  </div>

                  {selectedThread === thread.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-4">Replies</h4>
                      <div className="space-y-4 mb-4">
                        {thread.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-semibold text-gray-900">{reply.author}</span>
                              <span className="text-sm text-gray-500">{format(new Date(reply.timestamp), 'MMM d, HH:mm')}</span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <textarea value={replyContent} onChange={(e) => setReplyContent(e.target.value)} placeholder="Write a reply..." rows={3} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none" />
                        <button onClick={() => handleAddReply(thread.id)} disabled={!replyContent.trim()} className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2">
                          <Send className="h-4 w-4" /> Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumPage;
