// src/pages/RegisterRenterPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { registerRenter } from '../services/api';

const RegisterRenterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    phone_number: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Step 1: Register the new user
      await registerRenter(formData);
      
      // Step 2: Automatically log the user in after successful registration
      await loginUser(formData.email, formData.password);
      
      // Step 3: Redirect to the home page
      navigate('/');
    } catch (err) {
      // A more robust solution would be to parse the specific error from the backend
      setError('Registration failed. A user with that email or username may already exist.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">
          Créer un compte
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form fields for first and last name */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="first_name" className="text-sm font-medium text-gray-700">Prénom</label>
              <input id="first_name" name="first_name" type="text" required onChange={handleChange} className="mt-1 w-full input-style" />
            </div>
            <div className="w-1/2">
              <label htmlFor="last_name" className="text-sm font-medium text-gray-700">Nom</label>
              <input id="last_name" name="last_name" type="text" required onChange={handleChange} className="mt-1 w-full input-style" />
            </div>
          </div>
          
          {/* Other fields */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Adresse email</label>
            <input id="email" name="email" type="email" required onChange={handleChange} className="mt-1 w-full input-style" />
          </div>
          <div>
            <label htmlFor="phone_number" className="text-sm font-medium text-gray-700">Numéro de téléphone</label>
            <input id="phone_number" name="phone_number" type="tel" required onChange={handleChange} className="mt-1 w-full input-style" />
          </div>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <input id="username" name="username" type="text" required onChange={handleChange} className="mt-1 w-full input-style" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Mot de passe</label>
            <input id="password" name="password" type="password" required onChange={handleChange} className="mt-1 w-full input-style" />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="w-full sweet-gradient-btn font-bold text-gray-800">
              {loading ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Vous avez déjà un compte?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Connectez-vous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterRenterPage;

// To avoid repeating class names, let's add a utility class to our main CSS file.
// Open `src/index.css` and add this at the bottom:
/*
@layer components {
  .input-style {
    @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500;
  }
  .btn-primary {
    @apply w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400;
  }
}
*/