 import { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { 
  collectionGroup, 
  query, 
  where, 
  orderBy, 
  getDocs 
} from 'firebase/firestore';

export const useGetPublicRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPublicRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Query all 'recipes' subcollections across all users where public == true
      const publicRecipesQuery = query(
        collectionGroup(db, 'recipes'),
        where('public', '==', true),
        orderBy('time_uploaded', 'desc')
      );

      const querySnapshot = await getDocs(publicRecipesQuery);

      const fetchedRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        // Path reference to the parent user doc if you ever need it
        parentPath: doc.ref.parent.path, 
        ...doc.data()
      }));

      setRecipes(fetchedRecipes);
    } catch (err) {
      console.error('Error fetching public recipes:', err);
      setError('Failed to load public recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublicRecipes();
  }, [fetchPublicRecipes]);

  return { recipes, loading, error, refetch: fetchPublicRecipes };
};