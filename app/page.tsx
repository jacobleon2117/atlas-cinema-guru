import { fetchTitles, fetchGenres } from '@/lib/data';
import { auth } from '@/auth';
import MovieCard from '@/app/ui/movie-card';
import Pagination from '@/app/ui/pagination';
import FilterableMovieList from '@/app/ui/filterable-movie-list';

export default async function DashboardPage({
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
  
  const params = await searchParams;
  const page = params?.page ? Number(params.page) : 1;
  const query = params?.query || '';
  const minYear = params?.minYear ? Number(params.minYear) : 1990;
  const currentYear = new Date().getFullYear();
  const maxYear = params?.maxYear ? Number(params.maxYear) : currentYear;
  
  const allGenres = await fetchGenres();
  
  const selectedGenres = params?.genres ? params.genres.split(',') : [];
  
  const genresForFetch = selectedGenres.length > 0 ? selectedGenres : allGenres;
  
  const movies = await fetchTitles(
    page,
    minYear,
    maxYear,
    query,
    genresForFetch,
    session.user.email
  );
  
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
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      <Pagination page={page} searchParams={searchParams} />
    </div>
  );
}