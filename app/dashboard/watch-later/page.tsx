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
  };
}) {
  const session = await auth();
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }
  
  const params = await searchParams;
  const page = params?.page ? Number(params.page) : 1;
  
  const movies = await fetchWatchLaters(page, session.user.email);
  
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
          
          <Pagination page={page} />
        </>
      )}
    </div>
  );
}