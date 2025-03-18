'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CollapsibleSidebar({ activities }: { activities: any[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();

  return (
    <aside 
      className={`transition-all duration-300 bg-[#1ED2AF] ${isHovered ? 'w-56' : 'w-16'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 flex flex-col h-full">
        <nav className="flex flex-col space-y-6">
          <Link href="/dashboard" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard' ? 'font-bold' : ''}`}>
            <svg className="w-6 h-6 min-w-6" fill="white" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {isHovered && <span className="ml-3">Home</span>}
          </Link>
          
          <Link href="/dashboard/favorites" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard/favorites' ? 'font-bold' : ''}`}>
            <svg className="w-6 h-6 min-w-6" fill="white" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            {isHovered && <span className="ml-3">Favorites</span>}
          </Link>
          
          <Link href="/dashboard/watch-later" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard/watch-later' ? 'font-bold' : ''}`}>
            <svg className="w-6 h-6 min-w-6" fill="white" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {isHovered && <span className="ml-3">Watch Later</span>}
          </Link>
        </nav>
        
        {isHovered && (
          <div className="mt-8 bg-[#4ad9ba] rounded-md p-4">
            <h3 className="text-lg font-semibold text-[#00003c] mb-2">Latest Activities</h3>
            <div className="max-h-96 overflow-y-auto">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <div className="text-[#00003c]">
                      {new Date(activity.timestamp).toLocaleDateString()}, {new Date(activity.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                    <div className="text-[#00003c] font-medium">
                      {activity.activity === 'FAVORITED' ? 'Favorited ' : 'Added '}
                      <span className="font-bold">{activity.title}</span>
                      {activity.activity === 'WATCH_LATER' ? ' to watch later' : ''}
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <div className="text-[#00003c] text-sm">No recent activity</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}