# Quick Start Guide - UIR PROBLEMES

## Running the Application

### Single Command (Easiest)

Open your terminal in the project folder and run:

```bash
npm run dev
```

This starts both the backend server and frontend client automatically.

**Access the website at:** `http://localhost:5173`

That's it! The application is now running with full real-time synchronization.

---

## What You Can Do Now

### 1. Submit Problems
- Go to "Problems" page
- Fill out the form with your problem
- Choose to post anonymously or with your name
- Click "Submit Problem"
- Watch it appear instantly on the page

### 2. Find Your Crush
- Go to "Crush Finder" page
- Fill out the characteristics of the person you're looking for
- Optionally upload a photo
- Add your contact info so they can reach you
- Click "Post Crush Request"

### 3. Chat Anonymously
- Go to "Chat" page
- Enter a pseudonym (nickname)
- Click "New Room" to create a chat room
- Or click on an existing room to join
- Start chatting with others in real-time

### 4. Test Real-Time Features

Open the website in **two browser windows** side by side:

1. In Window 1: Post a problem
2. In Window 2: Watch it appear automatically
3. In Window 2: Upvote the problem
4. In Window 1: See the vote count update
5. Try the same with chat - messages appear instantly!

---

## Data Persistence

All your data is saved automatically in a database file:
- Location: `server/uir_problemes.db`
- Even if you restart the server, all posts, votes, comments, and chat messages remain saved

---

## Stopping the Application

Press `Ctrl + C` (or `Cmd + C` on Mac) in the terminal to stop both server and client.

---

## Troubleshooting

### Port Already in Use
If you see an error about port 3001 or 5173 already in use:

1. Stop any other applications using these ports
2. Or change the ports in the configuration files

### Cannot Connect to Server
If the frontend can't connect to the backend:

1. Make sure `npm run dev` is running
2. Check that you see "Server running on port 3001" in the terminal
3. Refresh your browser

### Real-Time Updates Not Working
1. Check browser console for errors (F12 → Console tab)
2. Make sure both server and client are running
3. Try refreshing the page

---

## Next Steps

- Customize the styling in `src/index.css`
- Add more features to the platform
- Deploy to production (see README_UPDATED.md for instructions)
- Share with your university community!

---

## Files Overview

- `server/server.js` - Backend server with Socket.IO and database
- `src/pages/` - All page components (Problems, Crush Finder, Chat, etc.)
- `src/services/api.ts` - API service for communicating with backend
- `src/components/` - Reusable UI components

---

## Need Help?

Check the browser console (F12) and terminal for error messages. Most issues can be resolved by:

1. Restarting the server (`Ctrl+C` then `npm run dev` again)
2. Clearing browser cache
3. Deleting `server/uir_problemes.db` to reset the database
4. Running `npm install` again to ensure all dependencies are installed

---

**Enjoy your UIR PROBLEMES platform!**
