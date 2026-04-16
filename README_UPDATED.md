# UIR PROBLEMES - Full-Stack Real-Time Platform

## What's New - Real-Time Synchronization

The platform now includes a complete backend server with real-time synchronization:

### New Features
- **Real-time updates**: All posts, votes, and comments sync instantly across all users
- **Persistent data**: All data is saved in a SQLite database
- **Live chat**: Real-time messaging with typing indicators and user presence
- **Vote tracking**: Votes are tracked locally to prevent duplicate voting
- **WebSocket support**: Instant updates using Socket.IO

## How to Run

### Development Mode (Recommended)

1. **Install dependencies** (if not already done):
```bash
npm install
```

2. **Start both server and client**:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:3001`
- Frontend client on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

### Running Server and Client Separately

If you prefer to run them separately:

**Terminal 1 - Server:**
```bash
npm run server
```

**Terminal 2 - Client:**
```bash
npm run client
```

## Testing Real-Time Features

To see real-time synchronization in action:

1. Open the website in **two different browser windows** (or browsers)
2. Try these actions:

### Test Problems Page
- Post a problem in one window
- Watch it appear instantly in the other window
- Upvote/downvote in one window
- See the vote count update in the other window
- Add a comment in one window
- Watch it appear in the other window

### Test Crush Finder
- Post a crush request in one window
- See it appear instantly in the other window
- Vote and comment to see real-time updates

### Test Chat
- Enter different pseudonyms in each window
- Create or join the same room in both windows
- Send messages from one window
- Watch them appear instantly in the other
- See typing indicators when someone is typing
- Watch user count update when people join/leave

## Database

All data is stored in `server/uir_problemes.db` using SQLite. The database includes:
- Problems with votes and comments
- Crush requests with votes and comments
- Chat rooms and messages
- Active user tracking for chat

The database file is automatically created when you first run the server.

## Environment Variables

You can customize the API URL by creating a `.env.local` file:

```
VITE_API_URL=http://localhost:3001
```

For production, change this to your production server URL.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

For production deployment, you'll need to:
1. Deploy the frontend (dist folder) to a static hosting service
2. Deploy the backend server to a Node.js hosting service
3. Update the `VITE_API_URL` environment variable to point to your production backend

## Technical Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Socket.IO Client for real-time updates
- React Router for navigation
- date-fns for date formatting

### Backend
- Express.js server
- Socket.IO for WebSocket connections
- SQLite with better-sqlite3 for database
- CORS enabled for cross-origin requests

## API Endpoints

### REST API
- `GET /api/problems` - Get all problems
- `POST /api/problems` - Create a problem
- `POST /api/problems/:id/vote` - Vote on a problem
- `POST /api/problems/:id/comment` - Comment on a problem
- `GET /api/crushes` - Get all crush requests
- `POST /api/crushes` - Create a crush request
- `POST /api/crushes/:id/vote` - Vote on a crush
- `POST /api/crushes/:id/comment` - Comment on a crush
- `GET /api/chat-rooms` - Get all chat rooms
- `POST /api/chat-rooms` - Create a chat room
- `GET /api/chat-messages/:roomId` - Get messages for a room

### WebSocket Events
- `new-problem` - Broadcast when a new problem is posted
- `problem-voted` - Broadcast when a problem is voted on
- `problem-commented` - Broadcast when a problem receives a comment
- `new-crush` - Broadcast when a new crush is posted
- `crush-voted` - Broadcast when a crush is voted on
- `crush-commented` - Broadcast when a crush receives a comment
- `new-room` - Broadcast when a new chat room is created
- `join-room` - User joins a chat room
- `leave-room` - User leaves a chat room
- `send-message` - User sends a message
- `receive-message` - Broadcast message to room
- `user-joined` - Broadcast when user joins room
- `user-left` - Broadcast when user leaves room
- `typing` - User is typing
- `user-typing` - Broadcast typing indicator

## Troubleshooting

### Server won't start
- Make sure port 3001 is not already in use
- Check that all dependencies are installed (`npm install`)

### Client can't connect to server
- Ensure the server is running
- Check the `VITE_API_URL` in your .env file
- Make sure CORS is properly configured

### Real-time updates not working
- Check that Socket.IO is connecting (check browser console)
- Ensure the server is running
- Try refreshing both browser windows

### Database errors
- Delete `server/uir_problemes.db` and restart the server to recreate it
- Ensure the server has write permissions in the server directory

## Features Overview

### Problems Board
- Submit academic, campus, or personal problems
- Vote on problems
- Comment and discuss solutions
- Anonymous or named posting
- Real-time updates

### Crush Finder
- Post requests to find someone
- Include photos and detailed descriptions
- Contact information sharing
- Community voting and commenting
- Real-time updates

### Anonymous Chat
- Multiple chat rooms
- Real-time messaging
- Typing indicators
- User presence tracking
- Pseudonym-based identity

### Forum (Coming Soon)
- Organized by academic subjects
- Threaded discussions
- Anonymous participation

## GDPR Compliance

The platform includes:
- Privacy Policy page
- Anonymous posting options
- No tracking cookies
- Data collection transparency
- User control over personal information

## Support

For issues or questions, please check the console logs in your browser's developer tools or the terminal where the server is running.
