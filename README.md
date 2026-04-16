# UIR PROBLEMES - University Support Platform

A comprehensive, anonymous university support platform built for UIR students. This platform provides a safe, GDPR-compliant space for students to share problems, find connections, participate in forums, and chat anonymously.

## Features

### 1. Problem Submission System
- **Anonymous posting**: Students can submit academic, campus, personal, and administrative problems anonymously
- **Category filtering**: Organize problems by type (Academic, Campus Life, Personal, Administrative, Housing, Other)
- **Community engagement**: Like and comment on problems to provide support
- **Real-time interaction**: See and respond to other students' challenges

### 2. Crush Finder
- **Detailed search criteria**: Gender, major, year, physical appearance, last seen location
- **Photo uploads**: Optional photo upload feature with privacy guidelines
- **Anonymous requests**: All crush finder posts are completely anonymous
- **Community help**: Other students can comment and help make connections

### 3. University Forum
- **Organized categories**: Academic (by major), Student Life, Administrative, Year Groups, General Discussion
- **Subcategory organization**: Each category has relevant subcategories for easy navigation
- **Threaded discussions**: Create threads and engage in organized conversations
- **Pseudonym system**: Random pseudonyms generated for each post and reply
- **Like and reply**: Full interaction features for community engagement

### 4. Anonymous Chat
- **Real-time messaging**: Live chat functionality with fellow students
- **Random pseudonyms**: Each chat session generates a unique pseudonym
- **Session-based**: Pseudonyms change between sessions for maximum privacy
- **Online user list**: See who's currently in the chat room
- **Color-coded identities**: Each user gets a unique color for easy identification

### 5. Privacy & GDPR Compliance
- **Comprehensive privacy policy**: Full GDPR-compliant privacy documentation
- **Consent management**: Cookie consent banner with accept/decline options
- **Local storage only**: All data stored locally on user's device, never transmitted to servers
- **No tracking**: No cookies, analytics, or third-party services
- **User control**: Complete control over data with ability to delete anytime
- **Transparency**: Clear explanation of what data is collected and how it's used

## Technical Architecture

### Frontend Stack
- **React 19**: Modern React with hooks for state management
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework for professional styling
- **React Router**: Client-side routing for seamless navigation
- **Lucide React**: High-quality icon library
- **date-fns**: Date formatting and manipulation

### Data Storage
- **Local Storage**: All user data stored in browser's local storage
- **No Backend**: Completely client-side application
- **Privacy-First**: No data ever leaves the user's device

### Color Scheme
- **Primary**: Blue (#2563eb - blue-600)
- **Accent**: Yellow (#eab308 - yellow-500)
- **Secondary Colors**: Pink, Purple, Green for different features
- **Professional**: Clean white background with subtle gray accents

## Privacy Features

### GDPR Compliance
1. **Right to Access**: Users have direct access to their data in local storage
2. **Right to Rectification**: Edit or delete content anytime
3. **Right to Erasure**: Clear all data by clearing browser storage
4. **Right to Data Portability**: Data stored in standard JSON format
5. **Right to Object**: Can decline consent (with limited functionality)

### Anonymity Protection
- No personal identification required
- No IP tracking
- No device fingerprinting
- Random pseudonyms for forum and chat
- No cross-feature activity linking

## Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Opera: Full support

## Local Storage Keys

The application uses the following local storage keys:
- `uir-gdpr-consent`: User's consent choice
- `uir-gdpr-consent-date`: Date of consent
- `uir-problems`: Stored problem submissions
- `uir-crush-posts`: Stored crush finder posts
- `uir-forum-threads`: Stored forum threads
- `uir-chat-messages`: Chat message history

Session storage:
- `uir-chat-user`: Current chat session pseudonym

## Content Guidelines

### Acceptable Use
- Academic discussions and help
- Campus life questions and advice
- Respectful connection requests
- Constructive feedback and support

### Prohibited Content
- Illegal content
- Harassment or threats
- Personal information sharing without consent
- Sexually explicit content
- Hate speech or discrimination

## Security Considerations

1. **Client-Side Only**: No server means no server-side vulnerabilities
2. **No Authentication**: No passwords to be compromised
3. **Local Data**: Data breach impossible as no central database exists
4. **Browser Security**: Relies on browser's built-in security features
5. **Photo Uploads**: Stored as base64 in local storage, never transmitted

## Limitations

- Data is device-specific (doesn't sync across devices)
- Clearing browser data removes all content
- Chat is not persistent across page refreshes for non-joined users
- Photo uploads limited by browser storage constraints
- No moderation system (relies on community guidelines)

## Future Enhancements (Considerations)

- Optional backend integration for cross-device sync
- Moderation system for reported content
- Direct messaging between users (with consent)
- Email notifications for replies (with user opt-in)
- Mobile app versions

## Support

For questions, concerns, or support, please contact us through our Instagram page: [@UIR_PROBLEMES](https://instagram.com/uir_problemes)

## License

This project is created for UIR PROBLEMES community use.

## Contributing

This is a community-driven project. If you'd like to contribute improvements or report issues, please reach out through our Instagram page.

---

**Built with privacy, anonymity, and student support in mind.**

**UIR PROBLEMES** - Helping UIR students navigate university life together, anonymously.
