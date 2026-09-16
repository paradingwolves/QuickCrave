import { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

// Helper function to create Firestore user document & initial subcollections
export const createUserProfile = async (user, defaultPfpUrl = '') => {
  const userDocRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();

  const userData = {
    access_level: 'user',
    pfp_url: user.photoURL || defaultPfpUrl || '',
    user_rating: 0.0,
    username: user.displayName || user.email?.split('@')[0] || '',
    email: user.email || '',
    createdAt: now
  };

  // 1. Create the base user document
  await setDoc(userDocRef, userData);

  // 2. Initialize the 'recipes' subcollection with full schema attributes
  const sampleRecipeRef = doc(collection(userDocRef, 'recipes'));
  await setDoc(sampleRecipeRef, {
    title: 'My First Recipe',
    summary: 'Welcome to your recipe box! Edit or delete this recipe to get started.',
    prep_time: 10,
    cook_time: 15,
    servings: 2,
    time_uploaded: now,
    last_revision: now,
    equipment: ['Chef Knife', 'Cutting Board'],
    ingredients: [
      { name: 'Sample Ingredient', amount: '1', unit: 'cup' }
    ],
    directions: [
      'Step 1: Prep your ingredients.',
      'Step 2: Cook and enjoy!'
    ],
    ratings: [],
    tags: ['sample', 'getting-started'],
    public: false,
    image_urls: []
  });

  // 3. Initialize the 'bookmarks' subcollection
  const sampleBookmarkRef = doc(collection(userDocRef, 'bookmarks'));
  await setDoc(sampleBookmarkRef, {
    title: 'Sample Bookmark',
    recipe_url: 'https://example.com/sample-recipe'
  });
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatErrorMessage = (code) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-up was cancelled.';
      default:
        return 'Failed to create account. Please try again.';
    }
  };

  const registerWithEmail = async (email, password, username) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: username });
      await createUserProfile({ ...user, displayName: username });

      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      const friendlyMsg = formatErrorMessage(err.code);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const registerWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        await createUserProfile(user);
      }

      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      const friendlyMsg = formatErrorMessage(err.code);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  return {
    registerWithEmail,
    registerWithGoogle,
    loading,
    error,
  };
};