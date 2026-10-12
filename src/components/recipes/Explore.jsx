import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetPublicRecipes } from '../../hooks/recipes/useGetPublicRecipes';
import Header from '../layout/Header';

const Explore = () => {
  const navigate = useNavigate();
  const { recipes, loading, error, refetch } = useGetPublicRecipes();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract all unique tags dynamically across public recipes
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    recipes.forEach((recipe) => {
      if (Array.isArray(recipe.tags)) {
        recipe.tags.forEach((tag) => {
          if (tag && tag.trim()) {
            tagsSet.add(tag.trim().toLowerCase());
          }
        });
      }
    });
    return ['All', ...Array.from(tagsSet)];
  }, [recipes]);

  // Filter recipes based on search term and selected tag
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch =
        recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.some((ing) =>
          ing.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTag =
        selectedTag === 'All' ||
        recipe.tags?.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

      return matchesSearch && matchesTag;
    });
  }, [recipes, searchTerm, selectedTag]);

  return (
    <>
      <Header />   
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Community Recipes
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Discover and cook delicious recipes shared by home chefs around the world.
            </p>
          </div>
          <button
            onClick={refetch}
            className="self-start md:self-auto flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Feed
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-8 space-y-4">
          <div className="relative">
            <svg
              className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by recipe title, summary, or ingredient..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-sm transition-all"
            />
          </div>

          {/* Dynamic Tag Filter Chips */}
          {allTags.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex-none">
                Filter:
              </span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1 text-xs font-medium rounded-full capitalize whitespace-nowrap transition-colors ${
                    selectedTag === tag
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-slate-100 animate-pulse rounded-xl h-80 border border-slate-200"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center text-sm my-6">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8">
            <svg
              className="w-12 h-12 mx-auto text-slate-300 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h3 className="text-lg font-semibold text-slate-800">No public recipes found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
              Try resetting your search filters or check back later for new community recipes.
            </p>
          </div>
        )}

        {/* Recipe Grid */}
        {!loading && !error && filteredRecipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="group bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer flex flex-col"
              >
                {/* Image Preview Container */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  {recipe.image_urls?.[0] ? (
                    <img
                      src={recipe.image_urls[0]}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                      <svg className="w-10 h-10 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-xs">No image provided</span>
                    </div>
                  )}

                  {/* Total Cooking Time Badge */}
                  {(recipe.prep_time > 0 || recipe.cook_time > 0) && (
                    <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-xs">
                      {(recipe.prep_time || 0) + (recipe.cook_time || 0)} mins
                    </span>
                  )}
                </div>

                {/* Recipe Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {recipe.title}
                    </h2>

                    {/* HTML Summary rendered safely */}
                    {recipe.summary && (
                      <div
                        className="text-xs text-slate-500 mt-2 line-clamp-2 prose prose-xs"
                        dangerouslySetInnerHTML={{ __html: recipe.summary }}
                      />
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span>
                        <strong className="text-slate-700 font-medium">Servings:</strong> {recipe.servings || 1}
                      </span>
                      <span>
                        <strong className="text-slate-700 font-medium">Ingredients:</strong> {recipe.ingredients?.length || 0}
                      </span>
                    </div>

                    <span className="text-orange-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                      View &rarr;
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;