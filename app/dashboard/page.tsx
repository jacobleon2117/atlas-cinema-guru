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
    <Suspense fallback={<div>Loading...</div>}>
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
    return <div>Loading...</div>;
  }
  
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const query = searchParams?.query || '';
  const minYear = searchParams?.minYear ? Number(searchParams.minYear) : 1990;
  const currentYear = new Date().getFullYear();
  const maxYear = searchParams?.maxYear ? Number(searchParams.maxYear) : currentYear;
  
  const [allGenres, titles] = await Promise.all([
    fetchGenres(),
    fetchTitles(
      page,
      minYear,
      maxYear,
      query,
      searchParams?.genres 
        ? searchParams.genres.split(',')
        : [],
      session.user.email
    )
  ]);
  
  const selectedGenres = searchParams?.genres 
    ? searchParams.genres.split(',')
    : allGenres;
  
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
        totalPages={Math.ceil(titles.length / 6)} 
      />
    </div>
  );
}