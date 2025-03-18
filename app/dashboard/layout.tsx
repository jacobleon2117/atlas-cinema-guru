import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { fetchActivities } from '@/lib/data';
import CollapsibleSidebar from '@/app/ui/collapsible-sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect('/api/auth/signin');
  }
  
  const activities = await fetchActivities(1, session.user.email || '');

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-[#54F4D0] flex justify-between p-4 items-center">
        <div className="flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="#00003c" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <span className="font-bold text-[#00003c] text-xl">Cinema Guru</span>
        </div>
        <div className="flex items-center">
          <div className="mr-4 text-[#00003c] hidden md:block">Welcome, {session?.user?.email}</div>
          <form action={async () => {
            'use server';
            await signOut({ redirectTo: '/' });
          }}>
            <button type="submit" className="flex items-center text-[#00003c] font-medium">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </form>
        </div>
      </header>
      
      <div className="flex flex-1">
        <CollapsibleSidebar activities={activities} />
        
        <main className="flex-1 bg-[#00003c]">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}