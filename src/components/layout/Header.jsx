import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  const getUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-md transition-colors duration-500 ${
        isFallSeason
          ? 'border-amber-200/60 bg-amber-50/90'
          : 'border-stone-200/60 bg-stone-50/90'
      }`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 py-2">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-lg sm:text-xl transition-all duration-300 ${
                isFallSeason
                  ? 'bg-orange-500/10 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'
                  : 'bg-rose-500/10 text-rose-600 group-hover:bg-rose-500 group-hover:text-white'
              }`}
            >
              {isFallSeason ? '🎃' : 'Q'}
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 leading-none">
                Quick
                <span className={isFallSeason ? 'text-orange-600' : 'text-rose-600'}>
                  Crave
                </span>
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-stone-400 tracking-wide mt-0.5 sm:mt-1 hidden xs:inline">
                {isFallSeason ? 'Spooky & cozy recipes' : 'Simple, everyday recipes'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-600">
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
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Desktop Profile Menu */}
                <div className="relative group py-1 hidden md:block">
                  <button
                    type="button"
                    className="flex items-center focus:outline-none cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User Profile'}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 transition-colors shadow-xs ${
                          isFallSeason
                            ? 'border-amber-200 group-hover:border-orange-500'
                            : 'border-stone-200 group-hover:border-rose-400'
                        }`}
                      />
                    ) : (
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 font-bold text-xs sm:text-sm flex items-center justify-center transition-colors shadow-xs ${
                          isFallSeason
                            ? 'bg-orange-100 border-amber-200 text-orange-800 group-hover:border-orange-500'
                            : 'bg-rose-100 border-stone-200 text-rose-700 group-hover:border-rose-400'
                        }`}
                      >
                        {getUserInitial()}
                      </div>
                    )}
                  </button>

                  <div className="absolute right-0 top-full pt-1 w-52 hidden group-hover:block transition-all duration-150">
                    <div
                      className={`bg-white rounded-2xl border shadow-xl py-2 text-stone-700 text-sm overflow-hidden ${
                        isFallSeason
                          ? 'border-amber-200/80 shadow-orange-950/5'
                          : 'border-stone-200/80 shadow-stone-900/5'
                      }`}
                    >
                      <div className="px-4 py-2.5 border-b border-stone-100 mb-1 bg-stone-50/50">
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-[11px] text-stone-400 truncate">
                          {user.email}
                        </p>
                      </div>

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

                {/* Logout Button (Desktop) */}
                <button
                  onClick={handleLogout}
                  className={`hidden md:block px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
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
                className={`hidden sm:inline-block px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                  isFallSeason
                    ? 'text-stone-600 hover:text-orange-600'
                    : 'text-stone-600 hover:text-rose-600'
                }`}
              >
                Sign In
              </Link>
            )}

            {/* Share Recipe Button */}
            <Link
              to="/add-recipe"
              className={`py-2 px-3 sm:py-2.5 sm:px-5 rounded-full font-semibold text-xs sm:text-sm transition-all duration-200 shadow-xs hover:shadow active:scale-95 shrink-0 ${
                isFallSeason
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/20'
                  : 'bg-stone-900 hover:bg-stone-800 text-stone-50'
              }`}
            >
              + Share
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              type="button"
              className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200/60 py-3 space-y-1.5 transition-all">
            <Link
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Explore
            </Link>
            <Link
              to="/my-recipes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              My Recipes
            </Link>
            <Link
              to="/saved-recipes"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              Saved Recipes
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              About
            </Link>

            {user ? (
              <div className="pt-2 border-t border-stone-200/60 space-y-1">
                <div className="px-3 py-1.5">
                  <p className="text-xs font-semibold text-stone-900 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-stone-200/60">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-100"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};

export default Header;