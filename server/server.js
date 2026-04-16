
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize SQLite database (use /data for Railway persistent volume, fallback to local)
import { existsSync, mkdirSync } from 'fs';
const DATA_DIR = process.env.RAILWAY_VOLUME_MOUNT_PATH || __dirname;
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(join(DATA_DIR, 'uir_problemes.db'));

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS problems (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    anonymous BOOLEAN NOT NULL,
    authorName TEXT,
    timestamp INTEGER NOT NULL,
    votes INTEGER DEFAULT 0,
    comments TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS crushes (
    id TEXT PRIMARY KEY,
    gender TEXT NOT NULL,
    name TEXT,
    age TEXT,
    major TEXT,
    year TEXT,
    description TEXT NOT NULL,
    photo TEXT,
    contactInfo TEXT,
    timestamp INTEGER NOT NULL,
    votes INTEGER DEFAULT 0,
    comments TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS chat_rooms (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    createdAt INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id TEXT PRIMARY KEY,
    roomId TEXT NOT NULL,
    username TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    FOREIGN KEY (roomId) REFERENCES chat_rooms(id)
  );

  CREATE TABLE IF NOT EXISTS forum_threads (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    likes INTEGER DEFAULT 0,
    replies TEXT DEFAULT '[]'
  );

  CREATE TABLE IF NOT EXISTS active_users (
    roomId TEXT NOT NULL,
    username TEXT NOT NULL,
    socketId TEXT NOT NULL,
    joinedAt INTEGER NOT NULL,
    PRIMARY KEY (roomId, username)
  );
`);

// Prepared statements for better performance
const insertProblem = db.prepare(`
  INSERT INTO problems (id, category, title, description, anonymous, authorName, timestamp, votes, comments)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertCrush = db.prepare(`
  INSERT INTO crushes (id, gender, name, age, major, year, description, photo, contactInfo, timestamp, votes, comments)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertChatRoom = db.prepare(`
  INSERT INTO chat_rooms (id, name, createdAt)
  VALUES (?, ?, ?)
`);

const insertChatMessage = db.prepare(`
  INSERT INTO chat_messages (id, roomId, username, message, timestamp)
  VALUES (?, ?, ?, ?, ?)
`);

const updateProblemVotes = db.prepare(`
  UPDATE problems SET votes = votes + ? WHERE id = ?
`);

const updateCrushVotes = db.prepare(`
  UPDATE crushes SET votes = votes + ? WHERE id = ?
`);

const updateProblemComments = db.prepare(`
  UPDATE problems SET comments = ? WHERE id = ?
`);

const updateCrushComments = db.prepare(`
  UPDATE crushes SET comments = ? WHERE id = ?
`);

// REST API Endpoints

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Get all problems
app.get('/api/problems', (req, res) => {
  const problems = db.prepare('SELECT * FROM problems ORDER BY timestamp DESC').all();
  res.json(problems.map(p => ({
    ...p,
    anonymous: Boolean(p.anonymous),
    comments: JSON.parse(p.comments)
  })));
});

// Get all crushes
app.get('/api/crushes', (req, res) => {
  const crushes = db.prepare('SELECT * FROM crushes ORDER BY timestamp DESC').all();
  res.json(crushes.map(c => ({
    ...c,
    comments: JSON.parse(c.comments)
  })));
});

// Get all chat rooms
app.get('/api/chat-rooms', (req, res) => {
  const rooms = db.prepare('SELECT * FROM chat_rooms ORDER BY createdAt DESC').all();
  res.json(rooms);
});

// Get chat messages for a room
app.get('/api/chat-messages/:roomId', (req, res) => {
  const messages = db.prepare('SELECT * FROM chat_messages WHERE roomId = ? ORDER BY timestamp ASC')
    .all(req.params.roomId);
  res.json(messages);
});

// Create a problem
app.post('/api/problems', (req, res) => {
  const { category, title, description, anonymous, authorName } = req.body;
  const id = uuidv4();
  const timestamp = Date.now();
  
  insertProblem.run(id, category, title, description, anonymous ? 1 : 0, authorName || null, timestamp, 0, '[]');
  
  const problem = {
    id,
    category,
    title,
    description,
    anonymous,
    authorName,
    timestamp,
    votes: 0,
    comments: []
  };
  
  io.emit('new-problem', problem);
  res.json(problem);
});

// Create a crush request
app.post('/api/crushes', (req, res) => {
  const { gender, name, age, major, year, description, photo, contactInfo } = req.body;
  const id = uuidv4();
  const timestamp = Date.now();
  
  insertCrush.run(id, gender, name || null, age || null, major || null, year || null, description, photo || null, contactInfo || null, timestamp, 0, '[]');
  
  const crush = {
    id,
    gender,
    name,
    age,
    major,
    year,
    description,
    photo,
    contactInfo,
    timestamp,
    votes: 0,
    comments: []
  };
  
  io.emit('new-crush', crush);
  res.json(crush);
});

// Create a chat room
app.post('/api/chat-rooms', (req, res) => {
  const { name } = req.body;
  const id = uuidv4();
  const createdAt = Date.now();
  
  insertChatRoom.run(id, name, createdAt);
  
  const room = { id, name, createdAt };
  io.emit('new-room', room);
  res.json(room);
});

// Forum endpoints
app.get('/api/forum-threads', (req, res) => {
  const threads = db.prepare('SELECT * FROM forum_threads ORDER BY timestamp DESC').all();
  res.json(threads.map(t => ({ ...t, replies: JSON.parse(t.replies) })));
});

app.post('/api/forum-threads', (req, res) => {
  const { category, subcategory, title, content, author } = req.body;
  const id = uuidv4();
  const timestamp = Date.now();
  db.prepare('INSERT INTO forum_threads (id, category, subcategory, title, content, author, timestamp, likes, replies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(id, category, subcategory, title, content, author, timestamp, 0, '[]');
  const thread = { id, category, subcategory, title, content, author, timestamp, likes: 0, replies: [] };
  io.emit('new-forum-thread', thread);
  res.json(thread);
});

app.post('/api/forum-threads/:id/like', (req, res) => {
  db.prepare('UPDATE forum_threads SET likes = likes + 1 WHERE id = ?').run(req.params.id);
  const thread = db.prepare('SELECT likes FROM forum_threads WHERE id = ?').get(req.params.id);
  io.emit('forum-thread-liked', { id: req.params.id, likes: thread.likes });
  res.json({ likes: thread.likes });
});

app.post('/api/forum-threads/:id/reply', (req, res) => {
  const { content, author } = req.body;
  const thread = db.prepare('SELECT * FROM forum_threads WHERE id = ?').get(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  const replies = JSON.parse(thread.replies);
  const newReply = { id: uuidv4(), content, author, timestamp: Date.now(), likes: 0 };
  replies.push(newReply);
  db.prepare('UPDATE forum_threads SET replies = ? WHERE id = ?').run(JSON.stringify(replies), req.params.id);
  io.emit('forum-reply-added', { threadId: req.params.id, reply: newReply });
  res.json(newReply);
});

// Vote on problem
app.post('/api/problems/:id/vote', (req, res) => {
  const { delta } = req.body;
  updateProblemVotes.run(delta, req.params.id);
  
  const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(req.params.id);
  io.emit('problem-voted', { id: req.params.id, votes: problem.votes });
  res.json({ votes: problem.votes });
});

// Vote on crush
app.post('/api/crushes/:id/vote', (req, res) => {
  const { delta } = req.body;
  updateCrushVotes.run(delta, req.params.id);
  
  const crush = db.prepare('SELECT * FROM crushes WHERE id = ?').get(req.params.id);
  io.emit('crush-voted', { id: req.params.id, votes: crush.votes });
  res.json({ votes: crush.votes });
});

// Add comment to problem
app.post('/api/problems/:id/comment', (req, res) => {
  const { text, author, anonymous } = req.body;
  const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(req.params.id);
  
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  
  const comments = JSON.parse(problem.comments);
  const newComment = {
    id: uuidv4(),
    text,
    author,
    anonymous,
    timestamp: Date.now()
  };
  
  comments.push(newComment);
  updateProblemComments.run(JSON.stringify(comments), req.params.id);
  
  io.emit('problem-commented', { problemId: req.params.id, comment: newComment });
  res.json(newComment);
});

// Add comment to crush
app.post('/api/crushes/:id/comment', (req, res) => {
  const { text, author, anonymous } = req.body;
  const crush = db.prepare('SELECT * FROM crushes WHERE id = ?').get(req.params.id);
  
  if (!crush) {
    return res.status(404).json({ error: 'Crush not found' });
  }
  
  const comments = JSON.parse(crush.comments);
  const newComment = {
    id: uuidv4(),
    text,
    author,
    anonymous,
    timestamp: Date.now()
  };
  
  comments.push(newComment);
  updateCrushComments.run(JSON.stringify(comments), req.params.id);
  
  io.emit('crush-commented', { crushId: req.params.id, comment: newComment });
  res.json(newComment);
});

// Socket.IO for real-time chat
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', ({ roomId, username }) => {
    socket.join(roomId);
    
    // Add user to active users
    db.prepare(`
      INSERT OR REPLACE INTO active_users (roomId, username, socketId, joinedAt)
      VALUES (?, ?, ?, ?)
    `).run(roomId, username, socket.id, Date.now());
    
    // Get all active users in the room
    const activeUsers = db.prepare('SELECT username FROM active_users WHERE roomId = ?').all(roomId);
    
    io.to(roomId).emit('user-joined', { username, users: activeUsers.map(u => u.username) });
    socket.emit('room-joined', { roomId });
  });

  socket.on('send-message', ({ roomId, username, message }) => {
    const id = uuidv4();
    const timestamp = Date.now();
    
    insertChatMessage.run(id, roomId, username, message, timestamp);
    
    const messageData = { id, roomId, username, message, timestamp };
    io.to(roomId).emit('receive-message', messageData);
  });

  socket.on('typing', ({ roomId, username }) => {
    socket.to(roomId).emit('user-typing', { username });
  });

  socket.on('leave-room', ({ roomId, username }) => {
    socket.leave(roomId);
    
    // Remove user from active users
    db.prepare('DELETE FROM active_users WHERE roomId = ? AND socketId = ?').run(roomId, socket.id);
    
    // Get remaining active users
    const activeUsers = db.prepare('SELECT username FROM active_users WHERE roomId = ?').all(roomId);
    
    io.to(roomId).emit('user-left', { username, users: activeUsers.map(u => u.username) });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all rooms
    const userRooms = db.prepare('SELECT roomId, username FROM active_users WHERE socketId = ?').all(socket.id);
    
    userRooms.forEach(({ roomId, username }) => {
      db.prepare('DELETE FROM active_users WHERE socketId = ?').run(socket.id);
      
      const activeUsers = db.prepare('SELECT username FROM active_users WHERE roomId = ?').all(roomId);
      io.to(roomId).emit('user-left', { username, users: activeUsers.map(u => u.username) });
    });
  });
});

const PORT = process.env.PORT || 3001;
// === ADD THIS BLOCK FOR PRODUCTION FRONTEND SERVING ===
import { join } from 'path';   // (already at the top, just make sure)

// Serve static React build files
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT === 'production';
if (isProduction) {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));

  // Important: Catch-all route for React Router (SPA)
  app.get('*', (req, res) => {
    res.sendFile(join(distPath, 'index.html'));
  });
}
// ======================================================
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
