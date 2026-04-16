import { useState, useEffect } from 'react';
import { Heart, Send, MessageSquare, Upload, X, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { apiService } from '../services/api';

interface CrushPost {
  id: string;
  gender: string;
  name?: string;
  age?: string;
  major?: string;
  year?: string;
  description: string;
  photo?: string;
  contactInfo?: string;
  timestamp: number;
  votes: number;
  comments: Comment[];
}

interface Comment {
  id: string;
  text: string;
  timestamp: number;
  author: string;
  anonymous: boolean;
}

const CrushFinderPage = () => {
  const [posts, setPosts] = useState<CrushPost[]>([]);
  const [gender, setGender] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAnonymous, setCommentAnonymous] = useState(true);
  const [commentAuthor, setCommentAuthor] = useState('');
  const [votedCrushes, setVotedCrushes] = useState<{ [key: string]: number }>({});

  const majors = [
    'Computer Science',
    'Engineering',
    'Business Administration',
    'Medicine',
    'Law',
    'Architecture',
    'Economics',
    'Marketing',
    'Psychology',
    'Communications',
    'Other',
  ];

  useEffect(() => {
    loadCrushes();
    
    const socket = apiService.initSocket();
    
    socket.on('new-crush', (crush: CrushPost) => {
      setPosts(prev => [crush, ...prev]);
    });
    
    socket.on('crush-voted', ({ id, votes }: { id: string; votes: number }) => {
      setPosts(prev => prev.map(p => p.id === id ? { ...p, votes } : p));
    });
    
    socket.on('crush-commented', ({ crushId, comment }: { crushId: string; comment: Comment }) => {
      setPosts(prev => prev.map(p => 
        p.id === crushId ? { ...p, comments: [...p.comments, comment] } : p
      ));
    });

    const storedVotes = localStorage.getItem('uir-voted-crushes');
    if (storedVotes) {
      setVotedCrushes(JSON.parse(storedVotes));
    }
    
    return () => {
      socket.off('new-crush');
      socket.off('crush-voted');
      socket.off('crush-commented');
    };
  }, []);

  const loadCrushes = async () => {
    try {
      const data = await apiService.getCrushes();
      setPosts(data);
    } catch (error) {
      console.error('Failed to load crushes:', error);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gender || !description.trim()) return;

    try {
      await apiService.createCrush({
        gender,
        name: name.trim() || null,
        age: age.trim() || null,
        major: major || null,
        year: year || null,
        description: description.trim(),
        photo: photoPreview || null,
        contactInfo: contactInfo.trim() || null
      });

      setGender('');
      setName('');
      setAge('');
      setMajor('');
      setYear('');
      setDescription('');
      setContactInfo('');
      setPhotoPreview(null);
    } catch (error) {
      console.error('Failed to create crush post:', error);
    }
  };

  const handleVote = async (crushId: string, delta: number) => {
    const currentVote = votedCrushes[crushId] || 0;
    
    if ((delta > 0 && currentVote > 0) || (delta < 0 && currentVote < 0)) {
      return;
    }

    try {
      const actualDelta = currentVote !== 0 ? delta * 2 : delta;
      await apiService.voteCrush(crushId, actualDelta);
      
      const newVotedCrushes = { ...votedCrushes, [crushId]: delta };
      setVotedCrushes(newVotedCrushes);
      localStorage.setItem('uir-voted-crushes', JSON.stringify(newVotedCrushes));
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleAddComment = async (crushId: string) => {
    if (!commentText.trim()) return;

    try {
      await apiService.commentOnCrush(crushId, {
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-red-500" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Find Your Crush</h2>
        </div>
        <p className="text-gray-600 mb-6">
          Describe the person you're looking for and let the community help you connect!
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name (if known)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age Range
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 20-22"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Major
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select major</option>
                {majors.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5+">5th Year+</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Contact Info
              </label>
              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Instagram, Email, etc."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the person, where you saw them, what they were wearing, etc."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo (optional)
            </label>
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-48 h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setPhotoPreview(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                <div className="text-center">
                  <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500">Click to upload a photo</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-red-600 transition flex items-center justify-center gap-2"
          >
            <Heart size={20} />
            Post Crush Request
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Heart className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500">No crush requests yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleVote(post.id, 1)}
                    className={`p-1 rounded hover:bg-gray-100 transition ${
                      votedCrushes[post.id] === 1 ? 'text-blue-600' : 'text-gray-400'
                    }`}
                    disabled={votedCrushes[post.id] === 1}
                  >
                    <ArrowUp size={20} />
                  </button>
                  <span className="font-semibold text-gray-700">{post.votes}</span>
                  <button
                    onClick={() => handleVote(post.id, -1)}
                    className={`p-1 rounded hover:bg-gray-100 transition ${
                      votedCrushes[post.id] === -1 ? 'text-red-600' : 'text-gray-400'
                    }`}
                    disabled={votedCrushes[post.id] === -1}
                  >
                    <ArrowDown size={20} />
                  </button>
                </div>

                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    {post.photo && (
                      <img
                        src={post.photo}
                        alt="Crush"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Heart className="text-red-500" size={20} />
                        <span className="font-semibold text-gray-900">
                          Looking for: {post.gender.charAt(0).toUpperCase() + post.gender.slice(1)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {post.name && (
                          <div>
                            <span className="font-medium">Name:</span> {post.name}
                          </div>
                        )}
                        {post.age && (
                          <div>
                            <span className="font-medium">Age:</span> {post.age}
                          </div>
                        )}
                        {post.major && (
                          <div>
                            <span className="font-medium">Major:</span> {post.major}
                          </div>
                        )}
                        {post.year && (
                          <div>
                            <span className="font-medium">Year:</span> {post.year}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 whitespace-pre-wrap">{post.description}</p>

                  {post.contactInfo && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                      <span className="text-sm font-medium text-blue-900">Contact: </span>
                      <span className="text-sm text-blue-700">{post.contactInfo}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>{format(post.timestamp, 'MMM d, yyyy HH:mm')}</span>
                    <button
                      onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition ml-auto"
                    >
                      <MessageSquare size={16} />
                      <span>{post.comments.length} Comments</span>
                    </button>
                  </div>

                  {selectedPost === post.id && (
                    <div className="border-t pt-4 mt-4">
                      <div className="space-y-4 mb-4">
                        {post.comments.map((comment) => (
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
                          onClick={() => handleAddComment(post.id)}
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

export default CrushFinderPage;
