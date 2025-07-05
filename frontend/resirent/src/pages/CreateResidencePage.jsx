// src/pages/CreateResidencePage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createResidence } from '../services/api';

const CreateResidencePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    country: '',
    price_per_night: '',
    conditions: '',
    is_available: true,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    // e.target.files is a FileList, we convert it to an array
    setUploadedImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const residenceFormData = new FormData();
    // Append all text/number/boolean fields
    for (const key in formData) {
      residenceFormData.append(key, formData[key]);
    }
    // Append all image files
    if (uploadedImages.length > 0) {
      uploadedImages.forEach(image => {
        residenceFormData.append('uploaded_images', image);
      });
    }

    try {
      await createResidence(residenceFormData);
      // On success, redirect back to the dashboard
      navigate('/owner/dashboard');
    } catch (err) {
      setError('Failed to create residence. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Ajouter une Résidence</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">Nom de la résidence</label>
          <input name="title" required placeholder="Ajouter un nom pour votre résidence" onChange={handleChange} className="input-style" />
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" required placeholder="Donnez tous les détails sur la résidence" rows="4" onChange={handleChange} className="input-style"></textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Adresse</label>
            <input name="address" required placeholder="Location/adresse" onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="city" className="text-sm font-medium text-gray-700">Ville</label>
            <input name="city" required placeholder="Ville" onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="country" className="text-sm font-medium text-gray-700">Pays</label>
            <input name="country" required placeholder="Pays" onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="price_per_night" className="text-sm font-medium text-gray-700">Prix/jour</label>
            <input name="price_per_night mb-6" type="number" required placeholder="Prix par jour pour louer" onChange={handleChange} className="input-style" />
          </div>
          
          <label htmlFor="conditions" className="text-sm font-medium text-gray-700 mb-2">Conditions et options</label>
          <textarea name="conditions" placeholder="Des conditions particulières (qu'est-ce que vous autorisez ou pas?)" rows="3" onChange={handleChange} className="input-style"></textarea>

          <div>
            <label htmlFor="uploaded_images" className="block text-sm font-medium text-gray-700">Ajouter des photos de votre résidence</label>
            <input id="uploaded_images" name="uploaded_images" type="file" multiple onChange={handleFileChange} className="mt-1 input-style" />
          </div>

          <div className="flex items-center">
            <input id="is_available" name="is_available" type="checkbox" checked={formData.is_available} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">Rendre cette résidence disponible immédiatement</label>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link to="/owner/dashboard" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">Annuler</Link>
            <button type="submit" disabled={loading} className="sweet-gradient-btn font-bold text-gray-900 px-6 py-2">
              {loading ? 'Publication en cours...' : 'Publier la résidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResidencePage;