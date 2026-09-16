import React from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import RecentRecipes from './RecentRecipes';

const Home = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto pt-6">
          <span className="inline-block px-3.5 py-1.5 rounded-full bg-rose-100/80 text-rose-800 text-xs font-semibold tracking-wide border border-rose-200/60 shadow-sm">
            ✨ Pure Recipes • No Endless Life Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
            Delicious food, cut straight to the{' '}
            <span className="text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">
              recipe
            </span>
            .
          </h1>
          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            Beautiful, clear cooking guides without the 2,000-word intro blog posts. Save your favorites, adjust servings, and get right to cooking.
          </p>
        </section>

        {/* Pinterest-Style Category Pill Filters */}
        <section className="flex items-center justify-center gap-2.5 flex-wrap text-sm">
          {['All', 'Quick & Easy', 'Dinner', 'Pasta', 'Breakfast', 'Desserts'].map(
            (category, idx) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 font-medium ${
                  idx === 0
                    ? 'bg-stone-900 text-stone-50 font-semibold shadow-md shadow-stone-900/10 scale-105'
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900 hover:border-stone-300 shadow-sm'
                }`}
              >
                {category}
              </button>
            )
          )}
        </section>

        {/* Dynamic Recent & Trending Recipes Section */}
        <RecentRecipes />
      </main>

      <Footer />
    </div>
  );
};

export default Home;