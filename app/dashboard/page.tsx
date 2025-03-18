import { fetchTitles, fetchGenres } from '@/lib/data';
import { auth } from '@/auth';
import MovieCard from '@/app/ui/movie-card';
import Pagination from '@/app/ui/pagination';

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
  const selectedGenres = params?.genres ? params.genres.split(',') : allGenres;
  
  const movies = await fetchTitles(
    page,
    minYear,
    maxYear,
    query,
    selectedGenres,
    session.user.email
  );
  
  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="mb-4">
              <label htmlFor="search" className="block text-white mb-2">Search</label>
              <input 
                type="text" 
                id="search" 
                placeholder="Search Movies..." 
                defaultValue={query}
                className="w-full px-4 py-3 bg-[#2d3166] border border-[#54F4D0] rounded-full text-white focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Min Year</label>
                <input 
                  type="number" 
                  defaultValue={minYear}
                  min="1900" 
                  max={currentYear}
                  className="w-full px-4 py-3 bg-[#2d3166] border border-[#54F4D0] rounded-full text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-white mb-2">Max Year</label>
                <input 
                  type="number" 
                  defaultValue={maxYear}
                  min="1900" 
                  max={currentYear}
                  className="w-full px-4 py-3 bg-[#2d3166] border border-[#54F4D0] rounded-full text-white focus:outline-none"
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
  className={`px-4 py-2 rounded-full text-sm font-medium border border-[#54F4D0] transition-colors 
    bg-transparent hover:bg-[#54F4D0] hover:text-black`}
>
  {genre}
</button>

              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      <Pagination page={page} />
    </div>
  );
}