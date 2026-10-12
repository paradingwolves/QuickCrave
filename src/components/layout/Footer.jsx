import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Footer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Check if current date falls within October (October 1 to October 31)
  const isFallSeason = useMemo(() => {
    const today = new Date();
    return today.getMonth() === 9; // 0 = Jan, 9 = Oct
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  return (
    <footer
      className={`w-full border-t py-10 mt-auto transition-colors duration-500 ${
        isFallSeason
          ? 'border-amber-200/60 bg-amber-100/30 text-stone-600'
          : 'border-stone-200/80 bg-stone-100/60 text-stone-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs transition-colors duration-300 ${
                isFallSeason
                  ? 'bg-orange-600 text-white'
                  : 'bg-stone-900 text-stone-50'
              }`}
            >
              {isFallSeason ? '🎃' : 'Q'}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-stone-900 leading-tight">
                Quick
                <span className={isFallSeason ? 'text-orange-600' : 'text-rose-600'}>
                  Crave
                </span>
              </span>
              <span className="text-[11px] text-stone-500">
                {isFallSeason
                  ? 'Cozy & seasonal recipes • quickcrave.ca'
                  : 'Simple, everyday recipes • quickcrave.ca'}
              </span>
            </div>
          </div>

          {/* Dynamic Navigation Links based on Auth State */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-stone-500">
            <Link
              to="/explore"
              className={
                isFallSeason
                  ? 'hover:text-orange-600 transition-colors'
                  : 'hover:text-stone-900 transition-colors'
              }
            >
              Explore
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-recipes"
                  className={
                    isFallSeason
                      ? 'hover:text-orange-600 transition-colors'
                      : 'hover:text-stone-900 transition-colors'
                  }
                >
                  My Recipes
                </Link>
                <button
                  onClick={handleLogout}
                  className={`transition-colors cursor-pointer ${
                    isFallSeason ? 'hover:text-orange-600' : 'hover:text-rose-600'
                  }`}
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={
                    isFallSeason
                      ? 'hover:text-orange-600 transition-colors'
                      : 'hover:text-stone-900 transition-colors'
                  }
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className={
                    isFallSeason
                      ? 'hover:text-orange-600 transition-colors'
                      : 'hover:text-stone-900 transition-colors'
                  }
                >
                  Create Account
                </Link>
              </>
            )}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-stone-400">
            &copy; {new Date().getFullYear()} QuickCrave. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;