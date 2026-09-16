import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Footer = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

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
    <footer className="w-full border-t border-stone-200/80 bg-stone-100/60 text-stone-600 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Brand & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-900 flex items-center justify-center font-bold text-stone-50 text-sm shadow-sm">
              Q
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-stone-900 leading-tight">
                Quick<span className="text-rose-600">Crave</span>
              </span>
              <span className="text-[11px] text-stone-500">
                Direct-to-the-point recipes • quickcrave.ca
              </span>
            </div>
          </div>

          {/* Dynamic Navigation Links based on Auth State */}
          <nav className="flex items-center gap-6 text-xs font-semibold text-stone-500">
            <Link to="/explore" className="hover:text-stone-900 transition-colors">
              Explore
            </Link>

            {user ? (
              <>
                <Link to="/my-recipes" className="hover:text-stone-900 transition-colors">
                  My Recipes
                </Link>
                <button
                  onClick={handleLogout}
                  className="hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-stone-900 transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="hover:text-stone-900 transition-colors">
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