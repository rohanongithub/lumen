'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { HeartIcon } from '@heroicons/react/24/solid';
import { useTransition } from '@/components/TransitionProvider';

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

// Fresh Out albums data - same as in the home page
const freshOutAlbums: Album[] = [
  { 
    id: 101, 
    title: 'Mr. Blue Sky', 
    artist: 'Electric Light Orchestra', 
    year: '1977',
    image: '/images/electric.jpg',
    description: 'A masterpiece of orchestral pop from the album "Out of the Blue"',
    audioFile: '/mrbluesky.mp3',
    poster: '/mrblueposter.jpg'
  },
  { 
    id: 102, 
    title: "Don't Bring Me Down", 
    artist: 'Electric Light Orchestra', 
    year: '1979',
    image: '/images/car-vintage.jpg',
    description: 'A rock anthem from the album "Discovery"',
    audioFile: '/Electric Light Orchestra - Don\'t Bring Me Down (Official Video).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 103, 
    title: "Livin' Thing", 
    artist: 'Electric Light Orchestra', 
    year: '1976',
    image: '/images/concert.jpg',
    description: 'A vibrant hit from the album "A New World Record"',
    audioFile: '/Electric Light Orchestra - Livin\' Thing (Audio).mp3',
    poster: '/livin.jpg'
  },
  { 
    id: 104, 
    title: 'Vintage Roads', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/images/car-vintage.jpg',
    description: 'Classic melodies with a modern twist',
    audioFile: '/runaway.mp3',
    poster: '/runawayimage.jpeg'
  },
  { 
    id: 105, 
    title: 'Traffic in Sky', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/asitwas.png',
    description: 'Urban rhythms and vintage vibes',
    audioFile: '/trafficinsky.mp3',
    poster: '/trafficsky.jpeg'
  },
  { 
    id: 106, 
    title: 'Walking on a Dream', 
    artist: 'The Nostalgics', 
    year: '2023',
    image: '/aboutdamntime.png',
    description: 'A dreamy journey through sound',
    audioFile: '/walkinonadream.mp3',
    poster: '/walkingdream.jpeg'
  },
  { 
    id: 107, 
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
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<(Song | Album)[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load liked songs and get the exact tracks from our collection
  useEffect(() => {
    const loadFavorites = () => {
      setIsLoading(true);
      
      // Get liked song IDs from localStorage
      const savedLikes = localStorage.getItem('likedSongs');
      const likedIds = savedLikes ? JSON.parse(savedLikes) : [];
      setLikedSongs(likedIds);
      
      // Find the exact tracks with these IDs
      if (likedIds.length > 0) {
        const favoriteTracks = likedIds.map((id: number) => {
          // Find the track in our collection
          const track = allTracks.find(track => track.id === id);
          
          // If track found, return it, otherwise return a placeholder
          return track || {
            id,
            title: `Track ${id}`,
            artist: 'Unknown Artist',
            poster: '/images/electric.jpg' // Default image
          };
        });
        
        setFavorites(favoriteTracks);
      } else {
        setFavorites([]);
      }
      
      setIsLoading(false);
    };
    
    loadFavorites();
  }, []);

  return (
    <div className="min-h-screen pt-6 px-8 pb-24">
      <div className="max-w-5xl mx-auto mt-20">
        <h1 className="text-3xl font-bold text-white mb-8">Your Favorites</h1>
        
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
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="bg-white rounded-full p-3 transform scale-90 group-hover:scale-100 transition-all duration-300 text-black">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
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
    </div>
  );
} 