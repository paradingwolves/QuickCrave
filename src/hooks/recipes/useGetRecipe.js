import { useState, useEffect, useCallback } from 'react';
import { db } from '../../lib/firebase';
import { 
  doc, 
  getDoc, 
  collectionGroup, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';

export const useGetRecipe = (recipeId, userId = null) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipe = useCallback(async () => {
    if (!recipeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Direct fetch if author userId is explicitly provided
      if (userId) {
        const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
        const docSnap = await getDoc(recipeRef);

        if (docSnap.exists()) {
          setRecipe({
            id: docSnap.id,
            userId,
            ...docSnap.data()
          });
        } else {
          setError('Recipe not found.');
        }
      } else {
        // 2. Fetch public recipes & match document key client-side
        const publicRecipesQuery = query(
          collectionGroup(db, 'recipes'),
          where('public', '==', true)
        );

        const querySnapshot = await getDocs(publicRecipesQuery);
        
        // Find document matching doc.id OR stored id property
        const matchedDoc = querySnapshot.docs.find(
          (doc) => doc.id === recipeId || doc.data().id === recipeId
        );

        if (matchedDoc) {
          const pathSegments = matchedDoc.ref.path.split('/');
          // Path structure: users/{userId}/recipes/{recipeId}
          const authorUserId = pathSegments[1];

          setRecipe({
            id: matchedDoc.id,
            userId: authorUserId,
            ...matchedDoc.data()
          });
        } else {
          setError('Recipe not found or is set to private.');
        }
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError('Failed to load recipe details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [recipeId, userId]);

  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]);

  return { recipe, loading, error, refetch: fetchRecipe };
};