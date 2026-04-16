import { useState, useEffect } from 'react';
import { Send, MessageSquare, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';

interface Problem {
  id: string;
  category: string;
  title: string;
  description: string;
  timestamp: number;
  votes: number;
  comments: Comment[];
  anonymous: boolean;
  authorName?: string;
}

interface Comment {
  id: string;
  text: string;
  timestamp: number;
  author: string;
  anonymous: boolean;
}

const ProblemsPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('academic');
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [anonymous, setAnonymous] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(true);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [votedProblems, setVotedProblems] = useState<{ [key: string]: number }>({});

  const categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'campus', label: 'Campus Life' },
    { value: 'personal', label: 'Personal' },
    { value: 'administrative', label: 'Administrative' },
    { value: 'housing', label: 'Housing' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    loadProblems();
    
    const socket = apiService.initSocket();
    
    socket.on('new-problem', (problem: Problem) => {
      setProblems(prev => [problem, ...prev]);
    });
    
    socket.on('problem-voted', ({ id, votes }: { id: string; votes: number }) => {
      setProblems(prev => prev.map(p => p.id === id ? { ...p, votes } : p));
    });
    
    socket.on('problem-commented', ({ problemId, comment }: { problemId: string; comment: Comment }) => {
      setProblems(prev => prev.map(p => 
        p.id === problemId ? { ...p, comments: [...p.comments, comment] } : p
      ));
    });

    const storedVotes = localStorage.getItem('uir-voted-problems');
    if (storedVotes) {
      setVotedProblems(JSON.parse(storedVotes));
    }
    
    return () => {
      socket.off('new-problem');
      socket.off('problem-voted');
      socket.off('problem-commented');
    };
  }, []);

  const loadProblems = async () => {
    try {
      const data = await apiService.getProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to load problems:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      await apiService.createProblem({
        category,
        title: title.trim(),
        description: description.trim(),
        anonymous,
        authorName: anonymous ? null : authorName.trim()
      });

      setTitle('');
      setDescription('');
      setCategory('academic');
      setAnonymous(true);
      setAuthorName('');
    } catch (error) {
      console.error('Failed to create problem:', error);
    }
  };

  const handleVote = async (problemId: string, delta: number) => {
    const currentVote = votedProblems[problemId] || 0;
    
    // Prevent voting in the same direction twice
    if ((delta > 0 && currentVote > 0) || (delta < 0 && currentVote < 0)) {
      return;
    }

    try {
      // If changing vote, delta should be doubled
      const actualDelta = currentVote !== 0 ? delta * 2 : delta;
      await apiService.voteProblem(problemId, actualDelta);
      
      const newVotedProblems = { ...votedProblems, [problemId]: delta };
      setVotedProblems(newVotedProblems);
      localStorage.setItem('uir-voted-problems', JSON.stringify(newVotedProblems));
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddComment = async (problemId: string) => {
    if (!commentText.trim()) return;

    try {
      await apiService.commentOnProblem(problemId, {
        text: commentText.trim(),
        author: commentAnonymous ? 'Anonymous' : commentAuthor.trim() || 'Anonymous',
        anonymous: commentAnonymous
      });

      setCommentText('');
      setCommentAnonymous(true);
      setCommentAuthor('');
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const filteredProblems = problems.filter(p =>
    (filterCategory === 'all' || p.category === filterCategory)
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submit a Problem</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of your problem"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain your problem in detail..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
              />
              <span className="text-sm text-gray-700">Post anonymously</span>
            </label>

            {!anonymous && (
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Send size={20} />
            Submit Problem
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} className="text-gray-600" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No problems posted yet. Be the first to share!</p>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <div key={problem.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(problem.id, 1)}
                    className={`p-1 rounded hover:bg-gray-100 transition ${
                      votedProblems[problem.id] === 1 ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    disabled={votedProblems[problem.id] === 1}
                  >
                    <ArrowUp size={20} />
                  </button>
                  <span className="font-semibold text-gray-700">{problem.votes}</span>
                  <button
                    onClick={() => handleVote(problem.id, -1)}
                    className={`p-1 rounded hover:bg-gray-100 transition ${
                      votedProblems[problem.id] === -1 ? 'text-red-600' : 'text-gray-400'
                    }`}
                    disabled={votedProblems[problem.id] === -1}
                  >
                    <ArrowDown size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2">
                        {categories.find(c => c.value === problem.category)?.label}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{problem.title}</h3>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{problem.description}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>
                      {problem.anonymous ? 'Anonymous' : problem.authorName || 'Anonymous'}
                    </span>
                    <span>•</span>
                    <span>{format(problem.timestamp, 'MMM d, yyyy HH:mm')}</span>
                    <button
                      onClick={() => setSelectedProblem(selectedProblem === problem.id ? null : problem.id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition ml-auto"
                    >
                      <MessageSquare size={16} />
                      <span>{problem.comments.length} Comments</span>
                    </button>
                  </div>

                  {selectedProblem === problem.id && (
                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-4 mb-4">
                        {problem.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700 mb-2">{comment.text}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{comment.anonymous ? 'Anonymous' : comment.author}</span>
                              <span>•</span>
                              <span>{format(comment.timestamp, 'MMM d, HH:mm')}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <textarea
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Write a comment..."
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />

                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={commentAnonymous}
                              onChange={(e) => setCommentAnonymous(e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                            />
                            <span className="text-sm text-gray-700">Comment anonymously</span>
                          </label>

                          {!commentAnonymous && (
                            <input
                              type="text"
                              value={commentAuthor}
                              onChange={(e) => setCommentAuthor(e.target.value)}
                              placeholder="Your name"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => handleAddComment(problem.id)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                        >
                          <Send size={16} />
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemsPage;
