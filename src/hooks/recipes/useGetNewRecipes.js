import { useState, useEffect, useCallback } from 'react';
import { 
  collectionGroup, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs 
} from 'firebase/firestore';
import { db } from '../../lib/firebase'; // Adjust path to your Firebase config

export const useGetNewRecipes = (fetchLimit = 20) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNewRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch recent public recipes ordered by time_uploaded
      const recipesQuery = query(
        collectionGroup(db, 'recipes'),
        where('public', '==', true),
        orderBy('time_uploaded', 'desc'),
        limit(50) // Fetch a pool to score and sort dynamically
      );

      const querySnapshot = await getDocs(recipesQuery);
      const now = new Date();
      const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

      const rawRecipes = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        
        // Handle Firestore Timestamp or standard JS Date/String
        const uploadDate = data.time_uploaded?.toDate 
          ? data.time_uploaded.toDate() 
          : new Date(data.time_uploaded || Date.now());

        const rating = Number(data.rating || data.average_rating || 0);
        const reviewCount = Number(data.review_count || data.num_reviews || 1);

        // 2. Algorithm Scoring: Calculate Recency Boost vs. Rating
        const ageInMs = now.getTime() - uploadDate.getTime();
        const isWithin30Days = ageInMs <= THIRTY_DAYS_MS;

        // Recency Score (1.0 for brand new, decaying down to 0 at 30 days)
        let recencyScore = 0;
        if (isWithin30Days) {
          recencyScore = Math.max(0, 1 - ageInMs / THIRTY_DAYS_MS);
        }

        // Weighted Combined Score (60% Rating Score, 40% Recency Score)
        // Rating normalized from 0-5 scale to 0-1
        const normalizedRating = rating / 5;
        const score = (normalizedRating * 0.6) + (recencyScore * 0.4);

        return {
          id: doc.id,
          userId: doc.ref.parent.parent?.id || data.userId, // Extract parent author ID if subcollection
          ...data,
          uploadDate,
          rating,
          score,
          isWithin30Days,
        };
      });

      // 3. Sort by computed score descending (highest rating + most recent first)
      const sortedRecipes = rawRecipes
        .sort((a, b) => b.score - a.score)
        .slice(0, fetchLimit);

      setRecipes(sortedRecipes);
    } catch (err) {
      console.error('Error fetching new recipes:', err);
      setError('Failed to fetch new recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [fetchLimit]);

  useEffect(() => {
    fetchNewRecipes();
  }, [fetchNewRecipes]);

  return { recipes, loading, error, refetch: fetchNewRecipes };
};