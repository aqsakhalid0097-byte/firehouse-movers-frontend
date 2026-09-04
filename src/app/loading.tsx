import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin mb-4" />
      <p className="text-sm text-slate-400 font-medium tracking-wide">Loading Firehouse Portal…</p>
    </div>
  );
}
