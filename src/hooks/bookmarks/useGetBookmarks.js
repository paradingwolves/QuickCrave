import { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

export const useGetBookmarks = (userId) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarks = useCallback(async () => {
    if (!userId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookmarksRef = collection(db, 'users', userId, 'bookmarks');
      const querySnapshot = await getDocs(bookmarksRef);

      const bookmarkItems = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id, // recipeId
          ...data,
        };
      });

      setRecipes(bookmarkItems);
    } catch (err) {
      console.error('Error fetching bookmarked recipes:', err);
      setError('Failed to fetch your saved recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return { recipes, loading, error, refetch: fetchBookmarks };
};