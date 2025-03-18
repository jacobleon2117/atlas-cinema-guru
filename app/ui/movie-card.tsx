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
            <svg className="w-6 h-6" fill={isFavorite ? 'white' : 'none'} stroke="white" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </button>
          
          <button
            onClick={toggleWatchLater}
            disabled={isLoading}
            className="text-white hover:text-[#54F4D0]"
            aria-label={isWatchLater ? 'Remove from watch later' : 'Add to watch later'}
          >
            {isWatchLater ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" fill="white" fillOpacity="0.2" />
                <path stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" d="M12 6v6l4 2" />
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
          maxHeight: isHovered ? '45%' : '0',
        }}
      >
        <h3 className="text-2xl font-semibold mb-3 text-white">{movie.title} ({movie.released})</h3>
        <p className="text-white text-base mb-4 line-clamp-3 overflow-hidden">{movie.synposis}</p>
        <div>
          <span className="bg-[#54F4D0] text-[#00003C] px-4 py-2 rounded-full text-base font-medium">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
}