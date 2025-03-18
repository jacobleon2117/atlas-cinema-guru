'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ page }: { page: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const createPageURL = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex rounded-full overflow-hidden">
        <Link 
          href={page > 1 ? createPageURL(page - 1) : '#'}
          className={`py-3 px-6 bg-[#54F4D0] text-[#00003c] text-center font-medium border-r border-[#00003c]/10 ${
            page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-[#19b995]'
          }`}
        >
          Previous
        </Link>
        <Link 
          href={createPageURL(page + 1)}
          className="py-3 px-6 bg-[#54F4D0] text-[#00003c] text-center font-medium hover:bg-[#19b995]"
        >
          Next
        </Link>
      </div>
    </div>
  );
}