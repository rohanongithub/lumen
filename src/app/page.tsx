'use client';

import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, BackwardIcon, ForwardIcon, ArrowsPointingOutIcon, XMarkIcon, HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

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

// Sample song data - this would come from an API in a real app
const topPicks: Song[] = [
  { id: 1, title: 'Midnight Rain', artist: 'Taylor Swift', audioFile: '/mrbluesky.mp3', poster: '/midnightrain.png' },
  { id: 2, title: 'As It Was', artist: 'Harry Styles', audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3', poster: '/asitwas.png' },
  { id: 3, title: 'About Damn Time', artist: 'Lizzo', audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3', poster: '/aboutdamntime.png' },
  { id: 4, title: 'Stay', artist: 'Kid LAROI & Justin Bieber', audioFile: '/runaway.mp3', poster: '/stay.png' },
  { id: 5, title: 'Bad Habit', artist: 'Steve Lacy', audioFile: '/trafficinsky.mp3', poster: '/badhabits.png' },
  { id: 6, title: 'Flowers', artist: 'Miley Cyrus', audioFile: '/walkinonadream.mp3', poster: '/flowers.jpg' },
  { id: 7, title: 'Anti-Hero', artist: 'Taylor Swift', audioFile: '/mrbluesky.mp3', poster: '/antihero.png' },
  { id: 8, title: 'Rich Flex', artist: 'Drake & 21 Savage', audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3', poster: '/richflex.png' },
  { id: 9, title: 'Unholy', artist: 'Sam Smith & Kim Petras', audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3', poster: '/unholy.png' },
  { id: 10, title: 'Break My Soul', artist: 'Beyoncé', audioFile: '/runaway.mp3', poster: '/breakmysould.png' }
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

export default function Home() {
  const [activeSection, setActiveSection] = useState('fresh-out');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Album | Song | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isShimmering, setIsShimmering] = useState(false);
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Load liked songs from localStorage on mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedSongs');
    if (savedLikes) {
      setLikedSongs(JSON.parse(savedLikes));
    }
  }, []);

  // Save liked songs to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
  }, [likedSongs]);

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
  const toggleFavorite = () => {
    if (!currentTrack) return;

    const newLikedSongs = likedSongs.includes(currentTrack.id)
      ? likedSongs.filter(id => id !== currentTrack.id)
      : [...likedSongs, currentTrack.id];
    
    setLikedSongs(newLikedSongs);
    
    // Only trigger animation when liking
    if (!likedSongs.includes(currentTrack.id)) {
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
  const findNextTrack = (currentId: number, direction: 'forward' | 'backward', section: 'fresh-out' | 'top-picks') => {
    console.log(`Finding next track in section: ${section}`);
    
    // Get the appropriate tracks array based on section
    const tracks = section === 'fresh-out' ? freshOutAlbums : topPicks;
    console.log('Available tracks:', tracks.map(t => t.title));
    
    // Find current track index
    const currentIndex = tracks.findIndex(track => track.id === currentId);
    console.log('Current track index:', currentIndex);
    
    if (currentIndex === -1) {
      console.log('Current track not found in section');
      return null;
    }
    
    // Calculate next index
    let nextIndex;
    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % tracks.length;
    } else {
      nextIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    }
    console.log('Next track index:', nextIndex);
    
    const nextTrack = tracks[nextIndex];
    console.log('Selected next track:', nextTrack.title);
    
    return nextTrack;
  };

  // Handle forward/backward
  const handleSkipTrack = (direction: 'forward' | 'backward') => {
    if (!currentTrack) return;
    
    console.log('Current track:', currentTrack.title, 'ID:', currentTrack.id);
    console.log('Active section:', activeSection);
    
    // Determine which section the current track is from
    let section: 'fresh-out' | 'top-picks';
    
    // Check if the track is in the freshOutAlbums array
    const isInFreshOut = freshOutAlbums.some(album => album.id === currentTrack.id);
    console.log('Is in fresh-out:', isInFreshOut);
    
    // Check if the track is in the topPicks array
    const isInTopPicks = topPicks.some(song => song.id === currentTrack.id);
    console.log('Is in top-picks:', isInTopPicks);
    
    if (isInFreshOut) {
      section = 'fresh-out';
    } 
    else if (isInTopPicks) {
      section = 'top-picks';
    } 
    // Default to the active section if we can't determine
    else {
      section = activeSection as 'fresh-out' | 'top-picks';
    }
    
    console.log(`Skipping ${direction} in section: ${section}`);
    const nextTrack = findNextTrack(currentTrack.id, direction, section);
    
    if (nextTrack) {
      console.log(`Next track: ${nextTrack.title} (${nextTrack.artist})`);
      togglePlay(nextTrack);
    }
  };

  // Add keyboard event listener for spacebar
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && currentTrack) {
        event.preventDefault(); // Prevent page scroll
        if (isPlaying) {
          audioRef.current?.pause();
        } else {
          audioRef.current?.play().catch(error => {
            console.error('Error playing audio:', error);
          });
        }
        setIsPlaying(!isPlaying);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentTrack, isPlaying]); // Re-run when currentTrack or isPlaying changes

  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden">
      <main className={`relative transition-all duration-500 ${isExpanded ? 'blur-sm' : ''}`}>
        <div className="relative z-10">
          <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-20">
            {/* Navigation Tabs */}
            <div className="flex space-x-8 mb-8 border-b border-white/10">
              <button 
                onClick={() => setActiveSection('fresh-out')}
                className={`pb-3 text-lg font-medium transition-all duration-300 ${
                  activeSection === 'fresh-out' 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Tune In
              </button>
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
            </div>
            
            {/* Tune In Section */}
            <div 
              className={`transition-all duration-500 ease-in-out ${
                activeSection === 'fresh-out' 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 translate-y-4 invisible absolute'
              }`}
            >
              <div className="w-full overflow-hidden">
                <div className="flex overflow-x-auto pb-4 gap-6 hide-scrollbar relative z-20 mb-12">
                  {freshOutAlbums.filter(album => !album.hidden).map((album) => (
                    <div 
                      key={album.id} 
                      className="group flex-shrink-0 w-[600px] overflow-hidden rounded-xl border border-transparent hover:border-white/10 transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                      <div className="relative w-full h-[400px]">
                        <Image 
                          src={album.image} 
                          alt={album.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
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
            
            {/* Top Picks Section with Artist of the Day */}
            <div 
              className={`transition-all duration-500 ease-in-out ${
                activeSection === 'top-picks' 
                  ? 'opacity-100 translate-y-0 visible' 
                  : 'opacity-0 translate-y-4 invisible absolute'
              }`}
            >
              {/* Top Picks Songs */}
              <h2 className="text-3xl font-bold mb-6 text-white">Top Picks</h2>
              <div className="w-full overflow-hidden">
                <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar mb-12">
                  {topPicks.map((song) => (
                    <div 
                      key={song.id} 
                      className="group flex-shrink-0 w-[200px] p-4 rounded-xl transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] cursor-pointer"
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
                      <h3 className="font-medium truncate text-white">{song.title}</h3>
                      <p className="text-sm text-white/70 truncate">{song.artist}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Artist of the Day */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white">Artist of the Day</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center p-6">
                  <div className="relative w-full md:w-1/2 h-[400px] bg-white/10 rounded-xl overflow-hidden">
                    <Image 
                      src={artistOfTheDay.image}
                      alt={artistOfTheDay.name}
                      fill
                      className="object-cover"
                      priority
        />
      </div>
                  <div className="w-full md:w-1/2">
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
            </div>
          </div>
      </div>
    </main>

      {/* Audio Player */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
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
                        onClick={toggleFavorite}
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

      {/* Add keyframes for animations */}
      <style jsx global>{`
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

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out 0.3s forwards;
        }

        .animate-heart-bounce {
          animation: heartBounce 0.6s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
        }
      `}</style>
    </div>
  );
} 