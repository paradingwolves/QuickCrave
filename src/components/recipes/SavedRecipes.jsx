import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { useGetBookmarks } from '../../hooks/bookmarks/useGetBookmarks';
import Header from '../layout/Header';
import Footer from '../layout/Footer';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    return today.getMonth() === 9; // 0 = Jan, 9 = Oct
  }, []);

  // Sync with Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const userId = currentUser?.uid;
  const { recipes, loading, error, refetch } = useGetBookmarks(userId);
  const [removingId, setRemovingId] = useState(null);

  // Handle removing a bookmark directly from the saved page
  const handleRemoveBookmark = async (e, recipeId) => {
    e.stopPropagation();
    if (!userId) return;

    setRemovingId(recipeId);
    try {
      const bookmarkRef = doc(db, 'users', userId, 'bookmarks', recipeId);
      await deleteDoc(bookmarkRef);
      refetch(); // Refresh list after removal
    } catch (err) {
      console.error('Error removing bookmark:', err);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ${
        isFallSeason
          ? 'bg-amber-50/50 text-stone-800 selection:bg-orange-200 selection:text-orange-950'
          : 'bg-stone-50 text-stone-800 selection:bg-rose-100 selection:text-rose-900'
      }`}
    >
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header Section */}
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b pb-6 ${
            isFallSeason ? 'border-amber-200/80' : 'border-stone-200/80'
          }`}
        >
          <div>
            <span
              className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide border shadow-xs mb-3 ${
                isFallSeason
                  ? 'bg-orange-100/90 text-orange-900 border-orange-300/70'
                  : 'bg-rose-100/80 text-rose-800 border-rose-200/60'
              }`}
            >
              {isFallSeason ? '🎃 Your Spooky Collection' : '♥ Your Personal Collection'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight">
              Saved Recipes
            </h1>
            <p className="text-stone-600 text-sm mt-1">
              {isFallSeason
                ? 'Your bookmarked autumn brews and spooky favorites, ready for the season.'
                : 'All your favorite dishes, bookmarked and ready for when hunger strikes.'}
            </p>
          </div>
          {recipes.length > 0 && (
            <button
              onClick={refetch}
              className={`self-start md:self-auto text-xs font-semibold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer ${
                isFallSeason
                  ? 'text-orange-700 hover:text-orange-800 bg-orange-100/80 hover:bg-orange-200/70 border border-orange-200/60'
                  : 'text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              🔄 Refresh List
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`animate-pulse rounded-3xl h-80 border ${
                  isFallSeason
                    ? 'bg-amber-100/50 border-amber-200/50'
                    : 'bg-stone-100 border-stone-200/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center text-sm">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && recipes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-stone-200/70 p-8 space-y-4 max-w-lg mx-auto shadow-xs">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl ${
                isFallSeason
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-rose-50 text-rose-500'
              }`}
            >
              {isFallSeason ? '🎃' : '♡'}
            </div>
            <h3 className="text-xl font-bold text-stone-900">No saved recipes yet</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Explore our community feed and click the heart icon on any recipe to save it for later.
            </p>
            <div className="pt-2">
              <Link
                to="/explore"
                className={`inline-flex items-center px-6 py-3 rounded-full font-semibold text-sm transition-all shadow-sm ${
                  isFallSeason
                    ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                    : 'bg-stone-900 hover:bg-rose-600 text-stone-50'
                }`}
              >
                Explore Community Recipes
              </Link>
            </div>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => {
              const prepMins = recipe.prep_time || 0;
              const cookMins = recipe.cook_time || 0;
              const tag = Array.isArray(recipe.tags) && recipe.tags.length > 0 
                ? recipe.tags[0] 
                : 'Saved Recipe';
              const imageUrl = recipe.image_urls?.[0] || recipe.image_url;

              return (
                <div
                  key={recipe.id}
                  onClick={() => {
                    if (recipe.recipe_url) {
                      navigate(recipe.recipe_url);
                    } else {
                      navigate(`/recipes/${recipe.id}`);
                    }
                  }}
                  className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
                    isFallSeason
                      ? 'border-amber-200/60 hover:shadow-xl hover:shadow-orange-950/10 hover:-translate-y-1'
                      : 'border-stone-200/70 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1'
                  }`}
                >
                  {/* Image & Tag Container */}
                  <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={recipe.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
                        <span className="text-2xl mb-1">{isFallSeason ? '🎃' : '🍳'}</span>
                        <span className="text-xs font-medium">No image provided</span>
                      </div>
                    )}

                    {/* Tag Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-xs font-bold shadow-xs border border-white/50 capitalize">
                      {tag}
                    </span>

                    {/* Remove Bookmark Heart Button */}
                    <button
                      type="button"
                      disabled={removingId === recipe.id}
                      onClick={(e) => handleRemoveBookmark(e, recipe.id)}
                      className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-90 ${
                        isFallSeason
                          ? 'bg-orange-600 text-white border border-orange-600 hover:bg-orange-700'
                          : 'bg-rose-600 text-white border border-rose-600 hover:bg-rose-700'
                      }`}
                      title="Remove from saved recipes"
                    >
                      ♥
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3
                        className={`text-xl font-bold transition-colors line-clamp-1 ${
                          isFallSeason
                            ? 'text-stone-900 group-hover:text-orange-600'
                            : 'text-stone-900 group-hover:text-rose-600'
                        }`}
                      >
                        {recipe.title || 'Untitled Recipe'}
                      </h3>
                      <div className="flex items-center gap-4 text-xs font-medium text-stone-500 mt-2">
                        {prepMins > 0 && (
                          <span className="flex items-center gap-1">⏱️ {prepMins} mins prep</span>
                        )}
                        {cookMins > 0 && (
                          <span className="flex items-center gap-1">🔥 {cookMins} mins cook</span>
                        )}
                        {prepMins === 0 && cookMins === 0 && (
                          <span className="text-stone-400">Ready to cook</span>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        ★ <span>{recipe.rating ? Number(recipe.rating).toFixed(1) : 'Saved'}</span>
                      </div>
                      <span
                        className={`font-bold flex items-center gap-1 transition-colors ${
                          isFallSeason
                            ? 'text-orange-600 group-hover:text-orange-700'
                            : 'text-rose-600 group-hover:text-rose-700'
                        }`}
                      >
                        View Recipe →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SavedRecipes;