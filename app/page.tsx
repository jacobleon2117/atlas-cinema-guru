'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';

// Create a separate component that uses useSearchParams
function SignInButton() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  // Custom handler for GitHub sign-in
  const handleGitHubSignIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signIn('github', { callbackUrl });
  };

  return (
    <button 
      onClick={handleGitHubSignIn}
      style={{
        backgroundColor: 'white',
        color: 'black',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontSize: '1rem'
      }}
    >
      Sign in with GitHub
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        style={{ fill: 'black' }}
      >
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </button>
  );
}

// Main component with Suspense boundary
export default function SignIn() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f8f8]">
      <div className="bg-white w-full max-w-md p-8 rounded-lg shadow-md flex flex-col items-center">
        <div className="mb-6">
          <Image 
            src="/logo.png" 
            alt="Atlas School Logo" 
            width={200} 
            height={100} 
            className="mx-auto"
          />
        </div>
        
        <Suspense fallback={
          <button 
            disabled
            style={{
              backgroundColor: '#f3f4f6',
              color: '#9ca3af',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              padding: '0.75rem 1rem',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem'
            }}
          >
            Loading...
          </button>
        }>
          <SignInButton />
        </Suspense>
      </div>
    </div>
  );
}