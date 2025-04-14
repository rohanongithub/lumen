'use client';

import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTransition } from '@/components/TransitionProvider';

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
    title: 'Mr. Blue Sky', 
    artist: 'Electric Light Orchestra',
    year: '1977',
    image: '/images/electric.jpg',
    audioFile: '/mrbluesky.mp3',
    poster: '/mrblueposter.jpg'
  },
  { 
    id: 2, 
    title: "Don't Bring Me Down", 
    artist: 'Electric Light Orchestra',
    year: '1979',
    image: '/images/car-vintage.jpg',
    audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 3, 
    title: "Livin' Thing", 
    artist: 'Electric Light Orchestra',
    year: '1976',
    image: '/images/concert.jpg',
    audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 4, 
    title: 'Vintage Roads', 
    artist: 'The Nostalgics',
    year: '2023',
    image: '/images/car-vintage.jpg',
    audioFile: '/runaway.mp3',
    poster: '/runawayimage.jpeg'
  },
  { 
    id: 5, 
    title: 'Traffic in Sky', 
    artist: 'The Nostalgics',
    year: '2023',
    image: '/asitwas.png',
    audioFile: '/trafficinsky.mp3',
    poster: '/trafficsky.jpeg'
  },
  { 
    id: 6, 
    title: 'Walking on a Dream', 
    artist: 'The Nostalgics',
    year: '2023',
    image: '/aboutdamntime.png',
    audioFile: '/walkinonadream.mp3',
    poster: '/walkingdream.jpeg'
  },
  { 
    id: 7, 
    title: 'Live at the Arena', 
    artist: 'The Concert Experience',
    year: '2023',
    image: '/images/concert.jpg'
  },
  { 
    id: 8, 
    title: 'Midnight Rain', 
    artist: 'Taylor Swift',
    image: '/midnightrain.png',
    audioFile: '/mrbluesky.mp3',
    poster: '/midnightrain.png'
  },
  { 
    id: 9, 
    title: 'As It Was', 
    artist: 'Harry Styles',
    image: '/asitwas.png',
    audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3',
    poster: '/asitwas.png'
  },
  { 
    id: 10, 
    title: 'About Damn Time', 
    artist: 'Lizzo',
    image: '/aboutdamntime.png',
    audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3',
    poster: '/aboutdamntime.png'
  },
  { 
    id: 11, 
    title: 'Bad Habit', 
    artist: 'Steve Lacy',
    image: '/badhabits.png',
    audioFile: '/trafficinsky.mp3',
    poster: '/badhabits.png'
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
  { quote: "Ah, music. A magic beyond all we do here!", author: "J.K. Rowling" }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Album[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [randomQuote, setRandomQuote] = useState({ quote: "", author: "" });
  const [showQuote, setShowQuote] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { startTransition } = useTransition();

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

  return (
    <div className="min-h-screen w-full flex flex-col items-center">
      {/* Centered Translucent Search Bar */}
      <div className="w-full max-w-lg px-4 mt-32 mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-white/70" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Vibe check..."
            className="w-full h-14 pl-12 pr-12 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 focus:border-white/40 text-white placeholder-white/50 focus:outline-none transition-all shadow-lg"
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
    </div>
  );
} 