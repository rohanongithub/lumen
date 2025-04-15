'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  coverUrl: string;
}

const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    duration: '5:55',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b'
  },
  {
    id: '2',
    title: 'Stairway to Heaven',
    artist: 'Led Zeppelin',
    album: 'Led Zeppelin IV',
    duration: '8:02',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69'
  },
  {
    id: '3',
    title: 'Hotel California',
    artist: 'Eagles',
    album: 'Hotel California',
    duration: '6:30',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273d0e950fe2053cf719141d8a5'
  },
  {
    id: '4',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: '5:56',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738b0fe9ee7124b611b3a1d5b1'
  },
  {
    id: '5',
    title: 'Smells Like Teen Spirit',
    artist: 'Nirvana',
    album: 'Nevermind',
    duration: '5:01',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b273b0b75437b9a00fbdf699c6e9'
  },
  {
    id: '6',
    title: 'Imagine',
    artist: 'John Lennon',
    album: 'Imagine',
    duration: '3:04',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2730bae416a71235e0a5b1a3b4a'
  },
  {
    id: '7',
    title: 'Like a Rolling Stone',
    artist: 'Bob Dylan',
    album: 'Highway 61 Revisited',
    duration: '6:13',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2737ebde0a5bb07f53a99c1f911'
  },
  {
    id: '8',
    title: 'Purple Haze',
    artist: 'Jimi Hendrix',
    album: 'Are You Experienced',
    duration: '2:50',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2731a5b1a3b4a0b5b5b5b5b5b5b'
  },
  {
    id: '9',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: '4:54',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1324'
  },
  {
    id: '10',
    title: 'Superstition',
    artist: 'Stevie Wonder',
    album: 'Talking Book',
    duration: '4:26',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1325'
  },
  {
    id: '11',
    title: 'Dreams',
    artist: 'Fleetwood Mac',
    album: 'Rumours',
    duration: '4:14',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1326'
  },
  {
    id: '12',
    title: 'Take On Me',
    artist: 'a-ha',
    album: 'Hunting High and Low',
    duration: '3:48',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1327'
  },
  {
    id: '13',
    title: 'Sweet Dreams (Are Made of This)',
    artist: 'Eurythmics',
    album: 'Sweet Dreams (Are Made of This)',
    duration: '3:36',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1328'
  },
  {
    id: '14',
    title: 'Every Breath You Take',
    artist: 'The Police',
    album: 'Synchronicity',
    duration: '4:13',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1329'
  },
  {
    id: '15',
    title: 'Livin\' on a Prayer',
    artist: 'Bon Jovi',
    album: 'Slippery When Wet',
    duration: '4:09',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1330'
  },
  {
    id: '16',
    title: 'Sweet Child O\' Mine',
    artist: 'Guns N\' Roses',
    album: 'Appetite for Destruction',
    duration: '5:56',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b2738b0fe9ee7124b611b3a1d5b1'
  },
  {
    id: '17',
    title: 'With or Without You',
    artist: 'U2',
    album: 'The Joshua Tree',
    duration: '4:56',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1331'
  },
  {
    id: '18',
    title: 'Don\'t Stop Believin\'',
    artist: 'Journey',
    album: 'Escape',
    duration: '4:10',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1332'
  },
  {
    id: '19',
    title: 'Sweet Home Alabama',
    artist: 'Lynyrd Skynyrd',
    album: 'Second Helping',
    duration: '4:45',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1333'
  },
  {
    id: '20',
    title: 'Another Brick in the Wall, Part 2',
    artist: 'Pink Floyd',
    album: 'The Wall',
    duration: '3:59',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1334'
  },
  {
    id: '21',
    title: 'Thriller',
    artist: 'Michael Jackson',
    album: 'Thriller',
    duration: '5:57',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1335'
  },
  {
    id: '22',
    title: 'Back in Black',
    artist: 'AC/DC',
    album: 'Back in Black',
    duration: '4:15',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1336'
  },
  {
    id: '23',
    title: 'Sweet Emotion',
    artist: 'Aerosmith',
    album: 'Toys in the Attic',
    duration: '4:34',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1337'
  },
  {
    id: '24',
    title: 'Baba O\'Riley',
    artist: 'The Who',
    album: 'Who\'s Next',
    duration: '5:00',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1338'
  },
  {
    id: '25',
    title: 'Born to Run',
    artist: 'Bruce Springsteen',
    album: 'Born to Run',
    duration: '4:30',
    coverUrl: 'https://i.scdn.co/image/ab67616d0000b27326f3f3a04aee0a9b7b9b1339'
  }
];

export default function TrackList() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [visibleTracks, setVisibleTracks] = useState<number>(0);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const loadTracks = () => {
    // Shuffle the sample tracks and take 4
    const shuffled = [...sampleTracks].sort(() => 0.5 - Math.random());
    const selectedTracks = shuffled.slice(0, 4);
    setTracks(selectedTracks);
    setVisibleTracks(0);
    setImageErrors({});
    
    // Initialize loading state for all tracks
    const initialLoadingState = selectedTracks.reduce((acc, track) => {
      acc[track.id] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setImageLoading(initialLoadingState);

    // Show tracks one by one with a delay
    const timers = selectedTracks.map((_, index) => {
      return setTimeout(() => {
        setVisibleTracks(prev => prev + 1);
      }, index * 300); // 300ms delay between each track
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  };

  useEffect(() => {
    const cleanup = loadTracks();
    return cleanup;
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const cleanup = loadTracks();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
    return cleanup;
  };

  const handleImageLoad = (trackId: string) => {
    setImageLoading(prev => ({ ...prev, [trackId]: false }));
  };

  const handleImageError = (trackId: string) => {
    setImageLoading(prev => ({ ...prev, [trackId]: false }));
    setImageErrors(prev => ({ ...prev, [trackId]: true }));
  };

  const handleTrackClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // 3 seconds duration
  };

  const QuestionMarkIcon = () => (
    <svg
      className="w-6 h-6 text-white/60"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      {/* Toast Notification */}
      <div
        className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
          showToast ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="bg-green-500/20 backdrop-blur-sm text-green-400 px-6 py-3 rounded-lg shadow-lg border border-green-500/30">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Coming Soon</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      <div className="space-y-4">
        {tracks.map((track, index) => (
          <div
            key={track.id}
            onClick={handleTrackClick}
            className={`flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-500 transform cursor-pointer ${
              index < visibleTracks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="w-12 h-12 rounded-md mr-4 overflow-hidden bg-white/10 relative">
              {imageLoading[track.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
                </div>
              )}
              {imageErrors[track.id] ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                  <QuestionMarkIcon />
                </div>
              ) : (
                <Image
                  src={track.coverUrl}
                  alt={track.album}
                  width={48}
                  height={48}
                  className={`w-full h-full object-cover ${imageLoading[track.id] ? 'opacity-0' : 'opacity-100'}`}
                  onLoad={() => handleImageLoad(track.id)}
                  onError={() => handleImageError(track.id)}
                  priority={index === 0}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-medium truncate">{track.title}</h3>
              <p className="text-white/60 text-sm truncate">
                {track.artist} • {track.album}
              </p>
            </div>
            <span className="text-white/40 text-sm ml-4">{track.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 