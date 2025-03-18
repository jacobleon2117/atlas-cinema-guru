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
      <h1 className="text-3xl font-bold mb-6 text-white">Discover Movies</h1>
      
      <div className="bg-[#1c1f50] p-6 rounded-lg mb-8">
        <div className="mb-6">
          <label htmlFor="search" className="block text-white mb-2">Search</label>
          <input 
            type="text" 
            id="search" 
            placeholder="Search Movies..." 
            defaultValue={query}
            className="w-full px-4 py-3 bg-[#2d3166] border border-[#3d4185] rounded-full text-white focus:outline-none"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <label className="block text-white mb-2">Min Year</label>
            <input 
              type="number" 
              defaultValue={minYear}
              min="1900" 
              max={currentYear}
              className="w-full px-4 py-3 bg-[#2d3166] border border-[#3d4185] rounded-full text-white focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-white mb-2">Max Year</label>
            <input 
              type="number" 
              defaultValue={maxYear}
              min="1900" 
              max={currentYear}
              className="w-full px-4 py-3 bg-[#2d3166] border border-[#3d4185] rounded-full text-white focus:outline-none"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-white mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {allGenres.map(genre => (
              <button
                key={genre}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  selectedGenres.includes(genre) 
                    ? 'bg-[#1ED2AF] text-[#00003c]' 
                    : 'bg-[#2d3166] text-white hover:bg-[#3d4185]'
                }`}
              >
                {genre}
              </button>
            ))}
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