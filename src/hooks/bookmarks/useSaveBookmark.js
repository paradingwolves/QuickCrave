import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';

export const useSaveBookmark = (recipe) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Check if bookmark already exists when user or recipe changes
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!currentUser?.uid || !recipe?.id) {
        setIsBookmarked(false);
        return;
      }

      try {
        const bookmarkRef = doc(db, 'users', currentUser.uid, 'bookmarks', recipe.id);
        const docSnap = await getDoc(bookmarkRef);
        setIsBookmarked(docSnap.exists());
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    };

    checkBookmarkStatus();
  }, [currentUser?.uid, recipe?.id]);

  // Toggle bookmark function
  const toggleBookmark = useCallback(async (e) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      alert('Please sign in to bookmark recipes.');
      return;
    }

    if (!recipe?.id) return;

    setLoading(true);
    const bookmarkRef = doc(db, 'users', currentUser.uid, 'bookmarks', recipe.id);

    try {
      if (isBookmarked) {
        // Remove bookmark
        await deleteDoc(bookmarkRef);
        setIsBookmarked(false);
      } else {
        // Add bookmark
        const recipeUrl = `/recipes/${recipe.id}?userId=${recipe.userId || currentUser.uid}`;
        await setDoc(bookmarkRef, {
          recipeId: recipe.id,
          title: recipe.title || 'Untitled Recipe',
          recipe_url: recipeUrl,
          image_url: recipe.image_urls?.[0] || '',
          created_at: new Date()
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      console.error('Error updating bookmark:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, recipe, isBookmarked]);

  return { isBookmarked, toggleBookmark, loading };
};