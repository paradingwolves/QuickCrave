import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Header = () => {
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

  // Fallback initial for users without a profile image
  const getUserInitial = () => {
    if (user?.displayName) return user.displayName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 flex items-center justify-center font-bold text-stone-50 text-xl shadow-md group-hover:bg-rose-600 transition-colors">
              Q
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-stone-900 leading-none">
                Quick<span className="text-rose-600">Crave</span>
              </span>
              <span className="text-[10px] font-semibold text-stone-400 tracking-wider uppercase mt-0.5">
                No-BS Recipes
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <Link to="/explore" className="hover:text-stone-900 transition-colors">
              Explore
            </Link>
            <Link to="/recipes" className="hover:text-stone-900 transition-colors">
              Saved Recipes
            </Link>
            <Link to="/about" className="hover:text-stone-900 transition-colors">
              About
            </Link>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-3">
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
                        className="w-10 h-10 rounded-full object-cover border-2 border-stone-200 group-hover:border-rose-600 transition-colors shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-rose-100 border-2 border-stone-200 group-hover:border-rose-600 text-rose-700 font-bold text-sm flex items-center justify-center transition-colors shadow-sm">
                        {getUserInitial()}
                      </div>
                    )}
                  </button>

                  {/* Hover Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-1 w-52 hidden group-hover:block transition-all duration-150">
                    <div className="bg-white rounded-2xl border border-stone-200 shadow-xl shadow-stone-900/10 py-2 text-stone-700 text-sm overflow-hidden">
                      
                      {/* User Information Header */}
                      <div className="px-4 py-2 border-b border-stone-100 mb-1">
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
                        className="flex items-center px-4 py-2 hover:bg-stone-50 hover:text-rose-600 font-medium transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-recipes"
                        className="flex items-center px-4 py-2 hover:bg-stone-50 hover:text-rose-600 font-medium transition-colors"
                      >
                        My Recipes
                      </Link>
                      <Link
                        to="/recipes"
                        className="flex items-center px-4 py-2 hover:bg-stone-50 hover:text-rose-600 font-medium transition-colors"
                      >
                        Saved Recipes
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center px-4 py-2 hover:bg-stone-50 hover:text-rose-600 font-medium transition-colors"
                      >
                        Settings
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Logout Button (Replaces Sign In) */}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </div>
            ) : (
              /* Signed-Out State */
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Sign In
              </Link>
            )}

            <Link 
              to="/add-recipe"
              className="py-2.5 px-5 rounded-full bg-stone-900 hover:bg-rose-600 text-stone-50 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              + Submit Recipe
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;