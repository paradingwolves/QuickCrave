import React from 'react';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-xl border border-slate-700 p-8 text-center space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Tailwind CSS Active
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          No BS Cooking
        </h1>

        {/* Subtext */}
        <p className="text-slate-400 text-sm leading-relaxed">
          If you can see this styled dark card, custom typography, and the green glowing indicator, Tailwind is configured correctly.
        </p>

        {/* Interactive Button Test */}
        <button 
          onClick={() => alert('Tailwind & React are working!')}
          className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
        >
          Test Interaction
        </button>
      </div>
    </div>
  );
}