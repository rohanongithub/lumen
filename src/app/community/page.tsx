'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeartIcon, ChatBubbleLeftIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';
import { UserCircleIcon } from '@heroicons/react/24/solid';

interface Comment {
  id: string;
  user: string;
  content: string;
  likes: number;
  timestamp: string;
  isLiked: boolean;
  size: 'small' | 'medium' | 'large';
  replies?: {
    id: string;
    user: string;
    content: string;
    timestamp: string;
  }[];
}

interface Friend {
  id: string;
  name: string;
  currentSong: string;
  artist: string;
  timestamp: string;
}

interface DiscussionMessage {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  isReply?: boolean;
}

const initialComments: Comment[] = [
  {
    id: '1',
    user: 'Priya_M',
    content: 'Just discovered this amazing indie artist - their new album is pure magic! Anyone else listening to them?',
    likes: 24,
    timestamp: '3h ago',
    isLiked: false,
    size: 'large'
  },
  {
    id: '2',
    user: 'Arjun_S',
    content: 'Looking for recommendations: What are your favorite songs to work out to? Need some high-energy tracks!',
    likes: 18,
    timestamp: '5h ago',
    isLiked: false,
    size: 'medium'
  },
  {
    id: '3',
    user: 'Sarah_J',
    content: 'Just got my hands on a rare pressing of Dark Side of the Moon. The sound quality is mind-blowing!',
    likes: 42,
    timestamp: '6h ago',
    isLiked: false,
    size: 'small'
  },
  {
    id: '4',
    user: 'Rahul_K',
    content: 'The new wave of synth-pop artists is bringing back the 80s vibes in the best way possible. Loving the retro-futuristic aesthetic!',
    likes: 31,
    timestamp: '2h ago',
    isLiked: false,
    size: 'medium'
  },
  {
    id: '5',
    user: 'Meera_P',
    content: 'Miles Davis\' Kind of Blue - timeless masterpiece. Every time I listen, I discover something new in the improvisations.',
    likes: 56,
    timestamp: '8h ago',
    isLiked: false,
    size: 'small'
  },
  {
    id: '6',
    user: 'David_L',
    content: 'Just finished my new mix! Check it out if you\'re into progressive house and melodic techno. Would love to hear your thoughts!',
    likes: 89,
    timestamp: '1h ago',
    isLiked: false,
    size: 'large'
  }
];

const friendsList: Friend[] = [
  {
    id: '1',
    name: 'Ananya',
    currentSong: 'Pasoori Nu',
    artist: 'Arijit Singh',
    timestamp: '2 min ago'
  },
  {
    id: '2',
    name: 'Sarah',
    currentSong: 'As It Was',
    artist: 'Harry Styles',
    timestamp: '5 min ago'
  },
  {
    id: '3',
    name: 'Vikram',
    currentSong: 'Naatu Naatu',
    artist: 'Rahul Sipligunj',
    timestamp: '10 min ago'
  },
  {
    id: '4',
    name: 'Emma',
    currentSong: 'Kill Bill',
    artist: 'SZA',
    timestamp: '15 min ago'
  }
];

const discussionThread: DiscussionMessage[] = [
  {
    id: '1',
    user: 'Priya_M',
    content: 'I think the new album is overrated. The production is great but the lyrics feel shallow compared to their previous work.',
    timestamp: '2h ago'
  },
  {
    id: '2',
    user: 'Arjun_S',
    content: 'I disagree! The lyrics are actually more nuanced than they appear. Have you listened to the hidden meanings in the chorus?',
    timestamp: '1h ago',
    isReply: true
  },
  {
    id: '3',
    user: 'Meera_P',
    content: 'I\'m with Priya on this one. The production is carrying the album, but the songwriting isn\'t as strong as their last release.',
    timestamp: '45m ago',
    isReply: true
  },
  {
    id: '4',
    user: 'Rahul_K',
    content: 'Let\'s not forget the cultural context though. The album is a response to current events, which adds depth to the lyrics.',
    timestamp: '30m ago',
    isReply: true
  }
];

const getProfileIcon = (user: string, profilePicture?: string) => {
  // If it's the current user, use their profile picture
  if (user === 'You') {
    if (profilePicture) {
      return (
        <img 
          src={profilePicture} 
          alt={user}
          className="w-full h-full rounded-full object-cover"
        />
      );
    }
  }

  // Define profile images for all users
  const profileImages: Record<string, string> = {
    // Friends
    'Vikram': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww',
    'Emma': 'https://img.freepik.com/free-photo/close-up-smiley-woman-outdoors_23-2149002410.jpg',
    'Ananya': 'https://images.unsplash.com/photo-1525134479668-1bee5c7c6845?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww',
    'Sarah': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHJhbmRvbSUyMHBlb3BsZXxlbnwwfHwwfHx8MA%3D%3D',
    
    // Comment/Discussion users
    'Priya_M': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80',
    'Arjun_S': 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    'Sarah_J': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1361&q=80',
    'Rahul_K': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    'Meera_P': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
    'David_L': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80'
  };

  // Check if we have a profile image for this user
  if (profileImages[user]) {
    return (
      <img 
        src={profileImages[user]} 
        alt={user}
        className="w-full h-full rounded-full object-cover"
      />
    );
  }

  // Fallback to SVG icons if no image is available
  const icons = [
    <svg key="vinyl" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
    </svg>,
    <svg key="headphones" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </svg>,
    <svg key="music" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>,
    <svg key="mic" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>,
    <svg key="guitar" className="w-8 h-8 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      <path d="M9 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />
    </svg>
  ];
  return icons[user.charCodeAt(0) % icons.length];
};

export default function CommunityPage() {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [personalNote, setPersonalNote] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
    // Load profile picture from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      if (parsedProfile.profilePicture) {
        setProfilePicture(parsedProfile.profilePicture);
      }
    }
  }, []);

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const handlePostNote = () => {
    if (personalNote.trim()) {
      const newComment: Comment = {
        id: Date.now().toString(), // Using timestamp as unique ID
        user: 'You', // Or you could use a username from user context
        content: personalNote,
        likes: 0,
        timestamp: 'Just now',
        isLiked: false,
        size: 'small' // Default size for personal notes
      };
      
      setComments([newComment, ...comments]); // Add new comment at the beginning
      setPersonalNote(''); // Clear the textarea
    }
  };

  const handleReply = (commentId: string) => {
    setReplyContent(''); // Clear any previous reply content
    setReplyTo(commentId);
    // Add a small delay to ensure the popup is rendered
    setTimeout(() => {
      const textarea = document.querySelector('textarea');
      if (textarea) {
        textarea.focus();
      }
    }, 50);
  };

  const handleSubmitReply = () => {
    if (replyContent.trim() && replyTo) {
      const newReply = {
        id: Date.now().toString(),
        user: 'You',
        content: replyContent,
        timestamp: 'Just now'
      };

      setComments(comments.map(comment => {
        if (comment.id === replyTo) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      }));

      setReplyContent('');
      setReplyTo(null);
    }
  };

  const getCardSizeClasses = (size: Comment['size']) => {
    switch (size) {
      case 'small':
        return 'lg:col-span-1 h-64';
      case 'medium':
        return 'lg:col-span-2 h-64';
      case 'large':
        return 'lg:col-span-3 sm:col-span-2 h-64';
      default:
        return '';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="w-full min-h-screen flex justify-center py-10">
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap');
          
          .shadows-into-light-two {
            font-family: "Shadows Into Light Two", cursive;
            font-weight: 400;
            font-style: normal;
          }
        `}</style>

        {/* Reply Popup */}
        {replyTo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/5 w-full max-w-md mx-4 transform transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Write a Reply</h3>
                <button
                  onClick={() => setReplyTo(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full h-32 bg-white/5 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                autoFocus
              />
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setReplyTo(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReply}
                  className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                >
                  Post Reply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[65] m-0 p-0 md:pb-0 pb-16">
            <div className="relative bg-white/10 backdrop-blur-md rounded-t-xl border-t border-white/20 w-full max-w-md shadow-[0_-10px_30px_rgba(0,0,0,0.3)] overflow-hidden p-4">
              {/* Audio player content */}
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:pl-20 lg:pl-20 md:pr-4 flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`bg-white/3 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:bg-white/5 transition-colors ${getCardSizeClasses(comment.size)}`}
                >
                  <div className="h-full flex flex-col">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                        {getProfileIcon(comment.user, profilePicture)}
                      </div>
                      <div>
                        <span className="text-blue-400 font-medium shadows-into-light-two text-lg">{comment.user}</span>
                        <span className="text-gray-400 text-sm ml-2">{comment.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-white mb-4">{comment.content}</p>
                    
                    {/* Replies Section */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="pl-4 border-l-2 border-blue-500/20">
                            <div className="flex items-center space-x-2 mb-1">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden">
                                {getProfileIcon(reply.user, profilePicture)}
                              </div>
                              <div>
                                <span className="text-blue-400 font-medium shadows-into-light-two text-sm">{reply.user}</span>
                                <span className="text-gray-400 text-xs ml-2">{reply.timestamp}</span>
                              </div>
                            </div>
                            <p className="text-white/90 text-sm">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-6 mt-auto pt-4">
                      <button
                        onClick={() => handleLike(comment.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        {comment.isLiked ? (
                          <HeartSolidIcon className="w-5 h-5 text-blue-500" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                        <span>{comment.likes}</span>
                      </button>
                      <button 
                        onClick={() => handleReply(comment.id)}
                        className="flex items-center space-x-1 text-gray-400 hover:text-teal-400 transition-colors"
                      >
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        <span>Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Discussion Thread Card */}
            <div className="mt-8">
              <div className="bg-white/3 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:bg-white/5 transition-colors">
                <h3 className="text-xl font-bold text-white mb-6">Hot Debate: New Album Review</h3>
                <div className="space-y-4">
                  {discussionThread.map((message) => (
                    <div 
                      key={message.id} 
                      className={`bg-white/3 backdrop-blur-sm rounded-lg p-4 border border-white/5 ${message.isReply ? 'ml-8' : ''}`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                          {getProfileIcon(message.user, profilePicture)}
                        </div>
                        <div>
                          <span className="text-blue-400 font-medium shadows-into-light-two text-lg">{message.user}</span>
                          <span className="text-gray-400 text-sm ml-2">{message.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-white">{message.content}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                    <HeartIcon className="w-5 h-5" />
                    <span>Join Discussion</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-teal-400 transition-colors">
                    <ChatBubbleLeftIcon className="w-5 h-5" />
                    <span>Add Your Thoughts</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Friends Panel */}
          <div className="w-full lg:w-80 mt-8 lg:mt-0">
            <div className="bg-white/3 backdrop-blur-sm rounded-xl p-6 border border-white/5 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-white mb-6">Friends Activity</h2>
              <div className="space-y-6">
                {friendsList.map((friend) => (
                  <div key={friend.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {getProfileIcon(friend.name, profilePicture)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 font-medium shadows-into-light-two text-lg">{friend.name}</span>
                        <span className="text-gray-400 text-xs">{friend.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <MusicalNoteIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">{friend.currentSong}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{friend.artist}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Personal Note Card - Show on larger screens and at bottom on mobile */}
              <div className="mt-8 bg-white/3 backdrop-blur-sm rounded-xl p-4 border border-white/5">
                <h3 className="text-lg font-medium text-white mb-3">Leave a Note</h3>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-700"
                      />
                    ) : (
                      <UserCircleIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Share your thoughts..."
                      className="w-full h-24 bg-white/5 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handlePostNote}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 