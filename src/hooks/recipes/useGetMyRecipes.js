import { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const useGetMyRecipes = (userId) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRecipes = useCallback(async () => {
    if (!userId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const recipesRef = collection(db, 'users', userId, 'recipes');
      const querySnapshot = await getDocs(recipesRef);

      const userRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        userId,
        ...doc.data(),
      }));

      setRecipes(userRecipes);
    } catch (err) {
      console.error('Error fetching user recipes:', err);
      setError('Failed to fetch your recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyRecipes();
  }, [fetchMyRecipes]);

  return { recipes, loading, error, refetch: fetchMyRecipes };
};