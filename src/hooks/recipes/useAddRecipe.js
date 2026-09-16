import { useState } from 'react';
import { db, auth, storage } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const INITIAL_FORM_STATE = {
  title: '',
  summary: '',
  prepTime: '',
  cookTime: '',
  servings: '',
  ingredients: [{ name: '', amount: '', unit: '' }],
  directions: [''],
  equipment: [''],
  tags: [''],
  isPublic: false
};

export const useAddRecipe = (onSuccessCallback) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRichTextChange = (field, html) => {
    setFormData((prev) => ({ ...prev, [field]: html }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const addArrayItem = (field, initialValue = '') => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], initialValue]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => {
      if (prev[field].length <= 1) return prev;
      return {
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      };
    });
  };

  const handleIngredientChange = (index, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.ingredients];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, ingredients: updated };
    });
  };

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setImageFiles((prev) => {
      const availableSlots = 5 - prev.length;
      const filesToAdd = selectedFiles.slice(0, availableSlots);
      return [...prev, ...filesToAdd];
    });
  };

  const removeImageFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImages = async (userId) => {
    const imageUrls = [];
    for (const file of imageFiles) {
      const uniqueFileName = `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `users/${userId}/recipes/${uniqueFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      imageUrls.push(downloadURL);
    }
    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('You must be logged in to create a recipe.');
      }

      const cleanedIngredients = formData.ingredients
        .filter((ing) => ing.name && ing.name.trim() !== '')
        .map((ing) => ({
          name: String(ing.name).trim(),
          amount: String(ing.amount || '').trim(),
          unit: String(ing.unit || '').trim()
        }));

      const cleanedDirections = formData.directions.filter(
        (step) => typeof step === 'string' && step.trim() !== ''
      );
      const cleanedEquipment = formData.equipment.filter(
        (item) => typeof item === 'string' && item.trim() !== ''
      );
      const cleanedTags = formData.tags.filter(
        (tag) => typeof tag === 'string' && tag.trim() !== ''
      );

      if (!formData.title.trim()) {
        throw new Error('Recipe title is required.');
      }
      if (cleanedIngredients.length === 0) {
        throw new Error('At least one ingredient is required.');
      }
      if (cleanedDirections.length === 0) {
        throw new Error('At least one step direction is required.');
      }

      const image_urls = await uploadImages(user.uid);
      const now = new Date().toISOString();

      const payload = {
        userId: user.uid,
        title: formData.title.trim(),
        summary: formData.summary || '',
        prep_time: Number(formData.prepTime) || 0,
        cook_time: Number(formData.cookTime) || 0,
        servings: Number(formData.servings) || 1,
        time_uploaded: now,
        last_revision: now,
        equipment: cleanedEquipment,
        ingredients: cleanedIngredients,
        directions: cleanedDirections,
        ratings: [],
        tags: cleanedTags,
        public: Boolean(formData.isPublic),
        image_urls
      };

      // Save to user subcollection
      const recipesCollectionRef = collection(db, 'users', user.uid, 'recipes');
      const docRef = await addDoc(recipesCollectionRef, payload);

      setFormData(INITIAL_FORM_STATE);
      setImageFiles([]);

      // Pass created document details to callback
      if (onSuccessCallback) {
        await onSuccessCallback(docRef.id, payload);
      }
    } catch (err) {
      console.error('Error adding recipe:', err);
      setError(err.message || 'Failed to save recipe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};