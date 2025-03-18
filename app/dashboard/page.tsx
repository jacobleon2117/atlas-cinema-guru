import { Suspense } from 'react';
import { fetchTitles, fetchGenres } from '@/lib/data';
import { auth } from '@/auth';
import MovieCard from '@/app/ui/movie-card';
import Pagination from '@/app/ui/pagination';
import FilterableMovieList from '../ui/filterable-movie-list';
import { UsersTitle } from '@/lib/definitions';

export default function DashboardPage({
  searchParams,
}: {
  searchParams?: { 
    page?: string;
    query?: string;
    minYear?: string;
    maxYear?: string;
    genres?: string;
  };
}) {
  return (
    <Suspense fallback={<div className="text-white text-center py-10">Loading...</div>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({
  searchParams,
}: {
  searchParams?: { 
    page?: string;
    query?: string;
    minYear?: string;
    maxYear?: string;
    genres?: string;
  };
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return <div className="text-white text-center py-10">Please log in to view content</div>;
  }
  
  
  const params = searchParams ? await Promise.resolve(searchParams) : {};
  
  const page = params.page ? Number(params.page) : 1;
  const query = params.query || '';
  const minYear = params.minYear ? Number(params.minYear) : 1990;
  const currentYear = new Date().getFullYear();
  const maxYear = params.maxYear ? Number(params.maxYear) : currentYear;
  
  try {
    const [allGenres, titles] = await Promise.all([
      fetchGenres(),
      fetchTitles(
        page,
        minYear,
        maxYear,
        query,
        params.genres ? params.genres.split(',') : [],
        session.user.email
      )
    ]);
    
    const selectedGenres = params.genres 
      ? params.genres.split(',')
      : [];
    
    const itemsPerPage = 6;
    const totalPages = Math.max(1, Math.ceil(titles.length / itemsPerPage));
    
    return (
      <div>
        <div className="mb-8">
          <FilterableMovieList 
            initialQuery={query}
            initialMinYear={minYear}
            initialMaxYear={maxYear}
            initialSelectedGenres={selectedGenres}
            allGenres={allGenres}
            currentYear={currentYear}
          />
        </div>
        
        {titles.length === 0 ? (
          <div className="text-white text-center py-10">
            No movies found matching your criteria
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {titles.map((title: UsersTitle) => (
                <MovieCard 
                  key={title.id} 
                  movie={title} 
                />
              ))}
            </div>
            
            <Pagination 
              page={page} 
              totalPages={totalPages} 
            />
          </>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return <div className="text-white text-center py-10">Error loading content. Please try again.</div>;
  }
}