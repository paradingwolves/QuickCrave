import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const CAULDRON_INGREDIENTS = [
  { name: 'Cursed Cinnamon', emoji: '🍂', text: 'adds a pinch of mysterious warmth.' },
  { name: 'Midnight Pumpkin', emoji: '🎃', text: 'thickens the stew with a spooky glow.' },
  { name: 'Ghostly Garlic', emoji: '🧄', text: 'scares away the bland flavors!' },
  { name: 'Toasted Pecans', emoji: '🌰', text: 'brings an earthy crunch.' },
  { name: 'Dragon Chili Flakes', emoji: '🌶️', text: 'adds a wicked little kick.' },
  { name: 'Sweet Maple Syrup', emoji: '🍁', text: 'sweetens up the kitchen.' },
];

const PageNotFound = () => {
  const [stewItems, setStewItems] = useState([]);
  const [flavorText, setFlavorText] = useState('The cauldron is bubbling quietly. Toss in some ingredients to see what happens!');
  const [isStirring, setIsStirring] = useState(false);

  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    return today.getMonth() === 9; // 0 = Jan, 9 = Oct
  }, []);

  const handleAddIngredient = () => {
    setIsStirring(true);
    setTimeout(() => setIsStirring(false), 400);

    const randomItem = CAULDRON_INGREDIENTS[Math.floor(Math.random() * CAULDRON_INGREDIENTS.length)];
    setStewItems((prev) => [...prev, randomItem]);
    setFlavorText(`You added ${randomItem.name} (${randomItem.emoji}) — ${randomItem.text}`);
  };

  const handleResetCauldron = () => {
    setStewItems([]);
    setFlavorText('The cauldron has been cleaned out and is ready for a fresh recipe batch.');
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden ${
        isFallSeason
          ? 'bg-amber-50/50 text-stone-800 selection:bg-orange-200 selection:text-orange-950'
          : 'bg-stone-50 text-stone-800 selection:bg-rose-100 selection:text-rose-900'
      }`}
    >
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center text-center space-y-8">
        {/* Error Badge */}
        <span className="inline-block px-4 py-1.5 rounded-full bg-orange-100/90 text-orange-900 border border-orange-300/70 text-xs font-semibold tracking-wide shadow-xs">
          🍂 Error 404 • Recipe Not Found in the Pantry
        </span>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-stone-900 tracking-tight">
            Oops! This page got{' '}
            <span className="text-orange-600 underline decoration-amber-400 decoration-wavy underline-offset-4">
              burnt
            </span>
            .
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Looks like you wandered off the recipe card. While we look for the missing ingredients, why not help us brew a brand new stew?
          </p>
        </div>

        {/* Interactive Cauldron Widget */}
        <div className="w-full bg-white rounded-3xl border border-amber-200/60 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col items-center justify-center space-y-2">
            {/* Cauldron Graphic with Bubble Animation */}
            <div
              className={`text-6xl sm:text-7xl transition-transform duration-300 select-none ${
                isStirring ? 'scale-110 rotate-6' : 'hover:scale-105'
              }`}
            >
              🍲
            </div>
            <h3 className="text-lg font-bold text-stone-900">The Kitchen Cauldron</h3>
            <p className="text-xs text-stone-500 min-h-[2rem] flex items-center justify-center max-w-md px-4">
              {flavorText}
            </p>
          </div>

          {/* Tossed Ingredients Display */}
          <div className="min-h-[4rem] bg-amber-50/60 rounded-2xl border border-amber-200/40 p-3 flex flex-wrap items-center justify-center gap-2">
            {stewItems.length === 0 ? (
              <span className="text-xs text-stone-400 italic">Cauldron is currently empty...</span>
            ) : (
              stewItems.map((item, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-amber-200 text-xs font-semibold text-stone-700 shadow-2xs animate-fade-in"
                >
                  <span>{item.emoji}</span> {item.name}
                </span>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleAddIngredient}
              className="px-5 py-2.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              🥄 Toss Ingredient in Cauldron
            </button>
            {stewItems.length > 0 && (
              <button
                onClick={handleResetCauldron}
                className="px-4 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Clear Cauldron
              </button>
            )}
          </div>
        </div>

        {/* Navigation Escape Hatches */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-semibold text-sm transition-all shadow-sm active:scale-95"
          >
            ← Back to Home Kitchen
          </Link>
          <Link
            to="/explore"
            className="px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-700 font-semibold text-sm transition-all border border-stone-200 shadow-2xs"
          >
            Explore Recipes
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PageNotFound;