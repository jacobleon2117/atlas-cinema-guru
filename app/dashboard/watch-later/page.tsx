import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchWatchLaters } from '@/lib/data';
import MovieCard from '@/app/ui/movie-card';
import Pagination from '@/app/ui/pagination';

export default async function WatchLaterPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    query?: string;
    minYear?: string;
    maxYear?: string;
  };
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }
  
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const query = searchParams?.query || '';
  const minYear = searchParams?.minYear ? Number(searchParams.minYear) : 1990;
  const currentYear = new Date().getFullYear();
  const maxYear = searchParams?.maxYear ? Number(searchParams.maxYear) : currentYear;
  
  const movies = await fetchWatchLaters(page, session.user.email, minYear, maxYear, query);
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Watch Later</h1>
      
      {movies.length === 0 ? (
        <></>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          
          <Pagination page={page} totalPages={Math.ceil(movies.length / 6)} />
        </>
      )}
    </div>
  );
}