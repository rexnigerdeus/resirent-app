// src/components/Shared/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    // Redirect to home page after logout
    navigate('/');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              RESIRENT
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex md:space-x-6 md:items-center">
            <Link to="/" className="text-gray-700 text-base hover:text-indigo-600">
              Accueil
            </Link>
            {user ? (
              // If user is logged in
              <>
              
                {user.role === 'owner' && (
                  <Link to="/owner/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Mon compte</Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              // If user is logged out
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Se connecter</Link>
                <Link to="/register-renter" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">S'inscrire</Link>
                <Link to="/become-host" className="sweet-gradient-btn text-white px-3 py-2 rounded-md text-base font-medium transition">Devenir propriétaire</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none sweet-gradient-btn"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-white">
          <Link
            to="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
          >
            Accueil
          </Link>

          {user ? (
              // If user is logged in
              <>
              
                {user.role === 'owner' && (
                  <Link to="/owner/dashboard" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Mon compte</Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              // If user is logged out
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Se connecter</Link>
                <Link to="/register-renter" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">S'inscrire</Link>
                <Link to="/become-host" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium">Devenir propriétaire</Link>
              </>
            )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;