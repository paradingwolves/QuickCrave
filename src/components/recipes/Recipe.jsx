import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRecipe } from '../../hooks/recipes/useGetRecipe';
import Header from '../layout/Header';

const Recipe = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { recipe, loading, error } = useGetRecipe(recipeId);
  
  // State to track checked ingredients while cooking
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-8 text-slate-500 text-center">Loading recipe...</div>;
  }

  if (error || !recipe) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Recipe Not Found</h2>
        <p className="text-slate-500 mb-4">{error || "This recipe doesn't exist or is private."}</p>
        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  // Schema Property Normalization
  const prepTime = recipe.prep_time ?? recipe.prepTime;
  const cookTime = recipe.cook_time ?? recipe.cookTime;
  const timeUploaded = recipe.time_uploaded ?? recipe.timeUploaded;
  const lastRevision = recipe.last_revision ?? recipe.lastRevision;

  // Handle rating value (if number or object)
  const averageRating = typeof recipe.ratings === 'object' 
    ? recipe.ratings?.average || recipe.ratings?.score
    : recipe.ratings;

  // Image source normalization
  const imageList = recipe.image_urls || recipe.images || (recipe.imageUrl ? [recipe.imageUrl] : []);
  const heroImage = imageList[0];
  const galleryImages = imageList.slice(1);

  // Formatting dates
  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <>
    <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            {recipe.categorsy && (
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                {recipe.category}
              </span>
            )}
            
            {averageRating && (
              <div className="flex items-center space-x-1 text-amber-500 text-sm font-bold">
                <span>★</span>
                <span>{Number(averageRating).toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{recipe.title}</h1>

          {/* Upload / Revision Metadata */}
          {(timeUploaded || lastRevision) && (
            <p className="text-xs text-slate-400 space-x-2">
              {timeUploaded && <span>Published: {formatDate(timeUploaded)}</span>}
              {timeUploaded && lastRevision && <span>•</span>}
              {lastRevision && <span>Updated: {formatDate(lastRevision)}</span>}
            </p>
          )}

          {/* Recipe Summary */}
          {recipe.summary && (
            <div
              className="prose prose-slate max-w-none text-slate-600 text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: recipe.summary }}
            />
          )}
        </div>

        {/* Featured / Hero Image */}
        {heroImage && (
          <div className="overflow-hidden rounded-2xl shadow-md border border-slate-100 max-h-96">
            <img
              src={heroImage}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Overview Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Prep Time</span>
            <span className="text-base font-bold text-slate-800">{prepTime ? `${prepTime} mins` : '--'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Cook Time</span>
            <span className="text-base font-bold text-slate-800">{cookTime ? `${cookTime} mins` : '--'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Servings</span>
            <span className="text-base font-bold text-slate-800">{recipe.servings || '--'}</span>
          </div>
          <div>
            <span className="block text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Time</span>
            <span className="text-base font-bold text-slate-800">
              {(prepTime || cookTime) ? `${(Number(prepTime) || 0) + (Number(cookTime) || 0)} mins` : '--'}
            </span>
          </div>
        </div>

        {/* Additional Images / Step-by-Step Gallery */}
        {galleryImages.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800">Recipe Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {galleryImages.map((img, idx) => (
                <div key={idx} className="overflow-hidden rounded-xl border border-slate-200 aspect-video">
                  <img
                    src={img}
                    alt={`${recipe.title} photo ${idx + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Equipment */}
        {recipe.equipment && recipe.equipment.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-800">Equipment Needed</h2>
            <div className="flex flex-wrap gap-2">
              {recipe.equipment.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-medium rounded-md border border-slate-200"
                >
                  {typeof item === 'string' ? item : item.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Main Content: Ingredients & Directions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {/* Ingredients Column */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2 border-slate-200">
              Ingredients
            </h2>
            <ul className="space-y-3">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ing, idx) => {
                  const isString = typeof ing === 'string';
                  const label = isString ? ing : `${ing.amount || ''} ${ing.unit || ''} ${ing.name}`.trim();

                  return (
                    <li key={idx} className="flex items-start space-x-3 cursor-pointer" onClick={() => toggleIngredient(idx)}>
                      <input
                        type="checkbox"
                        checked={!!checkedIngredients[idx]}
                        onChange={() => {}}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500 cursor-pointer"
                      />
                      <div
                        className={`prose prose-slate prose-sm max-w-none text-slate-700 select-none ${
                          checkedIngredients[idx] ? 'line-through text-slate-400' : ''
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                      />
                    </li>
                  );
                })
              ) : (
                <li className="text-slate-400 text-sm italic">No ingredients listed.</li>
              )}
            </ul>
          </div>

          {/* Directions Column */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b pb-2 border-slate-200">
              Directions
            </h2>
            <ol className="space-y-6">
              {recipe.directions && recipe.directions.length > 0 ? (
                recipe.directions.map((step, idx) => {
                  const stepText = typeof step === 'string' ? step : step.instruction;
                  const stepImg = typeof step === 'object' ? step.image : null;

                  return (
                    <li key={idx} className="flex space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-700 font-bold text-sm flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div className="pt-1 space-y-3 flex-1">
                        <div
                          className="prose prose-slate max-w-none text-slate-700 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: stepText }}
                        />
                        {stepImg && (
                          <img
                            src={stepImg}
                            alt={`Step ${idx + 1}`}
                            className="rounded-lg max-h-48 object-cover border border-slate-200"
                          />
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-slate-400 text-sm italic">No instructions listed.</li>
              )}
            </ol>
          </div>
        </div>

        {/* Tags Footer */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200">
            <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Recipe;