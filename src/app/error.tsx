'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Uncaught Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-[#f3f4f6] flex flex-col items-center justify-center p-6 text-center">
      <h1 className="animate-heading text-3xl font-bold text-red-500 mb-2">Something went wrong!</h1>
      <p className="text-gray-300 text-sm max-w-md mb-6">
        An unexpected application error occurred. You can try recovering or return to the main dashboard.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow cursor-pointer transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg border border-slate-700 cursor-pointer transition-colors"
        >
          Back to Safety
        </Link>
      </div>
    </div>
  );
}
