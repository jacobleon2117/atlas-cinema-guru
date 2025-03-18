'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from 'use-debounce';

interface FilterableMovieListProps {
  initialQuery: string;
  initialMinYear: number;
  initialMaxYear: number;
  initialSelectedGenres: string[];
  allGenres: string[];
  currentYear: number;
}

export default function FilterableMovieList({ 
  initialQuery,
  initialMinYear,
  initialMaxYear,
  initialSelectedGenres,
  allGenres,
  currentYear
}: FilterableMovieListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);
  const [minYear, setMinYear] = useState(initialMinYear);
  const [maxYear, setMaxYear] = useState(initialMaxYear);
  
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  
  const isInitialMount = useRef(true);
  
  const updateURL = useCallback(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const currentParams = new URLSearchParams(searchParams.toString());
    const currentQuery = currentParams.get('query') || '';
    const currentMinYear = currentParams.get('minYear') || '1990';
    const currentMaxYear = currentParams.get('maxYear') || currentYear.toString();
    const currentGenres = currentParams.get('genres')?.split(',') || [];
    
    const queryChanged = debouncedQuery !== currentQuery;
    const minYearChanged = minYear.toString() !== currentMinYear;
    const maxYearChanged = maxYear.toString() !== currentMaxYear;
    
    let genresChanged = false;
    if (selectedGenres.length !== currentGenres.length) {
      genresChanged = true;
    } else if (selectedGenres.some(g => !currentGenres.includes(g))) {
      genresChanged = true;
    }
    
    if (queryChanged || minYearChanged || maxYearChanged || genresChanged) {
      const params = new URLSearchParams();
      
      if (debouncedQuery) {
        params.set('query', debouncedQuery);
      }
      
      params.set('minYear', minYear.toString());
      params.set('maxYear', maxYear.toString());
      
      if (selectedGenres.length > 0) {
        params.set('genres', selectedGenres.join(','));
      }
      
      params.set('page', '1');
      
      router.push(`/dashboard?${params.toString()}`, { scroll: false });
    }
  }, [debouncedQuery, minYear, maxYear, selectedGenres, router, searchParams, currentYear]);
  
  useEffect(() => {
    updateURL();
  }, [updateURL]);
  
  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };
  
  const handleYearChange = (value: string, setter: React.Dispatch<React.SetStateAction<number>>, defaultValue: number) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1900 && numValue <= currentYear) {
      setter(numValue);
    } else if (value === '') {
      setter(defaultValue);
    }
  };
  
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="mb-4">
          <label htmlFor="search" className="block text-white mb-2">Search</label>
          <input 
            type="text" 
            id="search" 
            placeholder="Search Movies..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 border border-[#54F4D0] rounded-full text-white focus:outline-none"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Min Year</label>
            <input 
              type="number" 
              value={minYear}
              onChange={(e) => handleYearChange(e.target.value, setMinYear, initialMinYear)}
              min="1900" 
              max={currentYear}
              className="w-full px-4 py-3 border border-[#54F4D0] rounded-full text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Max Year</label>
            <input 
              type="number" 
              value={maxYear}
              onChange={(e) => handleYearChange(e.target.value, setMaxYear, initialMaxYear)}
              min="1900" 
              max={currentYear}
              className="w-full px-4 py-3 border border-[#54F4D0] rounded-full text-white focus:outline-none"
            />
          </div>
        </div>
      </div>
      
      <div className="flex-1">
        <label className="block text-white mb-2">Genres</label>
        <div className="flex flex-wrap gap-2">
          {allGenres.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                selectedGenres.includes(genre) 
                  ? 'bg-[#54F4D0] text-[#00003c] border-[#54F4D0]' 
                  : 'bg-transparent text-white border-[#54F4D0] hover:bg-[#54F4D0] hover:text-[#00003c]'
              }`}
              type="button"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}