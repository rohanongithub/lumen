'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { HeartIcon, PlayIcon, PauseIcon, BackwardIcon, ForwardIcon, SpeakerXMarkIcon, SpeakerWaveIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

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
  year?: string;
  image: string;
  description?: string;
  audioFile?: string;
  poster?: string;
  hidden?: boolean;
}

// Sample song data - same as in the home page
const topPicks: Song[] = [
  { id: 1, title: 'Midnight Rain', artist: 'Taylor Swift', audioFile: '/audio/[4K] Taylor Swift - Midnight Rain (From The Eras Tour).mp3', poster: '/midnightrain.png' },
  { id: 2, title: 'As It Was', artist: 'Harry Styles', audioFile: '/audio/Harry Styles - As It Was (Official Video).mp3', poster: '/asitwas.png' },
  { id: 3, title: 'About Damn Time', artist: 'Lizzo', audioFile: '/audio/Lizzo - About Damn Time [Official Video].mp3', poster: '/aboutdamntime.png' },
  { id: 4, title: 'STAY', artist: 'The Kid LAROI, Justin Bieber', audioFile: '/audio/The Kid LAROI, Justin Bieber - STAY (Official Video).mp3', poster: '/stay.png' },
  { id: 5, title: 'Bad Habit', artist: 'Steve Lacy', audioFile: '/audio/Steve Lacy - Bad Habit (Official Video).mp3', poster: '/badhabits.png' },
  { id: 6, title: 'Flowers', artist: 'Miley Cyrus', audioFile: '/audio/Miley Cyrus - Flowers (Official Video).mp3', poster: '/flowers.jpg' },
  { id: 7, title: 'Anti-Hero', artist: 'Taylor Swift', audioFile: '/audio/Taylor Swift - Anti-Hero (Official Music Video).mp3', poster: '/antihero.png' },
  { id: 8, title: 'Rich Flex', artist: 'Drake, 21 Savage', audioFile: '/audio/Drake, 21 Savage - Rich Flex (Audio).mp3', poster: '/richflex.png' },
  { id: 9, title: 'Unholy', artist: 'Sam Smith, Kim Petras', audioFile: '/audio/Sam Smith, Kim Petras - Unholy (Official Music Video).mp3', poster: '/unholy.png' },
  { id: 10, title: 'BREAK MY SOUL', artist: 'Beyoncé', audioFile: '/audio/Beyoncé - BREAK MY SOUL (Official Lyric Video).mp3', poster: '/breakmysoul.png' }
];

// Fresh Out albums data - same as in the home page
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
    poster: '/livin.jpg'
  },
  { 
    id: 3, 
    title: "Livin' Thing", 
    artist: 'Electric Light Orchestra', 
    year: '1976',
    image: '/images/electric.jpg',
    description: 'A vibrant hit from the album "A New World Record"',
    audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3',
    poster: '/livin.jpg'
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
    image: '/asitwas.png',
    description: 'Urban rhythms and vintage vibes',
    audioFile: '/trafficinsky.mp3',
    poster: '/trafficsky.jpeg'
  },
  { 
    id: 6, 
    title: 'Walking on a Dream', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/aboutdamntime.png',
    description: 'A dreamy journey through sound',
    audioFile: '/walkinonadream.mp3',
    poster: '/walkingdream.jpeg'
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

// Combine all tracks for searching
const allTracks: (Song | Album)[] = [...topPicks, ...freshOutAlbums];

export default function FavoritesPage() {
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<(Song | Album)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Song | Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);

  // Function to load favorites from localStorage
  const loadFavorites = useCallback(() => {
    try {
      const savedLikes = localStorage.getItem('likedSongs');
      const likedIds = savedLikes ? JSON.parse(savedLikes) : [];
      setLikedSongs(likedIds);
      
      if (likedIds.length > 0) {
        const favoriteTracks = likedIds.map((id: number) => {
          const track = allTracks.find(track => track.id === id);
          if (!track) {
            console.warn(`Track with id ${id} not found in allTracks`);
            return null;
          }
          return track;
        }).filter(Boolean); // Remove any null entries
        setFavorites(favoriteTracks);
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      setFavorites([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Handle audio playback
  const handlePlayPause = (track: Song | Album) => {
    if (!track.audioFile) {
      console.error('No audio file available for this track');
      return;
    }

    if (currentTrack?.id === track.id) {
      if (isPlaying && audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  // Handle track changes and auto-play
  useEffect(() => {
    if (currentTrack?.audioFile && audioRef.current) {
      // Only set the source if it's a new track or first load
      if (!audioRef.current.src || !audioRef.current.src.endsWith(currentTrack.audioFile)) {
        audioRef.current.src = currentTrack.audioFile;
        audioRef.current.volume = volume;
        
        // Auto-play when track changes
        if (isPlaying) {
          audioRef.current.play().catch(error => {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentTrack]);
  
  // Handle volume and mute changes separately
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle removing from favorites
  const removeFromFavorites = (trackId: number) => {
    try {
      const newLikedSongs = likedSongs.filter(id => id !== trackId);
      setLikedSongs(newLikedSongs);
      localStorage.setItem('likedSongs', JSON.stringify(newLikedSongs));
      setFavorites(prev => prev.filter(item => item.id !== trackId));
      
      // Stop playback if removing current track
      if (currentTrack?.id === trackId) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  const handleProgressMouseDown = () => {
    setIsDragging(true);
  };

  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const width = rect.width;
      const newProgress = (offsetX / width) * 100;
      setProgress(newProgress);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentTrack && audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const width = rect.width;
      const newProgress = (offsetX / width) * 100;
      setProgress(newProgress);
      
      // Update audio current time
      const newTime = (newProgress / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleSkipTrack = (direction: 'backward' | 'forward') => {
    if (currentTrack && audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      let newTime: number;

      if (direction === 'backward') {
        newTime = Math.max(0, currentTime - 10);
      } else {
        newTime = Math.min(duration, currentTime + 10);
      }

      audioRef.current.currentTime = newTime;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Add this effect after the other useEffect hooks
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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <div className="max-w-5xl mx-auto px-4 md:pl-40 md:pr-4 mt-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
          </div>
          
          {isLoading ? (
            // Loading state
            <div className="flex justify-center items-center h-60">
              <div className="flex items-center space-x-3">
                <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          ) : favorites.length > 0 ? (
            // Display favorites grid
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {favorites.map((item) => (
                <div key={item.id} className="group">
                  <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                    <Image
                      src={'image' in item ? item.image : (item.poster || '/images/electric.jpg')}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Play/Pause Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handlePlayPause(item)}
                        className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-all duration-300 cursor-pointer"
                      >
                        {currentTrack?.id === item.id && isPlaying ? (
                          <PauseIcon className="w-6 h-6 text-white" />
                        ) : (
                          <PlayIcon className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-white text-sm">{item.title}</h3>
                  <p className="text-white/60 text-xs mt-1">{item.artist}</p>
                </div>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="bg-white/5 rounded-2xl p-10 text-center">
              <div className="mx-auto w-16 h-16 mb-6 text-white/30">
                <HeartIcon className="w-full h-full" />
              </div>
              <h2 className="text-xl font-medium text-white/90 mb-2">No favorites yet</h2>
              <p className="text-white/60 max-w-md mx-auto">
                Add favorites from the home page by clicking the heart icon on songs you love.
                They'll all appear here for easy access.
              </p>
            </div>
          )}
        </div>

        {/* Audio Player */}
        {currentTrack && (
          <div className="fixed bottom-0 left-0 right-0 flex justify-center z-[65] m-0 p-0 md:pb-0 pb-16">
            <div className="relative bg-white/10 backdrop-blur-md rounded-t-xl border-t border-white/20 w-full max-w-md shadow-[0_-10px_30px_rgba(0,0,0,0.3)] overflow-hidden p-4">
              {/* Background Image */}
              {currentTrack.poster && (
                <div className="absolute inset-0 -z-10 transition-opacity duration-500 opacity-[0.15]">
                  <Image
                    src={currentTrack.poster}
                    alt=""
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                </div>
              )}

              {/* Progress Bar */}
              <div 
                className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer relative group"
                onMouseDown={handleProgressMouseDown}
                onMouseMove={handleProgressMouseMove}
                onMouseUp={handleProgressMouseUp}
                onClick={handleProgressClick}
                style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
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
                    onClick={() => handlePlayPause(currentTrack)}
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
                </div>
              </div>
              
              {/* Time Display */}
              <div className="flex justify-between text-xs text-white/50 mt-2 relative z-10">
                <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
                <span>{formatTime(audioRef.current?.duration || 0)}</span>
              </div>

              {/* Hidden audio element for playback */}
              <audio 
                ref={audioRef} 
                style={{ display: 'none' }} 
                preload="auto"
                onTimeUpdate={() => {
                  if (audioRef.current) {
                    const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
                    setProgress(percent);
                  }
                }}
                onEnded={() => {
                  console.log('Track ended');
                  setIsPlaying(false);
                }}
                onError={(e) => {
                  console.error('Audio error:', e);
                  setIsPlaying(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
} 