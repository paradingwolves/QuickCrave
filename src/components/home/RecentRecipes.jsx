import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetNewRecipes } from '../../hooks/recipes/useGetNewRecipes';
import { useSaveBookmark } from '../../hooks/bookmarks/useSaveBookmark';

// Internal card component that safely invokes the useSaveBookmark hook per recipe
const RecentRecipeCard = ({ recipe, isFallSeason }) => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark, loading: bookmarkLoading } = useSaveBookmark(recipe);

  const prepMins = recipe.prep_time || 0;
  const cookMins = recipe.cook_time || 0;
  const tag = Array.isArray(recipe.tags) && recipe.tags.length > 0 
    ? recipe.tags[0] 
    : 'Recipe';

  return (
    <div
      onClick={() =>
        navigate(`/recipes/${recipe.id}?userId=${recipe.userId}`)
      }
      className={`group bg-white rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col cursor-pointer ${
        isFallSeason
          ? 'border-amber-200/60 hover:shadow-xl hover:shadow-orange-950/10 hover:-translate-y-1'
          : 'border-stone-200/70 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1'
      }`}
    >
      {/* Image & Tag Container */}
      <div className="relative h-64 w-full overflow-hidden bg-stone-100">
        {recipe.image_urls?.[0] ? (
          <img
            src={recipe.image_urls[0]}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100">
            <span className="text-2xl mb-1">{isFallSeason ? '🎃' : '🍳'}</span>
            <span className="text-xs font-medium">No image provided</span>
          </div>
        )}

        {/* Primary Tag Badge */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-stone-800 text-xs font-bold shadow-xs border border-white/50 capitalize">
          {tag}
        </span>

        {/* Save/Favorite Heart Button using useSaveBookmark */}
        <button
          type="button"
          disabled={bookmarkLoading}
          onClick={toggleBookmark}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center shadow-xs transition-all duration-200 border cursor-pointer active:scale-90 ${
            isBookmarked
              ? isFallSeason
                ? 'bg-orange-600 text-white border-orange-600 shadow-orange-600/30'
                : 'bg-rose-600 text-white border-rose-600'
              : isFallSeason
                ? 'bg-white/90 text-stone-600 hover:text-orange-600 border-white/50'
                : 'bg-white/90 text-stone-600 hover:text-rose-500 border-white/50'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark recipe'}
        >
          {isBookmarked ? '♥' : '♡'}
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
              <span className="text-stone-400">Quick & Easy</span>
            )}
          </div>
        </div>

        {/* Rating & Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1 text-amber-500 font-bold">
            ★ <span>{recipe.rating ? Number(recipe.rating).toFixed(1) : 'New'}</span>
            {recipe.review_count > 0 && (
              <span className="text-stone-400 font-normal">
                ({recipe.review_count})
              </span>
            )}
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
};

const RecentRecipes = () => {
  const { recipes, loading, error, refetch } = useGetNewRecipes(6);

  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    const month = today.getMonth(); // 0 = Jan, 9 = Oct
    return month === 9;
  }, []);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div
        className={`flex items-center justify-between border-b pb-4 ${
          isFallSeason ? 'border-amber-200/80' : 'border-stone-200/80'
        }`}
      >
        <div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            {isFallSeason ? '🎃 Spooky & Seasonal Brews' : 'New & Trending Ideas'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {isFallSeason
              ? 'Fresh autumn recipes and spooktacular ideas'
              : 'Recently uploaded recipes ranked by ratings & recency'}
          </p>
        </div>
        <button
          onClick={refetch}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer ${
            isFallSeason
              ? 'text-orange-700 hover:text-orange-800 bg-orange-100/80 hover:bg-orange-200/70 border border-orange-200/60'
              : 'text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          🔄 Refresh
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`animate-pulse rounded-3xl h-96 border ${
                isFallSeason
                  ? 'bg-amber-100/50 border-amber-200/50'
                  : 'bg-stone-100 border-stone-200/70'
              }`}
            />
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center text-sm">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && recipes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/70 p-6">
          <p className="text-stone-500 text-sm">
            {isFallSeason
              ? 'No spooky recipes brewing right now.'
              : 'No recent recipes available right now.'}
          </p>
        </div>
      )}

      {/* Dynamic Recipe Cards Grid */}
      {!loading && !error && recipes.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <RecentRecipeCard
              key={recipe.id}
              recipe={recipe}
              isFallSeason={isFallSeason}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default RecentRecipes;