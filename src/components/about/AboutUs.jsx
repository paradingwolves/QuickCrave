import React, { useMemo, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

// Reusable scroll-reveal wrapper component
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

const AboutUs = () => {
  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    return today.getMonth() === 9; // 0 = Jan, 9 = Oct
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden ${
        isFallSeason
          ? 'bg-amber-50/50 text-stone-800 selection:bg-orange-200 selection:text-orange-950'
          : 'bg-stone-50 text-stone-800 selection:bg-rose-100 selection:text-rose-900'
      }`}
    >
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Section */}
        <ScrollReveal delay={100}>
          <div className="text-center space-y-4 pt-4">
            <span
              className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs transition-all ${
                isFallSeason
                  ? 'bg-orange-100/90 text-orange-900 border-orange-300/70 shadow-orange-100'
                  : 'bg-rose-100/80 text-rose-800 border-rose-200/60 shadow-sm'
              }`}
            >
              {isFallSeason
                ? '🎃 Cozy Autumn & Spooky Kitchens'
                : '✨ Welcome to QuickCrave'}
            </span>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight">
              {isFallSeason ? (
                <>
                  A cozy, autumn corner for your favorite{' '}
                  <span className="text-orange-600 underline decoration-amber-400 decoration-wavy underline-offset-4">
                    recipes
                  </span>
                  .
                </>
              ) : (
                <>
                  A quiet, cozy place for your favorite{' '}
                  <span className="text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">
                    recipes
                  </span>
                  .
                </>
              )}
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              {isFallSeason
                ? 'QuickCrave is a warm space for everyday home cooks. Whether you are brewing a pot of hearty soup or baking autumn treats, we keep things simple, clean, and straightforward.'
                : 'QuickCrave is a simple space designed for home cooks who love good food and appreciate keeping things straightforward, clean, and easy to follow in the kitchen.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Feature Cards Grid */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div
              className={`p-6 rounded-3xl bg-white border shadow-xs space-y-3 ${
                isFallSeason ? 'border-amber-200/60' : 'border-stone-200/70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl font-bold flex items-center justify-center text-lg ${
                  isFallSeason
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {isFallSeason ? '🧹' : '📖'}
              </div>
              <h3 className="text-lg font-bold text-stone-900">Easy to Read</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Every recipe is laid out cleanly so you can see ingredients and steps at a glance while cooking.
              </p>
            </div>

            <div
              className={`p-6 rounded-3xl bg-white border shadow-xs space-y-3 ${
                isFallSeason ? 'border-amber-200/60' : 'border-stone-200/70'
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 font-bold flex items-center justify-center text-lg">
                {isFallSeason ? '🎃' : '🌿'}
              </div>
              <h3 className="text-lg font-bold text-stone-900">Community Shared</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Discover and share comforting weeknight dinners, autumn bakes, and spooky seasonal favorites.
              </p>
            </div>

            <div
              className={`p-6 rounded-3xl bg-white border shadow-xs space-y-3 ${
                isFallSeason ? 'border-amber-200/60' : 'border-stone-200/70'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl font-bold flex items-center justify-center text-lg ${
                  isFallSeason
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {isFallSeason ? '👻' : '✨'}
              </div>
              <h3 className="text-lg font-bold text-stone-900">Kitchen Companion</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Save the dishes you love, organize your personal collection, and keep your go-to meals close at hand.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Mission Statement Box */}
        <ScrollReveal delay={300}>
          <div
            className={`text-stone-50 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xl transition-colors duration-500 ${
              isFallSeason
                ? 'bg-amber-950 shadow-orange-950/20 border border-amber-900/60'
                : 'bg-stone-900 shadow-stone-900/10'
            }`}
          >
            <h2 className="text-2xl font-bold tracking-tight">
              {isFallSeason ? 'Brewing Up Good Food Together' : 'Made for the Love of Cooking'}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {isFallSeason
                ? 'Whether you are boiling up a cauldron of soup or sticking to a quick classic, we hope QuickCrave makes your time in the kitchen effortless and cozy. Grab an apron and make yourself at home.'
                : "Whether you're trying out something entirely new or returning to a timeless classic, we hope QuickCrave makes your time in the kitchen a little more effortless and a lot more enjoyable. Grab an apron and make yourself at home."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/explore"
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-sm ${
                  isFallSeason
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                }`}
              >
                Explore Recipes
              </Link>
              <Link
                to="/add-recipe"
                className={`px-6 py-3 rounded-full font-semibold text-sm transition-all border ${
                  isFallSeason
                    ? 'bg-amber-900/60 hover:bg-amber-900 text-amber-100 border-amber-800'
                    : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                }`}
              >
                Share a Recipe
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;