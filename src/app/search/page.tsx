'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon, PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, BackwardIcon, ForwardIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from '@/components/TransitionProvider';
import Footer from '@/components/Footer';

// Define types for our data
interface Album {
  id: number;
  title: string;
  artist: string;
  year?: string;
  image: string;
  audioFile?: string;
  poster?: string;
}

// Sample data for search results
const sampleAlbums: Album[] = [
  { 
    id: 1, 
    title: 'BREAK MY SOUL', 
    artist: 'Beyoncé',
    year: '2022',
    image: '/images/electric.jpg',
    audioFile: '/audio/Beyoncé - BREAK MY SOUL (Official Lyric Video).mp3',
    poster: '/mrblueposter.jpg'
  },
  { 
    id: 2, 
    title: 'Unholy', 
    artist: 'Sam Smith, Kim Petras',
    year: '2022',
    image: '/images/car-vintage.jpg',
    audioFile: '/audio/Sam Smith, Kim Petras - Unholy (Official Music Video).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 3, 
    title: 'Rich Flex', 
    artist: 'Drake, 21 Savage',
    year: '2022',
    image: '/images/concert.jpg',
    audioFile: '/audio/Drake, 21 Savage - Rich Flex (Audio).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 4, 
    title: 'Anti-Hero', 
    artist: 'Taylor Swift',
    year: '2022',
    image: '/images/car-vintage.jpg',
    audioFile: '/audio/Taylor Swift - Anti-Hero (Official Music Video).mp3',
    poster: '/runawayimage.jpeg'
  },
  { 
    id: 5, 
    title: 'Flowers', 
    artist: 'Miley Cyrus',
    year: '2023',
    image: '/asitwas.png',
    audioFile: '/audio/Miley Cyrus - Flowers (Official Video).mp3',
    poster: '/trafficsky.jpeg'
  },
  { 
    id: 6, 
    title: 'Bad Habit', 
    artist: 'Steve Lacy',
    year: '2022',
    image: '/aboutdamntime.png',
    audioFile: '/audio/Steve Lacy - Bad Habit (Official Video).mp3',
    poster: '/walkingdream.jpeg'
  },
  { 
    id: 7, 
    title: 'STAY', 
    artist: 'The Kid LAROI, Justin Bieber',
    year: '2021',
    image: '/images/concert.jpg',
    audioFile: '/audio/The Kid LAROI, Justin Bieber - STAY (Official Video).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 8, 
    title: 'About Damn Time', 
    artist: 'Lizzo',
    year: '2022',
    image: '/midnightrain.png',
    audioFile: '/audio/Lizzo - About Damn Time [Official Video].mp3',
    poster: '/midnightrain.png'
  },
  { 
    id: 9, 
    title: 'As It Was', 
    artist: 'Harry Styles',
    year: '2022',
    image: '/asitwas.png',
    audioFile: '/audio/Harry Styles - As It Was (Official Video).mp3',
    poster: '/asitwas.png'
  },
  { 
    id: 10, 
    title: 'Midnight Rain', 
    artist: 'Taylor Swift',
    year: '2022',
    image: '/aboutdamntime.png',
    audioFile: '/audio/[4K] Taylor Swift - Midnight Rain (From The Eras Tour).mp3',
    poster: '/aboutdamntime.png'
  }
];

// Collection of music quotes
const musicQuotes = [
  { quote: "Without music, life would be a mistake.", author: "Friedrich Nietzsche" },
  { quote: "Music is a higher revelation than all wisdom and philosophy.", author: "Ludwig van Beethoven" },
  { quote: "One good thing about music, when it hits you, you feel no pain.", author: "Bob Marley" },
  { quote: "Music expresses that which cannot be said and on which it is impossible to be silent.", author: "Victor Hugo" },
  { quote: "Where words fail, music speaks.", author: "Hans Christian Anderson" },
  { quote: "Music is the medicine of the breaking heart.", author: "Leigh Hunt" },
  { quote: "Music washes away from the soul the dust of everyday life.", author: "Red Auerbach" },
  { quote: "Music is enough for a lifetime, but a lifetime is not enough for music.", author: "Sergei Rachmaninov" },
  { quote: "After silence, that which comes nearest to expressing the inexpressible, is music.", author: "Aldous Huxley" },
  { quote: "Music is the art which most completely realizes the artistic idea.", author: "Oscar Wilde" },
  { quote: "I think music in itself is healing. It's an explosive expression of humanity.", author: "Billy Joel" },
  { quote: "If music be the food of love, play on.", author: "William Shakespeare" },
  { quote: "Music is what feelings sound like.", author: "Anonymous" },
  { quote: "The only proof he needed for the existence of God was music.", author: "Kurt Vonnegut" },
  { quote: "Ah, music. A magic beyond all we do here!", author: "J.K. Rowling" },
  { quote: "In a world filled with hate, we must still dare to hope.", author: "Michael Jackson" },
  { quote: "If you want to make the world a better place, take a look at yourself and make a change.", author: "Michael Jackson" },
  { quote: "I just hope I made you proud. That's all I ever wanted.", author: "Michael Jackson" },
  { quote: "My life has been a tapestry of rich and royal hue.", author: "Carole King" },
  { quote: "I've had good times and bad times and times when my race was run.", author: "Elvis Presley" },
  { quote: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
  { quote: "I'm not afraid of anything. The words 'fear' and 'afraid' are not in my vocabulary.", author: "Dolly Parton" },
  { quote: "What hurts the most is being so close and having so much to say and watching you walk away.", author: "Rascal Flatts" },
  { quote: "God blessed the broken road that led me straight to you.", author: "Rascal Flatts" },
  { quote: "I've been searchin' deep down in my soul, words that I'm hearin' are starting to get old.", author: "Rascal Flatts" },
  { quote: "Music has been my outlet, my gift to all of the lovers in this world.", author: "Freddie Mercury" },
  { quote: "We've got to all come together, and we've got to help each other, so we can be free.", author: "Stevie Wonder" },
  { quote: "Before we criticize a man, walk a mile in his shoes.", author: "Johnny Cash" },
  { quote: "You can't change the world but you can change yourself.", author: "Diana Ross" },
  { quote: "Yesterday, all my troubles seemed so far away.", author: "The Beatles" }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });
  const [showQuote, setShowQuote] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Album | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { startTransition } = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  // Select a random quote when the page loads and animate it in
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * musicQuotes.length);
    setRandomQuote(musicQuotes[randomIndex]);
    
    // Slight delay before showing the quote for a smooth appearance
    const quoteTimer = setTimeout(() => {
      setShowQuote(true);
    }, 800);
    
    return () => clearTimeout(quoteTimer);
  }, []);

  // Filter results when search query changes with a delay
  useEffect(() => {
    // Clear any previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setIsLoading(false);
      setShowResults(false);
      return;
    }

    // Set loading state
    setIsLoading(true);
    setShowResults(false);
    
    // Set a timeout to simulate processing/API call
    searchTimeout.current = setTimeout(() => {
      const filtered = sampleAlbums.filter(album => 
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Remove duplicates based on image paths
      const uniqueResults: Album[] = [];
      const imageSet = new Set<string>();
      
      filtered.forEach(album => {
        if (!imageSet.has(album.image)) {
          imageSet.add(album.image);
          uniqueResults.push(album);
        }
      });

      // Limit to 9 items for 3x3 grid
      setSearchResults(uniqueResults.slice(0, 9));
      setIsLoading(false);
      
      // Show results with a slight delay for transition effect
      setTimeout(() => {
        setShowResults(true);
      }, 50);
    }, 2000); // 2 second delay

    // Cleanup function
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchQuery]);

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsLoading(false);
    setShowResults(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Handle audio playback
  const handlePlayPause = (album: Album) => {
    if (!album.audioFile) {
      console.error('No audio file available for this track');
      return;
    }

    if (currentTrack?.id === album.id) {
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
      setCurrentTrack(album);
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

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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

  // Update progress bar while playing
  useEffect(() => {
    if (!audioRef.current) return;

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
  }, [currentTrack]);

  // Handle volume changes
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Handle forward/backward navigation
  const handleSkipTrack = (direction: 'forward' | 'backward') => {
    if (!currentTrack) return;
    
    // Find the current track's index in the search results
    const currentIndex = searchResults.findIndex(album => album.id === currentTrack.id);
    
    if (currentIndex === -1) return;
    
    // Calculate the next/previous index
    let nextIndex;
    if (direction === 'forward') {
      nextIndex = (currentIndex + 1) % searchResults.length;
    } else {
      nextIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
    }
    
    // Get the next/previous track
    const nextTrack = searchResults[nextIndex];
    
    if (nextTrack) {
      handlePlayPause(nextTrack);
    }
  };

  return (
    <div>
      <div className="min-h-screen w-full flex flex-col items-center">
        {/* Centered Translucent Search Bar */}
        <div className="w-full max-w-lg px-4 mt-32 mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none z-10">
              <MagnifyingGlassIcon className="h-5 w-5 text-white/70" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Vibe check..."
              className="w-full h-14 pl-12 pr-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/30 text-white placeholder-white/50 focus:outline-none transition-all duration-300 shadow-lg relative z-0"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-5 flex items-center"
              >
                <XMarkIcon className="h-5 w-5 text-white/60 hover:text-white" />
              </button>
            )}
          </div>
        </div>

        {/* Random Quote (shown only when no search is active) */}
        {!isLoading && searchQuery.trim() === '' && (
          <div 
            className={`text-center px-6 mt-12 mb-16 max-w-lg transform transition-all duration-1000 ease-in-out ${
              showQuote 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <p className="text-white/80 text-lg italic">"{randomQuote.quote}"</p>
            <p className={`text-white/60 text-sm mt-2 transition-opacity duration-1000 delay-500 ${
              showQuote ? 'opacity-100' : 'opacity-0'
            }`}>
              — {randomQuote.author}
            </p>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && searchQuery.trim() !== '' && (
          <div className="w-full max-w-2xl px-6 mb-6 flex justify-center">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
              <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
              <div className="h-2 w-2 bg-white/70 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        )}

        {/* Search Results Grid */}
        {!isLoading && searchResults.length > 0 && (
          <div className="w-full max-w-2xl px-6">
            <div className="grid grid-cols-3 gap-6">
              {searchResults.map((album, index) => (
                <div 
                  key={album.id} 
                  className={`flex flex-col transform transition-all duration-500 ${
                    showResults 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-square relative rounded-lg overflow-hidden mb-2 group">
                    <Image
                      src={album.image}
                      alt={album.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Play/Pause Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => handlePlayPause(album)}
                        className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-all duration-300 cursor-pointer"
                      >
                        {currentTrack?.id === album.id && isPlaying ? (
                          <PauseIcon className="w-6 h-6 text-white" />
                        ) : (
                          <PlayIcon className="w-6 h-6 text-white" />
                        )}
                      </button>
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white line-clamp-1">{album.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-1">{album.artist}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results Message */}
        {!isLoading && searchQuery.trim() !== '' && searchResults.length === 0 && (
          <div className={`text-center text-white/60 mt-8 transition-opacity duration-300 ${
            showResults ? 'opacity-100' : 'opacity-0'
          }`}>
            No matching albums found
          </div>
        )}

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

        {/* Add keyframes for animations */}
        <style jsx global>{`
          @keyframes goldenGlow {
            0% {
              box-shadow: 0 0 5px rgba(245, 158, 11, 0.3);
            }
            50% {
              box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
            }
            100% {
              box-shadow: 0 0 5px rgba(245, 158, 11, 0.3);
            }
          }

          input:focus {
            animation: goldenGlow 2s ease-in-out infinite;
          }
        `}</style>
      </div>
      <Footer />
    </div>
  );
} 