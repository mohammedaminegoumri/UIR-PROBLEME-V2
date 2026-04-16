# Testing Guide - Real-Time Synchronization

## Before You Start

Make sure the application is running:
```bash
npm run dev
```

You should see:
- ✅ Server running on port 3001
- ✅ Vite dev server running on localhost:5173

---

## Test 1: Problems Page - Real-Time Updates

### Setup
1. Open TWO browser windows side by side
2. Both at `http://localhost:5173/problems`

### Test Steps

**Window 1:**
1. Click on "Problems" in navigation
2. Fill out the form:
   - Category: Academic
   - Title: "Need help with calculus homework"
   - Description: "Can someone explain derivatives?"
   - Check "Post anonymously"
3. Click "Submit Problem"

**Window 2:**
- ✅ **EXPECTED:** The new problem appears immediately without refreshing

**Window 2:**
1. Click the upvote (↑) button on the problem

**Window 1:**
- ✅ **EXPECTED:** The vote count increases immediately to 1

**Window 1:**
1. Click on "X Comments" to expand the problem
2. Type a comment: "I can help! What specifically confuses you?"
3. Click "Post Comment"

**Window 2:**
- ✅ **EXPECTED:** The comment appears immediately
- ✅ **EXPECTED:** Comment count increases

---

## Test 2: Crush Finder - Real-Time Updates

### Setup
1. Keep both browser windows open
2. Navigate both to `http://localhost:5173/crush-finder`

### Test Steps

**Window 1:**
1. Fill out the form:
   - Gender: Female
   - Name: (leave empty)
   - Age: 20-22
   - Major: Computer Science
   - Year: 2nd Year
   - Description: "Saw you in the library on Tuesday, you were wearing a blue hoodie"
   - Contact Info: "@myinstagram"
2. Click "Post Crush Request"

**Window 2:**
- ✅ **EXPECTED:** The crush request appears immediately

**Window 2:**
1. Click upvote (↑) on the crush request

**Window 1:**
- ✅ **EXPECTED:** Vote count increases to 1 immediately

**Window 1:**
1. Click "X Comments" to expand
2. Add comment: "I think I know who this might be!"
3. Click "Post Comment"

**Window 2:**
- ✅ **EXPECTED:** Comment appears immediately

---

## Test 3: Chat - Real-Time Messaging

### Setup
1. Keep both browser windows open
2. Navigate both to `http://localhost:5173/chat`

### Test Steps

**Window 1:**
1. Enter pseudonym: "Student1"
2. Click "New Room"
3. Enter room name: "General Discussion"
4. Click "Create"

**Window 2:**
- ✅ **EXPECTED:** "General Discussion" room appears immediately in the list

**Window 2:**
1. Enter pseudonym: "Student2"
2. Click on "General Discussion" room

**Window 1:**
- ✅ **EXPECTED:** See "2 online" in the header
- ✅ **EXPECTED:** May see "Student2 joined" notification (depending on implementation)

**Window 1:**
1. Type message: "Hello everyone!"
2. Click "Send"

**Window 2:**
- ✅ **EXPECTED:** Message appears immediately with "Student1" as sender

**Window 2:**
1. Start typing a message (don't send yet)

**Window 1:**
- ✅ **EXPECTED:** See "Student2 is typing..." indicator

**Window 2:**
1. Complete and send message: "Hi Student1!"

**Window 1:**
- ✅ **EXPECTED:** Message appears immediately
- ✅ **EXPECTED:** Typing indicator disappears

---

## Test 4: Data Persistence

### Test Steps

1. In Window 1: Post a problem, crush, or chat message
2. Close BOTH browser windows
3. Stop the server (Ctrl+C in terminal)
4. Restart the server: `npm run dev`
5. Open browser and go to the site
6. Navigate to the relevant page

**Expected Results:**
- ✅ All problems are still there
- ✅ All crushes are still there
- ✅ All chat rooms are still there
- ✅ All chat messages in rooms are still there
- ✅ Vote counts are preserved

---

## Test 5: Vote Limiting

### Test Steps

**Window 1:**
1. Go to Problems page
2. Find any problem
3. Click upvote (↑)
4. Try to click upvote again

**Expected:**
- ✅ Vote count increases by 1 the first time
- ✅ Button is disabled after voting
- ✅ Cannot vote again in the same direction

**Window 1:**
1. Click downvote (↓) on the same problem

**Expected:**
- ✅ Vote count decreases by 2 (removing upvote and adding downvote)
- ✅ Downvote button is now disabled
- ✅ Upvote button is now enabled again

---

## Test 6: Anonymous vs Named Posting

### Test Steps - Problems

**Window 1:**
1. Go to Problems page
2. Fill out form
3. UNCHECK "Post anonymously"
4. Enter name: "John Doe"
5. Submit

**Expected:**
- ✅ Problem shows "John Doe" instead of "Anonymous"

**Window 1:**
1. Submit another problem with "Post anonymously" CHECKED

**Expected:**
- ✅ Problem shows "Anonymous"

### Test Steps - Comments

1. Click on any problem
2. UNCHECK "Comment anonymously"
3. Enter name: "Jane Smith"
4. Post comment

**Expected:**
- ✅ Comment shows "Jane Smith" as author

---

## Test 7: Chat User Presence

### Test Steps

**Window 1:**
1. Join a chat room as "User1"

**Window 2:**
1. Join the same room as "User2"

**Both Windows:**
- ✅ Should see "2 online"

**Window 1:**
1. Close the browser window (or navigate away)

**Window 2:**
- ✅ Should see "1 online" after a few seconds

---

## Test 8: Multiple Rooms

### Test Steps

**Window 1:**
1. Create room "Room A"
2. Send message: "Message in Room A"

**Window 2:**
1. Create room "Room B"
2. Send message: "Message in Room B"

**Window 1:**
1. Click on "Room B"

**Expected:**
- ✅ Only see "Message in Room B"
- ✅ Don't see "Message in Room A"

---

## Test 9: Photo Upload (Crush Finder)

### Test Steps

1. Go to Crush Finder
2. Click on the upload area
3. Select an image file
4. Verify preview appears
5. Submit the form

**Expected:**
- ✅ Image preview shows before submitting
- ✅ After submitting, crush post shows the image
- ✅ Image persists after page refresh

---

## Test 10: Filter and Search

### Test Steps - Problems Page

1. Post problems in different categories:
   - Academic: "Need study partner"
   - Campus Life: "Lost my keys"
   - Housing: "Looking for roommate"
2. Use the category filter dropdown

**Expected:**
- ✅ Selecting "Academic" shows only academic problems
- ✅ Selecting "All Categories" shows all problems

---

## Performance Tests

### Test High Volume

1. Open 3-4 browser windows
2. Rapidly post problems from different windows

**Expected:**
- ✅ All problems appear in all windows
- ✅ Order is consistent across windows
- ✅ No duplicate problems
- ✅ Vote counts are accurate

### Test Chat Performance

1. Open 3 browser windows in the same chat room
2. Send messages rapidly from all windows

**Expected:**
- ✅ All messages appear in correct order
- ✅ No messages are lost
- ✅ Message order is the same in all windows

---

## Browser Compatibility Tests

Test the application in:
- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Expected:**
- Works in all modern browsers
- Real-time updates work consistently
- UI is responsive on mobile

---

## Error Handling Tests

### Test Server Disconnect

1. Open the application
2. Stop the server (Ctrl+C)
3. Try to post something

**Expected:**
- ✅ Error is handled gracefully
- ✅ Console shows connection error

4. Restart server

**Expected:**
- ✅ Application reconnects automatically
- ✅ Real-time features resume working

### Test Network Issues

1. Open browser DevTools
2. Go to Network tab
3. Set to "Offline"
4. Try to post something

**Expected:**
- ✅ Appropriate error handling
- ✅ No crashes

---

## Database Integrity Tests

### Test Database

1. Post various items
2. Stop the server
3. Open `server/uir_problemes.db` with SQLite browser
4. Verify:
   - ✅ Problems table has correct data
   - ✅ Crushes table has correct data
   - ✅ Chat rooms and messages exist
   - ✅ Comments are stored as JSON

---

## Troubleshooting Common Issues

### Real-time updates not working
1. Check browser console for Socket.IO connection errors
2. Verify server is running on port 3001
3. Check CORS settings
4. Try hard refresh (Ctrl+Shift+R)

### Database not persisting
1. Check server has write permissions
2. Look for `.db` file in `server/` directory
3. Check server logs for database errors

### Chat messages not appearing
1. Verify you've entered a username
2. Check that you've joined a room
3. Look for Socket.IO connection in browser Network tab
4. Check server logs

---

## Success Criteria

✅ All tests pass
✅ Real-time updates work in all features
✅ Data persists after server restart
✅ Multiple users can interact simultaneously
✅ No console errors
✅ Performance is smooth
✅ Works across different browsers

---

## Next Steps After Testing

If all tests pass:
1. ✅ Ready for production deployment
2. ✅ Can share with users
3. ✅ Monitor for any issues

If some tests fail:
1. Check server logs
2. Check browser console
3. Verify all dependencies are installed
4. Try `npm install` again
5. Delete database and restart server

---

**Happy Testing! 🧪**
