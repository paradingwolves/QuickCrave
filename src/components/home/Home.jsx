import React, { useMemo, useEffect, useRef, useState } from 'react';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import RecentRecipes from './RecentRecipes';

// Reusable scroll-reveal wrapper using React state
const ScrollReveal = ({ children, delay = 0, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Home = () => {
  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    const month = today.getMonth(); // 0 = Jan, 9 = Oct
    return month === 9;
  }, []);

  const categories = isFallSeason
    ? ['All', 'Spooky Treats 🎃', 'Cauldron Soups 🍲', 'Autumn Bakes 🍂', 'Comfort Dinners', 'Warm Drinks ☕']
    : ['All', 'Quick & Easy', 'Dinner', 'Pasta', 'Breakfast', 'Desserts'];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden ${
        isFallSeason
          ? 'bg-amber-50/50 text-stone-800 selection:bg-orange-200 selection:text-orange-950'
          : 'bg-stone-50 text-stone-800 selection:bg-rose-100 selection:text-rose-900'
      }`}
    >
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Hero Section */}
        <ScrollReveal delay={100}>
          <section className="text-center space-y-4 max-w-2xl mx-auto pt-6">
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs transition-all ${
                isFallSeason
                  ? 'bg-orange-100/90 text-orange-900 border-orange-300/70 shadow-orange-100'
                  : 'bg-rose-100/80 text-rose-800 border-rose-200/60'
              }`}
            >
              {isFallSeason
                ? '🎃 Spooky Season • Cozy Autumn Comforts 👻'
                : '✨ Welcome to Your Kitchen Companion'}
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {isFallSeason ? (
                <>
                  Wicked good eats, cut straight to the{' '}
                  <span className="text-orange-600 underline decoration-amber-400 decoration-wavy underline-offset-4">
                    recipe
                  </span>
                  .
                </>
              ) : (
                <>
                  Simple, comforting food cut straight to the{' '}
                  <span className="text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">
                    recipe
                  </span>
                  .
                </>
              )}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
              {isFallSeason
                ? 'Brew up something delicious this October! From spooky sweet treats to hearty autumn cauldrons, find comforting recipes without any tricks.'
                : 'Clean, thoughtful cooking guides made for everyday home cooks. Discover new favorites, save your go-to meals, and get right to making something delicious.'}
            </p>
          </section>
        </ScrollReveal>

        {/* Category Pill Filters */}
        <ScrollReveal delay={200}>
          <section className="flex items-center justify-center gap-2.5 flex-wrap text-sm">
            {categories.map((category, idx) => (
              <button
                key={category}
                className={`px-5 py-2.5 rounded-full transition-all duration-200 font-medium cursor-pointer active:scale-95 ${
                  idx === 0
                    ? isFallSeason
                      ? 'bg-orange-600 text-white font-semibold shadow-md shadow-orange-600/20'
                      : 'bg-stone-900 text-stone-50 font-semibold shadow-sm'
                    : 'bg-white border border-stone-200/80 text-stone-600 hover:bg-stone-100 hover:text-stone-900 shadow-xs'
                }`}
              >
                {category}
              </button>
            ))}
          </section>
        </ScrollReveal>

        {/* Dynamic Recent & Trending Recipes Section */}
        <ScrollReveal delay={300}>
          <RecentRecipes />
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default Home;