import React from 'react';

export default function ShopLoading() {
  return (
    <div className="pt-40 pb-24 min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-8 h-8 border-2 border-accent-pink border-t-transparent rounded-full animate-spin"></div>
      <div className="text-center uppercase tracking-[0.2em] text-[10px] text-zinc-500 animate-pulse">
        Loading Collection...
      </div>
    </div>
  );
}
