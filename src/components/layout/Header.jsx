import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
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

  // Fallback initial for users without a profile image
  const getUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-500 ${
        isFallSeason
          ? 'border-amber-200/60 bg-amber-50/80'
          : 'border-stone-200/60 bg-stone-50/80'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 py-2">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xl transition-all duration-300 ${
                isFallSeason
                  ? 'bg-orange-500/10 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                  : 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
              }`}
            >
              {isFallSeason ? '🎃' : 'Q'}
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-900 leading-none">
                Quick
                <span className={isFallSeason ? 'text-orange-600' : 'text-rose-600'}>
                  Crave
                </span>
              </span>
              <span className="text-[11px] font-medium text-stone-400 tracking-wide mt-1">
                {isFallSeason ? 'Spooky & cozy recipes' : 'Simple, everyday recipes'}
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link
              to="/explore"
              className={isFallSeason ? 'hover:text-orange-600 transition-colors' : 'hover:text-rose-600 transition-colors'}
            >
              Explore
            </Link>
            <Link
              to="/my-recipes"
              className={isFallSeason ? 'hover:text-orange-600 transition-colors' : 'hover:text-rose-600 transition-colors'}
            >
              My Recipes
            </Link>
            <Link
              to="/saved-recipes"
              className={isFallSeason ? 'hover:text-orange-600 transition-colors' : 'hover:text-rose-600 transition-colors'}
            >
              Saved Recipes
            </Link>
            <Link
              to="/about"
              className={isFallSeason ? 'hover:text-orange-600 transition-colors' : 'hover:text-rose-600 transition-colors'}
            >
              About
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                {/* User Profile Picture & Hover Menu Container */}
                <div className="relative group py-1">
                  <button
                    type="button"
                    className="flex items-center focus:outline-none cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User Profile'}
                        className={`w-10 h-10 rounded-full object-cover border-2 transition-colors shadow-xs ${
                          isFallSeason
                            ? 'border-amber-200 group-hover:border-orange-500'
                            : 'border-stone-200 group-hover:border-rose-400'
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-full border-2 font-bold text-sm flex items-center justify-center transition-colors shadow-xs ${
                          isFallSeason
                            ? 'bg-orange-100 border-amber-200 text-orange-800 group-hover:border-orange-500'
                            : 'bg-rose-100 border-stone-200 text-rose-700 group-hover:border-rose-400'
                        }`}
                      >
                        {getUserInitial()}
                      </div>
                    )}
                  </button>

                  {/* Hover Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-1 w-52 hidden group-hover:block transition-all duration-150">
                    <div
                      className={`bg-white rounded-2xl border shadow-xl py-2 text-stone-700 text-sm overflow-hidden ${
                        isFallSeason
                          ? 'border-amber-200/80 shadow-orange-950/5'
                          : 'border-stone-200/80 shadow-stone-900/5'
                      }`}
                    >
                      {/* User Information Header */}
                      <div className="px-4 py-2.5 border-b border-stone-100 mb-1 bg-stone-50/50">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Dropdown Navigation Links */}
                      <Link
                        to="/profile"
                        className={`flex items-center px-4 py-2 hover:bg-stone-50 font-medium transition-colors ${
                          isFallSeason ? 'hover:text-orange-600' : 'hover:text-rose-600'
                        }`}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-recipes"
                        className={`flex items-center px-4 py-2 hover:bg-stone-50 font-medium transition-colors ${
                          isFallSeason ? 'hover:text-orange-600' : 'hover:text-rose-600'
                        }`}
                      >
                        My Recipes
                      </Link>
                      <Link
                        to="/saved-recipes"
                        className={`flex items-center px-4 py-2 hover:bg-stone-50 font-medium transition-colors ${
                          isFallSeason ? 'hover:text-orange-600' : 'hover:text-rose-600'
                        }`}
                      >
                        Saved Recipes
                      </Link>
                      <Link
                        to="/settings"
                        className={`flex items-center px-4 py-2 hover:bg-stone-50 font-medium transition-colors ${
                          isFallSeason ? 'hover:text-orange-600' : 'hover:text-rose-600'
                        }`}
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
                    isFallSeason
                      ? 'text-stone-500 hover:text-orange-600'
                      : 'text-stone-500 hover:text-rose-600'
                  }`}
                >
                  Log Out
                </button>
              </div>
            ) : (
              /* Signed-Out State */
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isFallSeason
                    ? 'text-stone-600 hover:text-orange-600'
                    : 'text-stone-600 hover:text-rose-600'
                }`}
              >
                Sign In
              </Link>
            )}

            <Link
              to="/add-recipe"
              className={`py-2.5 px-5 rounded-full font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow active:scale-95 ${
                isFallSeason
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-50'
              }`}
            >
              + Share a Recipe
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;