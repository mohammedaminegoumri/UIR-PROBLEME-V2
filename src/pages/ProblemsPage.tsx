// src/pages/SubmitProblem.tsx
import { useState, useEffect } from 'react';
import { problemService } from '../services/firebaseService';
import { format } from 'date-fns';

const SubmitProblem = () => {
  const [problems, setProblems] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProblem, setNewProblem] = useState({
    category: 'Academic',
    title: '',
    description: '',
    anonymous: false,
    authorName: ''
  });

  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

  // Charger les problèmes
  useEffect(() => {
    const loadProblems = async () => {
      const data = await problemService.getProblems();
      setProblems(data);
    };
    loadProblems();
  }, []);

  const handleSubmitProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProblem.title || !newProblem.description) return;

    const problemData = {
      ...newProblem,
      timestamp: Date.now(),
      votes: 0,
      comments: []
    };

    await problemService.createProblem(problemData);
    setNewProblem({ category: 'Academic', title: '', description: '', anonymous: false, authorName: '' });
    setShowForm(false);

    const updated = await problemService.getProblems();
    setProblems(updated);
  };

  const handleAddComment = async (problemId: string) => {
    const text = commentInputs[problemId];
    if (!text || !text.trim()) return;

    const comment = {
      text: text.trim(),
      author: newProblem.anonymous ? 'Anonyme' : (newProblem.authorName || 'Utilisateur'),
      anonymous: newProblem.anonymous
    };

    await problemService.addComment(problemId, comment);

    // Rafraîchir les problèmes
    const updated = await problemService.getProblems();
    setProblems(updated);
    setCommentInputs({ ...commentInputs, [problemId]: '' });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Problems</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-blue-700"
        >
          + Soumettre un Problème
        </button>
      </div>

      {/* Formulaire de soumission */}
      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow mb-8">
          <form onSubmit={handleSubmitProblem} className="space-y-4">
            <select 
              value={newProblem.category} 
              onChange={(e) => setNewProblem({...newProblem, category: e.target.value})}
              className="w-full p-3 border rounded-xl"
            >
              <option>Academic</option>
              <option>Administrative</option>
              <option>Student Life</option>
              <option>Other</option>
            </select>

            <input 
              type="text" 
              placeholder="Titre du problème" 
              value={newProblem.title}
              onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
              className="w-full p-4 border rounded-2xl"
            />

            <textarea 
              placeholder="Description détaillée..." 
              value={newProblem.description}
              onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
              className="w-full p-4 border rounded-2xl h-40"
            />

            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={newProblem.anonymous}
                onChange={(e) => setNewProblem({...newProblem, anonymous: e.target.checked})}
              />
              <label className="text-sm">Poster anonymement</label>
            </div>

            {!newProblem.anonymous && (
              <input 
                type="text" 
                placeholder="Ton nom (optionnel)" 
                value={newProblem.authorName}
                onChange={(e) => setNewProblem({...newProblem, authorName: e.target.value})}
                className="w-full p-4 border rounded-2xl"
              />
            )}

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl">Soumettre le Problème</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 py-4 rounded-2xl">Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des problèmes avec commentaires */}
      <div className="space-y-6">
        {problems.map((problem) => (
          <div key={problem.id} className="bg-white p-6 rounded-3xl shadow">
            <div className="flex justify-between mb-3">
              <span className="px-4 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">{problem.category}</span>
              <span className="text-xs text-gray-500">
                {problem.timestamp?.toDate ? format(problem.timestamp.toDate(), 'dd/MM/yyyy HH:mm') : ''}
              </span>
            </div>

            <h3 className="font-bold text-xl">{problem.title}</h3>
            <p className="text-gray-700 mt-2">{problem.description}</p>
            <p className="text-xs text-gray-500 mt-4">
              {problem.anonymous ? 'Anonyme' : problem.authorName || 'Utilisateur'}
            </p>

            {/* Section Commentaires */}
            <div className="mt-8 border-t pt-6">
              <h4 className="font-semibold mb-3">Commentaires ({problem.comments?.length || 0})</h4>
              
              {problem.comments && problem.comments.map((comment: any) => (
                <div key={comment.id} className="mb-4 pl-4 border-l-2 border-gray-200">
                  <p className="text-sm">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {comment.anonymous ? 'Anonyme' : comment.author} • {comment.timestamp?.toDate ? format(comment.timestamp.toDate(), 'HH:mm') : ''}
                  </p>
                </div>
              ))}

              {/* Ajouter un commentaire */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={commentInputs[problem.id] || ''}
                  onChange={(e) => setCommentInputs({...commentInputs, [problem.id]: e.target.value})}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 px-4 py-3 border rounded-2xl text-sm"
                />
                <button
                  onClick={() => handleAddComment(problem.id)}
                  className="bg-gray-800 text-white px-6 rounded-2xl text-sm"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitProblem;
