'use client';
import Image from 'next/image';
import { useState } from 'react';

type MovieType = {
  id: string;
  title: string;
  synposis: string;
  released: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
  image: string;
};

export default function MovieCard({ movie }: { movie: MovieType }) {
  const [isFavorite, setIsFavorite] = useState(movie.favorited);
  const [isWatchLater, setIsWatchLater] = useState(movie.watchLater);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/favorites/${movie.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error updating favorite status:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleWatchLater = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const method = isWatchLater ? 'DELETE' : 'POST';
      const response = await fetch(`/api/watch-later/${movie.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        setIsWatchLater(!isWatchLater);
      }
    } catch (error) {
      console.error('Error updating watch later status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="relative rounded-lg overflow-hidden shadow-lg border-2 border-[#54F4D0]"
      style={{ aspectRatio: '1/1' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full relative">
        <Image
          src={movie.image || '/assets/placeholder.svg'}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={movie.id === '665cb6f0-0d20-43ae-9a29-cf374c4d3805'}
        />
      </div>
      
      {isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2 z-30">
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className="text-white hover:text-[#54F4D0]"
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg 
              className="w-6 h-6" 
              fill={isFavorite ? 'white' : 'none'} 
              stroke="white" 
              strokeWidth="1.5"
              viewBox="0 0 24 24" 
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
              />
            </svg>
          </button>
          
          <button
            onClick={toggleWatchLater}
            disabled={isLoading}
            className="text-white hover:text-[#54F4D0]"
            aria-label={isWatchLater ? 'Remove from watch later' : 'Add to watch later'}
          >
            <svg 
              className="w-6 h-6" 
              fill={isWatchLater ? 'white' : 'none'} 
              stroke="white" 
              strokeWidth="1.5"
              viewBox="0 0 24 24" 
            >
              {isWatchLater ? (
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              )}
            </svg>
          </button>
        </div>
      )}
      
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-[#00003C] pt-6 pb-6 px-5 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 translate-y-full'
        }`}
        style={{
          height: 'auto',
          maxHeight: isHovered ? '45%' : '0',
        }}
      >
        <h3 className="text-2xl font-semibold mb-3 text-white">{movie.title} ({movie.released})</h3>
        <p className="text-white text-base mb-4">{movie.synposis}</p>
        <div>
          <span className="bg-[#54F4D0] text-[#00003C] px-4 py-2 rounded-full text-base font-medium">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
}