// app/page.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Link from 'next/link';

export default async function Home() {
  const session = await auth();
  
  // If user is already logged in, redirect to dashboard
  if (session?.user) {
    redirect('/dashboard');
  }
  
  // If not logged in, show the welcome page with sign in button
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#00003c] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Cinema Guru</h1>
        <p className="mb-8 text-xl">Your personal movie tracking application</p>
        <Link 
          href="/api/auth/signin" 
          className="bg-[#1ED2AF] hover:bg-[#19b995] text-[#00003c] font-bold py-3 px-6 rounded-lg text-lg"
        >
          Sign In with GitHub
        </Link>
      </div>
    </div>
  );
}