// src/pages/CrushFinder.tsx
import { useState, useEffect } from 'react';
import { crushService } from '../services/firebaseService';
import { format } from 'date-fns';

const CrushFinder = () => {
  const [crushes, setCrushes] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newCrush, setNewCrush] = useState({
    gender: 'Fille',
    name: '',
    age: '',
    major: '',
    year: '',
    description: '',
    photo: '',
    contactInfo: ''
  });

  useEffect(() => {
    const loadCrushes = async () => {
      const data = await crushService.getCrushes();
      setCrushes(data);
    };
    loadCrushes();
  }, []);

  const handleCreateCrush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCrush.description) return;

    await crushService.createCrush(newCrush);
    setNewCrush({ gender: 'Fille', name: '', age: '', major: '', year: '', description: '', photo: '', contactInfo: '' });
    setShowForm(false);

    // Rafraîchir la liste
    const updated = await crushService.getCrushes();
    setCrushes(updated);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Crush Finder</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-700"
        >
          + Poster un Crush
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-3xl shadow mb-8">
          <form onSubmit={handleCreateCrush} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select value={newCrush.gender} onChange={(e) => setNewCrush({...newCrush, gender: e.target.value})} className="p-3 border rounded-xl">
                <option>Fille</option>
                <option>Garçon</option>
              </select>
              <input type="text" placeholder="Nom (optionnel)" value={newCrush.name} onChange={(e) => setNewCrush({...newCrush, name: e.target.value})} className="p-3 border rounded-xl" />
            </div>

            <input type="text" placeholder="Âge" value={newCrush.age} onChange={(e) => setNewCrush({...newCrush, age: e.target.value})} className="w-full p-3 border rounded-xl" />
            <input type="text" placeholder="Filière / Major" value={newCrush.major} onChange={(e) => setNewCrush({...newCrush, major: e.target.value})} className="w-full p-3 border rounded-xl" />
            <input type="text" placeholder="Année" value={newCrush.year} onChange={(e) => setNewCrush({...newCrush, year: e.target.value})} className="w-full p-3 border rounded-xl" />

            <textarea 
              placeholder="Description du crush..." 
              value={newCrush.description} 
              onChange={(e) => setNewCrush({...newCrush, description: e.target.value})} 
              className="w-full p-4 border rounded-2xl h-32"
            />

            <input type="text" placeholder="Contact (Instagram, numéro...)" value={newCrush.contactInfo} onChange={(e) => setNewCrush({...newCrush, contactInfo: e.target.value})} className="w-full p-3 border rounded-xl" />

            <div className="flex gap-3">
              <button type="submit" className="flex-1 bg-pink-600 text-white py-4 rounded-2xl">Poster le Crush</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-gray-200 py-4 rounded-2xl">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crushes.map(crush => (
          <div key={crush.id} className="bg-white p-6 rounded-3xl shadow hover:shadow-xl transition">
            <div className="text-sm text-pink-600 mb-2">{crush.gender} • {crush.age}</div>
            <h3 className="font-bold text-xl">{crush.name || 'Anonyme'}</h3>
            <p className="text-gray-600 mt-3 line-clamp-4">{crush.description}</p>
            {crush.major && <p className="text-sm text-gray-500 mt-4">📚 {crush.major} - {crush.year}</p>}
            {crush.contactInfo && <p className="text-sm text-blue-600 mt-2">📩 {crush.contactInfo}</p>}
            <div className="text-xs text-gray-400 mt-6">
              {format(crush.timestamp?.toDate?.() || Date.now(), 'dd/MM/yyyy HH:mm')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrushFinder;
