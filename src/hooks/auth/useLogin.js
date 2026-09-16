import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { createUserProfile } from './useRegister';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password. Please try again.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/popup-closed-by-user':
        return 'Google sign-in was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email under a different sign-in method.';
      default:
        return 'Failed to log in. Please check your credentials and try again.';
    }
  };

  /**
   * Helper to ensure the user document and subcollections exist in Firestore
   */
  const ensureUserProfileExists = async (user) => {
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      await createUserProfile(user);
    }
  };

  /**
   * Sign in with Email and Password
   */
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Ensure Firestore document & subcollections exist
      await ensureUserProfileExists(user);

      setLoading(false);
      return user;
    } catch (err) {
      setLoading(false);
      const friendlyMsg = formatErrorMessage(err.code);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  /**
   * Sign in with Google Popup
   */
  const loginWithGoogle = async () => {
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Ensure Firestore document & subcollections exist
      await ensureUserProfileExists(user);

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
    loginWithEmail,
    loginWithGoogle,
    loading,
    error,
    setError
  };
};