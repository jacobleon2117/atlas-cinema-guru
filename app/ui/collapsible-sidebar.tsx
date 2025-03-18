'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CollapsibleSidebar({ activities }: { activities: any[] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <aside 
      className={`transition-all duration-300 bg-[#40d5b2] ${isHovered && !isMobile ? 'w-64' : isMobile ? 'w-full' : 'w-22'}`}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="p-4 flex flex-col">
        <nav className="flex flex-col space-y-6 mb-8">
          <Link href="/dashboard" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard' ? 'font-bold' : ''}`}>
            <div className={isMobile ? '' : !isHovered ? 'w-full flex justify-center' : 'w-6'}>
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2v11z"></path>
              </svg>
            </div>
            {(isHovered || isMobile) && <span className="ml-3">Home</span>}
          </Link>
          
          <Link href="/dashboard/favorites" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard/favorites' ? 'font-bold' : ''}`}>
            <div className={isMobile ? '' : !isHovered ? 'w-full flex justify-center' : 'w-6'}>
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            </div>
            {(isHovered || isMobile) && <span className="ml-3">Favorites</span>}
          </Link>
          
          <Link href="/dashboard/watch-later" className={`flex items-center text-white hover:opacity-80 ${pathname === '/dashboard/watch-later' ? 'font-bold' : ''}`}>
            <div className={isMobile ? '' : !isHovered ? 'w-full flex justify-center' : 'w-6'}>
              <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
              </svg>
            </div>
            {(isHovered || isMobile) && <span className="ml-3">Watch Later</span>}
          </Link>
        </nav>
      </div>
      
      {isHovered && !isMobile && (
        <div className="px-4 pb-4 mt-0">
          <div className="bg-[#54F4D0] rounded-md p-4 mb-16">
            <h3 className="text-lg font-semibold text-[#00003c] mb-2">Latest Activities</h3>
            <div className="max-h-[500px] overflow-y-auto">
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="text-sm">
                    <div className="text-[#00003c]">
                      {new Date(activity.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}, {new Date(activity.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true
                      })}
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
        </div>
      )}
    </aside>
  );
}