import React, { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddRecipe } from '../../hooks/recipes/useAddRecipe';
import RichTextEditor from '../layout/RichTextEditor';
import Header from '../layout/Header';

const AddRecipe = () => {
  const navigate = useNavigate();

  const {
    formData,
    imageFiles,
    loading,
    error,
    handleChange,
    handleRichTextChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleIngredientChange,
    handleImageSelect,
    removeImageFile,
    handleSubmit
  } = useAddRecipe(async (recipeId) => {
    // Navigate user directly to the newly created recipe page using the doc ID created in hook
    navigate(`/recipes/${recipeId}`);
  });

  // Memoize Object URLs for image previews to prevent memory leaks and unnecessary re-renders
  const previewUrls = useMemo(() => {
    return imageFiles.map((file) => URL.createObjectURL(file));
  }, [imageFiles]);

  // Clean up Object URLs when component unmounts or imageFiles change
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const remainingImageSlots = 5 - imageFiles.length;

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md border border-slate-100 p-6 sm:p-8">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Add New Recipe</h1>
            <p className="text-sm text-slate-500 mt-1">
              Share your culinary creation with formatted rich text styling for descriptions and directions.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* General Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-700">General Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Creamy Garlic Tuscan Chicken"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Summary / Description
                </label>
                <RichTextEditor
                  value={formData.summary}
                  onChange={(html) => handleRichTextChange('summary', html)}
                  placeholder="A quick description of what makes this dish special..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Prep Time (mins)
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    min="0"
                    value={formData.prepTime}
                    onChange={handleChange}
                    placeholder="15"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Cook Time (mins)
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    min="0"
                    value={formData.cookTime}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Servings
                  </label>
                  <input
                    type="number"
                    name="servings"
                    min="1"
                    value={formData.servings}
                    onChange={handleChange}
                    placeholder="4"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Recipe Images */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-slate-700">Recipe Images</h2>
                  <p className="text-xs text-slate-500">Upload up to 5 images (JPEG, PNG, WebP)</p>
                </div>
                <span className="text-xs font-medium text-slate-500">
                  {imageFiles.length} / 5 selected
                </span>
              </div>

              {imageFiles.length < 5 && (
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-lg p-6 cursor-pointer transition-colors bg-slate-50 hover:bg-orange-50/30">
                  <svg
                    className="w-8 h-8 text-slate-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-slate-600">
                    Click to select images ({remainingImageSlots} slot{remainingImageSlots !== 1 ? 's' : ''} left)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              )}

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-square">
                      <img
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImageFile(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-90 hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <hr className="border-slate-200" />

            {/* Ingredients */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-700">Ingredients *</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem('ingredients', { name: '', amount: '', unit: '' })}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  + Add Ingredient
                </button>
              </div>

              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={ing.amount}
                    onChange={(e) => handleIngredientChange(idx, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                  />
                  <input
                    type="text"
                    value={ing.unit}
                    onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
                    placeholder="Unit"
                    className="w-1/4 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="w-1/2 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('ingredients', idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <hr className="border-slate-200" />

            {/* Directions */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-slate-700">Directions *</h2>
                <button
                  type="button"
                  onClick={() => addArrayItem('directions')}
                  className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1"
                >
                  + Add Step
                </button>
              </div>

              {formData.directions.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <span className="flex-none bg-orange-100 text-orange-700 font-semibold text-xs rounded-full h-7 w-7 flex items-center justify-center mt-2">
                    {idx + 1}
                  </span>
                  <div className="w-full">
                    <RichTextEditor
                      value={step}
                      onChange={(html) => handleArrayChange('directions', idx, html)}
                      placeholder={`Describe step ${idx + 1}...`}
                    />
                  </div>
                  {formData.directions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('directions', idx)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors mt-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <hr className="border-slate-200" />

            {/* Equipment & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-md font-semibold text-slate-700">Equipment Needed</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('equipment')}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    + Add Item
                  </button>
                </div>
                {formData.equipment.map((eq, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={eq}
                      onChange={(e) => handleArrayChange('equipment', idx, e.target.value)}
                      placeholder="e.g. Dutch Oven"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                    />
                    {formData.equipment.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('equipment', idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-md font-semibold text-slate-700">Tags</h2>
                  <button
                    type="button"
                    onClick={() => addArrayItem('tags')}
                    className="text-xs font-medium text-orange-600 hover:text-orange-700"
                  >
                    + Add Tag
                  </button>
                </div>
                {formData.tags.map((tag, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', idx, e.target.value)}
                      placeholder="e.g. dinner, quick, italian"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-800 text-sm"
                    />
                    {formData.tags.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('tags', idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Visibility & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
                />
                <span className="text-sm font-medium text-slate-700">Make recipe public</span>
              </label>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Saving...' : 'Save Recipe'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;