'use client';
import Image from 'next/image';
import { useState } from 'react';

type MovieWithTypo = {
  id: string;
  title: string;
  synposis: string;
  released: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
  image: string;
};

export default function MovieCard({ movie }: { movie: MovieWithTypo }) {
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
      className="relative rounded-lg overflow-hidden shadow-lg border-2 border-[#1ED2AF]"
      style={{ aspectRatio: '1/1' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full h-full">
        <Image
          src={movie.image || '/assets/placeholder.svg'}
          alt={movie.title}
          fill
          className={`object-cover transition-all duration-300 ${isHovered ? 'scale-90' : 'scale-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className={`absolute top-2 right-2 flex space-x-2 z-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className={`p-2 rounded-full ${
            isFavorite ? 'bg-[#1ED2AF] text-[#00003c]' : 'bg-white/10 text-white hover:bg-white/20'
          } transition-colors`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg 
            className="w-5 h-5" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
            />
          </svg>
        </button>
        
        <button
          onClick={toggleWatchLater}
          disabled={isLoading}
          className={`p-2 rounded-full ${
            isWatchLater ? 'bg-[#1ED2AF] text-[#00003c]' : 'bg-white/10 text-white hover:bg-white/20'
          } transition-colors`}
          aria-label={isWatchLater ? 'Remove from watch later' : 'Add to watch later'}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </button>
      </div>
      
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-[#000020] bg-opacity-90 p-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h3 className="text-xl font-semibold mb-2 text-white">{movie.title} ({movie.released})</h3>
        <div className="mb-2">
          <span className="bg-[#1ED2AF] text-[#00003c] px-3 py-1 rounded-full text-sm font-medium">
            {movie.genre}
          </span>
        </div>
        <p className="text-gray-300 text-sm">{movie.synposis}</p>
      </div>
    </div>
  );
}