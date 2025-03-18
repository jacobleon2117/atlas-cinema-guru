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
  const [actionError, setActionError] = useState('');

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsFavorite(!isFavorite);
    
    try {
      setIsLoading(true);
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/favorites/${movie.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        setIsFavorite(isFavorite);
        setActionError('Failed to update favorites');
        setTimeout(() => setActionError(''), 3000);
      }
    } catch (error) {
      setIsFavorite(isFavorite);
      console.error('Error updating favorite status:', error);
      setActionError('Failed to update favorites');
      setTimeout(() => setActionError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleWatchLater = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;
    
    setIsWatchLater(!isWatchLater);
    
    try {
      setIsLoading(true);
      const method = isWatchLater ? 'DELETE' : 'POST';
      const response = await fetch(`/api/watch-later/${movie.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        setIsWatchLater(isWatchLater);
        setActionError('Failed to update watch later');
        setTimeout(() => setActionError(''), 3000);
      }
    } catch (error) {
      setIsWatchLater(isWatchLater);
      console.error('Error updating watch later status:', error);
      setActionError('Failed to update watch later');
      setTimeout(() => setActionError(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const description = movie.synposis || 
    `${movie.title} (${movie.released}) - A ${movie.genre.toLowerCase()} film.`;

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
      
      {/* Error message */}
      {actionError && (
        <div className="absolute top-2 left-0 right-0 mx-auto w-3/4 bg-red-500 text-white text-xs py-1 px-2 rounded text-center z-50">
          {actionError}
        </div>
      )}
      
      {isHovered && (
        <div className="absolute top-2 right-2 flex space-x-2 z-30">
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className={`text-white hover:text-[#54F4D0] transition-colors ${isLoading ? 'opacity-50' : ''}`}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg className="w-6 h-6" fill={isFavorite ? 'white' : 'none'} stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
          
          <button
            onClick={toggleWatchLater}
            disabled={isLoading}
            className={`text-white hover:text-[#54F4D0] transition-colors ${isLoading ? 'opacity-50' : ''}`}
            aria-label={isWatchLater ? 'Remove from watch later' : 'Add to watch later'}
          >
            {isWatchLater ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4 14.5L11 13V6h1.5v6.5l3.5 2z" 
                      fill="white" fillOpacity="0.4" stroke="white" strokeWidth="1.5" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
        </div>
      )}
      
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-[#00003C] pt-6 pb-6 px-5 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0 translate-y-full'
        }`}
        style={{
          height: 'auto',
          maxHeight: isHovered ? '70%' : '0',
          overflowY: 'auto'
        }}
      >
        <h3 className="text-2xl font-semibold mb-3 text-white">{movie.title} ({movie.released})</h3>
        <p className="text-white text-base mb-4">{description}</p>
        <div>
          <span className="bg-[#54F4D0] text-[#00003C] px-4 py-2 rounded-full text-base font-medium">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
}