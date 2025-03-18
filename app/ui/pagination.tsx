'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ page, totalPages = 1 }: { page: number, totalPages?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const createPageURL = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNum.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="mt-8 flex justify-center">
      <div className="flex rounded-full overflow-hidden">
        <Link 
          href={page > 1 ? createPageURL(page - 1) : '#'}
          className={`py-3 px-6 bg-[#54F4D0] text-[#00003c] text-center font-medium border-r border-[#00003c]/10 ${
            page <= 1 ? 'opacity-50 pointer-events-none' : 'hover:bg-[#19b995] transition-colors'
          }`}
          aria-disabled={page <= 1}
          tabIndex={page <= 1 ? -1 : undefined}
        >
          Previous
        </Link>
        <Link 
          href={page < totalPages ? createPageURL(page + 1) : '#'}
          className={`py-3 px-6 bg-[#54F4D0] text-[#00003c] text-center font-medium ${
            page >= totalPages ? 'opacity-50 pointer-events-none' : 'hover:bg-[#19b995] transition-colors'
          }`}
          aria-disabled={page >= totalPages}
          tabIndex={page >= totalPages ? -1 : undefined}
        >
          Next
        </Link>
      </div>
      <div className="ml-4 text-white hidden md:flex items-center">
        Page {page} of {totalPages}
      </div>
    </div>
  );
}