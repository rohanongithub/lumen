'use client';

import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, BackwardIcon, ForwardIcon, ArrowsPointingOutIcon, XMarkIcon, HeartIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageBackground from '@/components/PageBackground';
import { useTransition } from '@/components/TransitionProvider';

// Define types for our data
interface Song {
  id: number;
  title: string;
  artist: string;
  audioFile?: string;
  poster?: string;
}

interface Album {
  id: number;
  title: string;
  artist: string;
  year: string;
  image: string;
  description: string;
  audioFile?: string;
  poster?: string;
  hidden?: boolean;
}

interface Artist {
  name: string;
  image: string;
  note: string;
}

interface TrendingArtist {
  id: number;
  name: string;
  image: string;
  monthlyListeners: string;
}

// Top picks data
const topPicks: Album[] = [
  { 
    id: 1, 
    title: 'Midnight Rain', 
    artist: 'Taylor Swift',
    year: '2022',
    image: '/midnightrain.png',
    audioFile: '/audio/[4K] Taylor Swift - Midnight Rain (From The Eras Tour).mp3',
    poster: '/midnightrain.png',
    description: 'A hauntingly beautiful track from Taylor Swift\'s Midnights album'
  },
  { 
    id: 2, 
    title: 'As It Was', 
    artist: 'Harry Styles',
    year: '2022',
    image: '/asitwas.png',
    audioFile: '/audio/Harry Styles - As It Was (Official Video).mp3',
    poster: '/asitwas.png',
    description: 'A nostalgic pop anthem from Harry Styles\' third studio album'
  },
  { 
    id: 3, 
    title: 'About Damn Time', 
    artist: 'Lizzo',
    year: '2022',
    image: '/aboutdamntime.png',
    audioFile: '/audio/Lizzo - About Damn Time [Official Video].mp3',
    poster: '/aboutdamntime.png',
    description: 'An empowering disco-pop track from Lizzo\'s Special album'
  },
  { 
    id: 4, 
    title: 'Bad Habit', 
    artist: 'Steve Lacy',
    year: '2022',
    image: '/badhabits.png',
    audioFile: '/audio/Steve Lacy - Bad Habit (Official Video).mp3',
    poster: '/badhabits.png',
    description: 'A smooth R&B track from Steve Lacy\'s Gemini Rights album'
  },
  { 
    id: 5, 
    title: 'STAY', 
    artist: 'The Kid LAROI, Justin Bieber',
    year: '2021',
    image: '/stay.png',
    audioFile: '/audio/The Kid LAROI, Justin Bieber - STAY (Official Video).mp3',
    poster: '/stay.png',
    description: 'A chart-topping collaboration between The Kid LAROI and Justin Bieber'
  },
  { 
    id: 6, 
    title: 'Flowers', 
    artist: 'Miley Cyrus',
    year: '2023',
    image: '/flowers.jpg',
    audioFile: '/audio/Miley Cyrus - Flowers (Official Video).mp3',
    poster: '/flowers.jpg',
    description: 'A powerful breakup anthem from Miley Cyrus'
  },
  { 
    id: 7, 
    title: 'Anti-Hero', 
    artist: 'Taylor Swift',
    year: '2022',
    image: '/antihero.png',
    audioFile: '/audio/Taylor Swift - Anti-Hero (Official Music Video).mp3',
    poster: '/antihero.png',
    description: 'A self-reflective track from Taylor Swift\'s Midnights album'
  },
  { 
    id: 8, 
    title: 'Rich Flex', 
    artist: 'Drake, 21 Savage',
    year: '2022',
    image: '/richflex.png',
    audioFile: '/audio/Drake, 21 Savage - Rich Flex (Audio).mp3',
    poster: '/richflex.png',
    description: 'A collaboration between Drake and 21 Savage from their joint album'
  },
  { 
    id: 9, 
    title: 'Unholy', 
    artist: 'Sam Smith, Kim Petras',
    year: '2022',
    image: '/unholy.png',
    audioFile: '/audio/Sam Smith, Kim Petras - Unholy (Official Music Video).mp3',
    poster: '/unholy.png',
    description: 'A provocative collaboration between Sam Smith and Kim Petras'
  },
  { 
    id: 10, 
    title: 'BREAK MY SOUL', 
    artist: 'Beyoncé',
    year: '2022',
    image: '/breakmysoul.png',
    audioFile: '/audio/Beyoncé - BREAK MY SOUL (Official Lyric Video).mp3',
    poster: '/breakmysoul.png',
    description: 'A dance anthem from Beyoncé\'s Renaissance album'
  }
];

// Fresh Out albums data with images
const freshOutAlbums: Album[] = [
  { 
    id: 1, 
    title: 'Mr. Blue Sky', 
    artist: 'Electric Light Orchestra', 
    year: '1977',
    image: '/images/electric.jpg',
    description: 'A masterpiece of orchestral pop from the album "Out of the Blue"',
    audioFile: '/mrbluesky.mp3',
    poster: '/mrblueposter.jpg'
  },
  { 
    id: 2, 
    title: "Don't Bring Me Down", 
    artist: 'Electric Light Orchestra', 
    year: '1979',
    image: '/images/electric.jpg',
    description: 'A rock anthem from the album "Discovery"',
    audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3',
    poster: '/livin.jpg',
    hidden: true
  },
  { 
    id: 3, 
    title: "Livin' Thing", 
    artist: 'Electric Light Orchestra', 
    year: '1976',
    image: '/images/electric.jpg',
    description: 'A vibrant hit from the album "A New World Record"',
    audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3',
    poster: '/livin.jpg',
    hidden: true
  },
  { 
    id: 4, 
    title: 'Vintage Roads', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/images/car-vintage.jpg',
    description: 'Classic melodies with a modern twist',
    audioFile: '/runaway.mp3',
    poster: '/runawayimage.jpeg'
  },
  { 
    id: 5, 
    title: 'Traffic in Sky', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/images/car-vintage.jpg',
    description: 'Urban rhythms and vintage vibes',
    audioFile: '/trafficinsky.mp3',
    poster: '/trafficsky.jpeg',
    hidden: true
  },
  { 
    id: 6, 
    title: 'Walking on a Dream', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/images/car-vintage.jpg',
    description: 'A dreamy journey through sound',
    audioFile: '/walkinonadream.mp3',
    poster: '/walkingdream.jpeg',
    hidden: true
  },
  { 
    id: 7, 
    title: 'Live at the Arena', 
    artist: 'The Concert Experience', 
    year: '2023',
    image: '/images/concert.jpg',
    description: 'Capturing the energy of live performances'
  }
];

// Artist of the Day data
const artistOfTheDay: Artist = {
  name: 'Kendrick Lamar',
  image: '/kendrik.png',
  note: `"I didn't climb the charts, I broke them. I don't follow trends, I bury them. Every verse I write turns critics into fans and kings into students — I don't just rap, I resurrect. They rap to be seen, I speak to be studied. My silence says more than their loudest hooks. I don't chase the crown — I haunt the ones wearing it."`
};

// Trending Artists data
const trendingArtists: TrendingArtist[] = [
  {
    id: 1,
    name: 'Billie Eilish',
    image: 'https://4kwallpapers.com/images/wallpapers/billie-eilish-3840x2160-12396.jpg',
    monthlyListeners: '82.5M'
  },
  {
    id: 2,
    name: 'The Weeknd',
    image: 'https://ew.com/thmb/IVjmtfkRu2ZP4GDYmiFkPUe7yTc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Weeknd-d4fb08e62a924691a18af068d9bfa972.jpg',
    monthlyListeners: '95.3M'
  },
  {
    id: 3,
    name: 'Doja Cat',
    image: 'https://www.rollingstone.com/wp-content/uploads/2023/05/doja-cat-2022-RS-1800.jpg?w=1581&h=1054&crop=1',
    monthlyListeners: '63.8M'
  }
];

export default function Home() {
  const [activeSection, setActiveSection] = useState('top-picks');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Album | Song | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePicture, setProfilePicture] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showHopIn, setShowHopIn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();
  const { startTransition } = useTransition();
  
  // Load liked songs from localStorage on mount
  useEffect(() => {
    try {
      const savedLikes = localStorage.getItem('likedSongs');
      if (savedLikes) {
        const parsedLikes = JSON.parse(savedLikes);
        if (JSON.stringify(likedSongs) !== JSON.stringify(parsedLikes)) {
          setLikedSongs(parsedLikes);
        }
      }
    } catch (error) {
      console.error('Error loading liked songs:', error);
    }
  }, []);

  // Save liked songs to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    } catch (error) {
      console.error('Error saving liked songs:', error);
    }
  }, [likedSongs]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'likedSongs' && e.newValue) {
        try {
          const newLikes = JSON.parse(e.newValue);
          if (JSON.stringify(likedSongs) !== JSON.stringify(newLikes)) {
            setLikedSongs(newLikes);
          }
        } catch (error) {
          console.error('Error parsing liked songs from storage:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [likedSongs]);

  // Add a more frequent check for storage changes
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const currentLikes = localStorage.getItem('likedSongs');
        if (currentLikes) {
          const parsedLikes = JSON.parse(currentLikes);
          if (JSON.stringify(likedSongs) !== JSON.stringify(parsedLikes)) {
            setLikedSongs(parsedLikes);
          }
        }
      } catch (error) {
        console.error('Error checking storage:', error);
      }
    }, 500); // Check more frequently

    return () => clearInterval(interval);
  }, [likedSongs]);

  // Load profile picture from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      if (parsedProfile.profilePicture) {
        setProfilePicture(parsedProfile.profilePicture);
      }
    }
  }, []);

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Handle play/pause functionality
  const togglePlay = (track: Album | Song) => {
    console.log('Toggle play clicked for track:', track.title);
    console.log('Audio file path:', track.audioFile);
    
    if (currentTrack && currentTrack.id === track.id) {
      // If the same track is clicked, toggle play/pause
      if (isPlaying && audioRef.current) {
        console.log('Pausing current track');
        audioRef.current.pause();
      } else if (audioRef.current) {
        console.log('Resuming current track');
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    } else {
      // If a different track is clicked, play it
      console.log('Setting new track:', track.title);
      setCurrentTrack(track);
      setIsPlaying(true);
      
      // Set up the audio element
      if (audioRef.current && track.audioFile) {
        console.log('Setting audio source to:', track.audioFile);
        audioRef.current.src = track.audioFile;
        audioRef.current.volume = volume;
        audioRef.current.muted = isMuted;
        
        // Add event listeners for debugging
        audioRef.current.addEventListener('canplaythrough', () => {
          console.log('Audio can play through');
        });
        
        audioRef.current.addEventListener('error', (e) => {
          console.error('Audio error:', e);
        });
        
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.error('Audio element or track.audioFile is missing');
      }
    }
  };
  
  // Handle volume changes
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  // Update volume when changed
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };
  
  // Initialize audio element
  useEffect(() => {
    // Create a new audio element if it doesn't exist
    if (!audioRef.current) {
      console.log('Creating new audio element');
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    
    return () => {
      // Clean up
      if (audioRef.current) {
        console.log('Cleaning up audio element');
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Handle audio ended event
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        console.log('Audio playback ended');
        setIsPlaying(false);
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, []);
  
  // Update progress bar
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      const updateProgress = () => {
        if (audioRef.current) {
          const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setProgress(percent);
        }
      };
      
      audioRef.current.addEventListener('timeupdate', updateProgress);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
        }
      };
    }
  }, [isPlaying]);
  
  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * audioRef.current.duration;
      
      audioRef.current.currentTime = newTime;
      setProgress(percent * 100);
    }
  };
  
  // Add new handlers for progress bar dragging
  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleProgressUpdate(e);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      handleProgressUpdate(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressUpdate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newTime = percent * audioRef.current.duration;
      
      audioRef.current.currentTime = newTime;
      setProgress(percent * 100);
    }
  };

  // Modify the toggleFavorite function to handle individual songs
  const toggleFavorite = (trackId: number) => {
    const newLikedSongs = likedSongs.includes(trackId)
      ? likedSongs.filter(id => id !== trackId)
      : [...likedSongs, trackId];
    
    setLikedSongs(newLikedSongs);
    
    // Only trigger animation when liking
    if (!likedSongs.includes(trackId)) {
      setIsShimmering(true);
      setTimeout(() => setIsShimmering(false), 600);
    }
  };

  // Helper function to check if a song is liked
  const isTrackLiked = (trackId: number) => likedSongs.includes(trackId);

  useEffect(() => {
    // Add mouse up listener for drag end
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  // Find next track in the current section
  const findNextTrack = (currentId: number, direction: 'forward' | 'backward', section: 'tune-in' | 'top-picks') => {
    console.log(`Finding random track from all available songs`);
    
    // Combine both track arrays
    const allTracks = [...topPicks, ...freshOutAlbums];
    console.log('Total available tracks:', allTracks.length);
    
    // Filter out hidden tracks and ensure they have audio files
    const availableTracks = allTracks.filter(track => !track.hidden && track.audioFile);
    
    if (availableTracks.length === 0) {
      console.log('No available tracks');
      return null;
    }
    
    // Pick a random track from the available tracks
    const randomIndex = Math.floor(Math.random() * availableTracks.length);
    const randomTrack = availableTracks[randomIndex];
    
    // Make sure we don't get the same track
    if (randomTrack.id === currentId && availableTracks.length > 1) {
      // Try again to get a different track
      return findNextTrack(currentId, direction, section);
    }
    
    console.log('Selected random track:', randomTrack.title);
    return randomTrack;
  };

  // Handle forward/backward
  const handleSkipTrack = (direction: 'forward' | 'backward') => {
    if (!currentTrack) return;
    
    console.log('Current track:', currentTrack.title, 'ID:', currentTrack.id);
    
    console.log(`Picking random track from all available songs`);
    const nextTrack = findNextTrack(currentTrack.id, direction, 'top-picks'); // Section parameter is no longer used
    
    if (nextTrack) {
      console.log(`Next track: ${nextTrack.title} (${nextTrack.artist})`);
      togglePlay(nextTrack);
    }
  };

  // Add keyboard event listener for playback control
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Only process keyboard shortcuts if we have a track playing or loaded
      if (!currentTrack) return;
      
      switch (event.code) {
        case 'Space':
          event.preventDefault(); // Prevent page scroll
          if (isPlaying) {
            audioRef.current?.pause();
          } else {
            audioRef.current?.play().catch(error => {
              console.error('Error playing audio:', error);
            });
          }
          setIsPlaying(!isPlaying);
          break;
          
        case 'ArrowRight':
          event.preventDefault();
          handleSkipTrack('forward');
          break;
          
        case 'ArrowLeft':
          event.preventDefault();
          handleSkipTrack('backward');
          break;
          
        case 'KeyM':
          event.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTrack, isPlaying, handleSkipTrack, toggleMute]);

  // Add logout handler
  const handleLogout = () => {
    setIsProfileOpen(false);
    setIsLoggingOut(true);
    
    // Show the logout message for 3 seconds, then fade out
    setTimeout(() => {
      setShowHopIn(true);
    }, 3000);
  };

  const handleHopIn = () => {
    // Keep both profile and liked songs data
    // Use the transition provider for smooth navigation
    startTransition(() => {
      // Use window.location to ensure a full page reload
      window.location.href = '/';
    });
  };

  return (
    <div>
      <div className="w-full h-auto" style={{ overflow: 'hidden', maxHeight: 'none' }}>
        <main className={`relative transition-all duration-500 ${isExpanded ? 'blur-sm' : ''}`} style={{ overflow: 'hidden' }}>
          <div className="relative z-10">
            <div className="w-full max-w-6xl mx-auto px-4 pt-[1.25rem] pb-4">
              {/* Navigation Tabs */}
              <div className="flex justify-between items-center mb-6 border-b border-white/10 mt-2">
                <div className="flex space-x-8">
                  <button 
                    onClick={() => setActiveSection('top-picks')}
                    className={`pb-3 text-lg font-medium transition-all duration-300 ${
                      activeSection === 'top-picks' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    Top Picks
                  </button>
                  <button 
                    onClick={() => setActiveSection('tune-in')}
                    className={`pb-3 text-lg font-medium transition-all duration-300 ${
                      activeSection === 'tune-in' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    Tune In
                  </button>
                  <button 
                    onClick={() => setActiveSection('mood')}
                    className={`pb-3 text-lg font-medium transition-all duration-300 ${
                      activeSection === 'mood' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    Mood
                  </button>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="relative"
                      >
                        {profilePicture ? (
                          <img
                            src={profilePicture}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                          />
                        ) : (
                          <UserCircleIcon className="w-10 h-10 text-white/60 hover:text-white transition-colors duration-200" />
                        )}
                      </button>
                      
                      {/* Profile Dropdown Menu */}
                      <div 
                        className={`absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg overflow-hidden z-50 transform transition-all duration-200 ease-out origin-top-right ${
                          isProfileOpen 
                            ? 'opacity-100 scale-100 translate-y-0' 
                            : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
                        }`}
                      >
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setIsProfileOpen(false);
                              router.push('/profile');
                            }}
                            className="flex items-center w-full px-4 py-2 text-left hover:bg-white/10 transition-colors duration-200"
                          >
                            <UserCircleIcon className="w-5 h-5 mr-3" />
                            Profile
                          </button>
                          <button 
                            className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors duration-200"
                            onClick={handleLogout}
                          >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Top Picks Section with Artist of the Day */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  activeSection === 'top-picks' 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-4 invisible absolute'
                }`}
              >
                {/* Top Picks Songs */}
                <h2 className="text-3xl font-bold mb-4 text-white">Top Picks</h2>
                <div className="w-full overflow-hidden">
                  <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar mb-6">
                    {topPicks.map((song) => (
                      <div 
                        key={song.id} 
                        className="group flex-shrink-0 w-[200px] p-4 rounded-xl transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer mt-1 mx-1"
                        onClick={() => song.audioFile && togglePlay(song)}
                      >
                        <div className="aspect-square bg-white/10 rounded-lg mb-3 flex items-center justify-center transition-all duration-500 group-hover:bg-white/20 relative overflow-hidden">
                          {song.poster ? (
                            <Image
                              src={song.poster}
                              alt={song.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <PlayIcon className="w-12 h-12 text-white opacity-60 group-hover:opacity-100 transition-all duration-500" />
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <PlayIcon className="w-12 h-12 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate text-white">{song.title}</h3>
                            <p className="text-sm text-white/70 truncate whitespace-nowrap overflow-hidden">
                              {song.title === 'Stay' || song.title === 'Unholy' ? (
                                <span className="inline-block animate-marquee">{song.artist}</span>
                              ) : (
                                song.artist
                              )}
                            </p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(song.id);
                            }}
                            className="ml-2 p-1 hover:opacity-80 transition-all duration-300 flex-shrink-0"
                          >
                            {likedSongs.includes(song.id) ? (
                              <HeartIcon className="w-5 h-5 text-red-500" />
                            ) : (
                              <HeartOutlineIcon className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Artist of the Day */}
                <div>
                  <h2 className="text-3xl font-bold mb-4 text-white">Artist of the Day</h2>
                  <div className="flex flex-col md:flex-row gap-6 items-center p-4 bg-white/3 backdrop-blur-sm rounded-xl">
                    <div className="relative w-full md:w-1/2 aspect-square bg-white/5 rounded-xl overflow-hidden shadow-xl">
                      <Image 
                        src={artistOfTheDay.image}
                        alt={artistOfTheDay.name}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="w-full md:w-1/2 py-4">
                      <h3 className="text-2xl font-bold mb-4 text-white">{artistOfTheDay.name}</h3>
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold mb-2 text-white">Why We Love This Artist</h4>
                        <p className="text-white/80 leading-relaxed">{artistOfTheDay.note}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-white/20 rounded-full p-3 mr-4 hover:bg-white/30 transition-all duration-300 cursor-pointer">
                          <PlayIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-white font-medium">Listen to {artistOfTheDay.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Trending Artists */}
                <div className="mt-6 mb-2">
                  <h2 className="text-3xl font-bold mb-4 text-white">Trending Artists</h2>
                  <div className="flex flex-nowrap overflow-x-auto gap-2 hide-scrollbar">
                    {trendingArtists.map((artist) => (
                      <div 
                        key={artist.id} 
                        className="group bg-white/3 backdrop-blur-sm rounded-xl p-2 hover:bg-white/5 transition-all duration-300 cursor-pointer flex-shrink-0 w-[160px]"
                      >
                        <div className="aspect-square bg-white/5 rounded-lg mb-2 relative overflow-hidden">
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{artist.name}</h3>
                        <p className="text-sm text-white/60 truncate">{artist.monthlyListeners} monthly listeners</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Artist Interviews */}
                <div className="mt-6 mb-2">
                  <h2 className="text-3xl font-bold mb-4 text-white">You may also like</h2>
                  <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 hide-scrollbar">
                    <div className="bg-white/3 backdrop-blur-sm rounded-xl p-4 hover:bg-white/5 transition-all duration-300 flex-shrink-0 w-full md:w-[400px]">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src="https://www.youtube.com/embed/T_fw3qNx1OM?si=spKs3yYgzo9JfLgL" 
                          title="Dua Lipa Interview" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                    <div className="bg-white/3 backdrop-blur-sm rounded-xl p-4 hover:bg-white/5 transition-all duration-300 flex-shrink-0 w-full md:w-[400px]">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src="https://www.youtube.com/embed/UB1ykIbMU0E?si=2cGJBjdNfYdDg4EY" 
                          title="Billie Eilish Interview" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                    <div className="bg-white/3 backdrop-blur-sm rounded-xl p-4 hover:bg-white/5 transition-all duration-300 flex-shrink-0 w-full md:w-[400px]">
                      <div className="aspect-video w-full overflow-hidden rounded-lg">
                        <iframe 
                          width="100%" 
                          height="100%" 
                          src="https://www.youtube.com/embed/4lPD5PtqMiE?si=k0m-8SCYCo3BLnLW" 
                          title="Taylor Swift Interview" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          referrerPolicy="strict-origin-when-cross-origin" 
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tune In Section */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  activeSection === 'tune-in' 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-4 invisible absolute'
                }`}
              >
                <div className="w-full">
                  <div className="flex flex-col gap-6 relative z-20">
                    {freshOutAlbums.filter(album => !album.hidden).map((album) => (
                      <div 
                        key={album.id} 
                        className="group w-full overflow-hidden rounded-xl border border-transparent hover:border-white/10 transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                      >
                        <div className="relative w-full h-[250px] md:h-[300px] flex flex-col md:flex-row">
                          <div className="relative w-full md:w-1/2 h-full">
                            <Image 
                              src={album.image} 
                              alt={album.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                          <div className="w-full md:w-1/2 bg-transparent backdrop-blur-sm flex flex-col justify-center p-8">
                            <h3 className="text-2xl font-bold mb-1 text-white">{album.title}</h3>
                            <p className="text-lg text-white/90 mb-1">{album.artist}</p>
                            <p className="text-sm text-white/70 mb-2">{album.year}</p>
                            <p className="text-base text-white/80 max-w-xl">{album.description}</p>
                            <div className="mt-3 flex items-center">
                              <div 
                                className="bg-white/20 rounded-full p-2 mr-3 group-hover:bg-white/30 transition-all duration-300 cursor-pointer"
                                onClick={() => album.audioFile && togglePlay(album)}
                              >
                                <PlayIcon className="w-5 h-5 text-white" />
                              </div>
                              <span className="text-sm font-medium text-white">Listen Now</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Mood Section */}
              <div 
                className={`transition-all duration-500 ease-in-out ${
                  activeSection === 'mood' 
                    ? 'opacity-100 translate-y-0 visible' 
                    : 'opacity-0 translate-y-4 invisible absolute'
                }`}
              >
                <div className="w-full flex items-center justify-center py-16 min-h-[calc(100vh-200px)]">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-white">Coming Soon</h2>
                    <p className="text-white/70 text-lg">Personalized music based on your mood</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Audio Player */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50 m-0 p-0">
            <div 
              className={`relative bg-white/10 backdrop-blur-md rounded-t-xl border-t border-white/20 w-full max-w-md shadow-[0_-10px_30px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 ease-out origin-bottom ${
                isExpanded 
                  ? 'h-[calc(100vh-2rem)] max-w-none m-4 rounded-xl scale-100' 
                  : 'p-4 scale-100'
              }`}
            >
              {/* Background Image */}
              {currentTrack.poster && (
                <div className={`absolute inset-0 -z-10 transition-opacity duration-500 ${
                  isExpanded ? 'opacity-30' : 'opacity-[0.15]'
                }`}>
                  <Image
                    src={currentTrack.poster}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                </div>
              )}

              {/* Expanded View Content */}
              {isExpanded && (
                <>
                  {/* Top Controls */}
                  <div className="absolute top-4 right-4 flex items-center gap-4 z-10">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsExpanded(false)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                    >
                      <XMarkIcon className="w-6 h-6 text-white" />
                    </button>
                  </div>

                  {/* Expanded Content */}
                  <div className="flex flex-col items-center justify-center h-full py-12 px-4 space-y-6 opacity-0 animate-fade-in">
                    {/* Album Art */}
                    <div className="relative w-full max-w-md aspect-square">
                      {currentTrack.poster ? (
                        <Image
                          src={currentTrack.poster}
                          alt={currentTrack.title || ''}
                          fill
                          className="object-contain rounded-lg"
                          priority
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 rounded-lg flex items-center justify-center">
                          <PlayIcon className="w-24 h-24 text-white/30" />
                        </div>
                      )}
                    </div>

                    {/* Track Info and Controls */}
                    <div className="w-full max-w-md space-y-4">
                      {/* Track Info */}
                      <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h2>
                        <p className="text-lg text-white/70">{currentTrack.artist}</p>
                        {'year' in currentTrack && (
                          <p className="text-sm text-white/50">{currentTrack.year}</p>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div 
                        className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group"
                        onMouseDown={handleProgressMouseDown}
                        onMouseMove={handleProgressMouseMove}
                        onClick={handleProgressClick}
                      >
                        <div 
                          className="h-full bg-white/70 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                        <div 
                          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full transition-opacity duration-300 ${
                            isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                          style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                        ></div>
                      </div>

                      {/* Time Display */}
                      <div className="flex justify-between text-sm text-white/50">
                        <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                        <span>{formatTime(audioRef.current?.duration || 0)}</span>
                      </div>

                      {/* Playback Controls */}
                      <div className="flex items-center justify-center gap-8 mt-4">
                        {/* Volume/Mute Control */}
                        <button 
                          className="w-12 h-12 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-all duration-300"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <SpeakerXMarkIcon className="w-6 h-6" />
                          ) : (
                            <SpeakerWaveIcon className="w-6 h-6" />
                          )}
                        </button>

                        <div 
                          className="w-12 h-12 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-all duration-300"
                          onClick={() => handleSkipTrack('backward')}
                        >
                          <BackwardIcon className="w-6 h-6" />
                        </div>
                        
                        <div 
                          className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300"
                          onClick={() => togglePlay(currentTrack)}
                        >
                          {isPlaying ? (
                            <PauseIcon className="w-8 h-8 text-white" />
                          ) : (
                            <PlayIcon className="w-8 h-8 text-white" />
                          )}
                        </div>
                        
                        <div 
                          className="w-12 h-12 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-all duration-300"
                          onClick={() => handleSkipTrack('forward')}
                        >
                          <ForwardIcon className="w-6 h-6" />
                        </div>

                        {/* Heart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(currentTrack.id);
                          }}
                          className={`w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                            isShimmering ? 'animate-heart-bounce' : ''
                          }`}
                        >
                          {currentTrack && isTrackLiked(currentTrack.id) ? (
                            <HeartIcon className="w-6 h-6 text-red-500" />
                          ) : (
                            <HeartOutlineIcon className="w-6 h-6 text-white/60 hover:text-white" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Minimized Player Content */}
              {!isExpanded && (
                <>
                  {/* Progress Bar */}
                  <div 
                    className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer relative group"
                    onMouseDown={handleProgressMouseDown}
                    onMouseMove={handleProgressMouseMove}
                    onClick={handleProgressClick}
                  >
                    <div 
                      className="h-full bg-white/70 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                    <div 
                      className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full transition-opacity duration-300 ${
                        isDragging ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                      style={{ left: `${progress}%`, transform: 'translate(-50%, -50%)' }}
                    ></div>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-between relative z-10">
                    {/* Track Info */}
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{currentTrack.title}</p>
                      <p className="text-white/60 text-xs">{currentTrack.artist}</p>
                    </div>
                    
                    {/* Playback Controls */}
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-8 h-8 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-all duration-300"
                        onClick={() => handleSkipTrack('backward')}
                      >
                        <BackwardIcon className="w-4 h-4" />
                      </div>
                      
                      <div 
                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 transition-all duration-300"
                        onClick={() => togglePlay(currentTrack)}
                      >
                        {isPlaying ? (
                          <PauseIcon className="w-4 h-4 text-white" />
                        ) : (
                          <PlayIcon className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div 
                        className="w-8 h-8 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-all duration-300"
                        onClick={() => handleSkipTrack('forward')}
                      >
                        <ForwardIcon className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Right Controls */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                      <button 
                        className="p-2 text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
                        onClick={toggleMute}
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="w-4 h-4" />
                        ) : (
                          <SpeakerWaveIcon className="w-4 h-4" />
                        )}
                      </button>
                      
                      {currentTrack.poster && (
                        <button
                          onClick={() => setIsExpanded(true)}
                          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300"
                        >
                          <ArrowsPointingOutIcon className="w-4 h-4 text-white" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Time Display */}
                  <div className="flex justify-between text-xs text-white/50 mt-2 relative z-10">
                    <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                    <span>{formatTime(audioRef.current?.duration || 0)}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Logout Animation Screen */}
        {isLoggingOut && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <PageBackground />
            <div className={`text-white text-4xl font-medium ${showHopIn ? 'animate-fade-out' : 'animate-fade-in-smooth'}`}>
              Team <span className="shadows-into-light-two">Lumen</span> will miss you
            </div>
            {showHopIn && (
              <button 
                onClick={handleHopIn}
                className="absolute text-white text-2xl font-light bg-transparent px-8 py-4 rounded-full backdrop-blur-md transition-all duration-300 animate-fade-in-smooth border border-white/20 hover:border-white/40 hover:animate-border-shine"
              >
                <span className="flex items-center gap-2">
                  Hop in!
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}

        {/* Add keyframes for animations */}
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Shadows+Into+Light+Two&display=swap');
          
          .shadows-into-light-two {
            font-family: "Shadows Into Light Two", cursive;
            font-weight: 400;
            font-style: normal;
          }

          @keyframes shine {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -100% 0;
            }
          }

          .shining-text {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.4) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: shine 4s infinite linear;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeInSmooth {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.5s ease-out 0.3s forwards;
          }

          .animate-fade-in-smooth {
            animation: fadeInSmooth 1s ease-in-out forwards;
          }

          .animate-fade-out {
            animation: fadeOut 1s ease-in-out forwards;
          }

          @keyframes heartBounce {
            0% {
              transform: scale(1) rotate(0deg);
            }
            20% {
              transform: scale(1.3) rotate(-15deg) translateY(-6px);
            }
            40% {
              transform: scale(1.3) rotate(15deg) translateY(-8px);
            }
            60% {
              transform: scale(1.2) rotate(-10deg) translateY(-6px);
            }
            80% {
              transform: scale(1.1) rotate(5deg) translateY(-3px);
            }
            100% {
              transform: scale(1) rotate(0deg) translateY(0);
            }
          }

          .animate-heart-bounce {
            animation: heartBounce 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
          }

          @keyframes dropdown {
            from {
              opacity: 0;
              transform: scale(0.95) translateY(1px);
            }
            to {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }

          .animate-dropdown {
            animation: dropdown 0.2s ease-out forwards;
          }
          
          /* Target the JSX generated class */
          .jsx-89789e1296143764 {
            min-height: unset !important;
            height: auto !important;
            overflow: visible !important;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .animate-marquee {
            animation: marquee 10s linear infinite;
            display: inline-block;
            padding-left: 100%;
          }

          @keyframes borderShine {
            0% {
              border-color: rgba(255, 255, 255, 0.4);
            }
            50% {
              border-color: rgba(255, 255, 255, 0.8);
            }
            100% {
              border-color: rgba(255, 255, 255, 0.4);
            }
          }

          .animate-border-shine {
            animation: borderShine 2s infinite linear;
          }
        `}</style>
        
        {/* Script to modify parent div */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              const rootDiv = document.querySelector('.jsx-89789e1296143764');
              if (rootDiv) {
                rootDiv.style.minHeight = 'unset';
                rootDiv.style.height = 'auto';
                rootDiv.style.overflow = 'visible';
              }
            });
          `
        }} />
      </div>
      
      {/* Minimalistic Footer */}
      <footer className="w-full py-6 mt-10">
        <div className="w-full max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-white/50 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Lumen Sounds. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Privacy</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Terms</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">Help</a>
            <a href="#" className="text-white/50 text-sm hover:text-white transition-colors duration-300">About</a>
          </div>
        </div>
      </footer>
    </div>
  );
} 