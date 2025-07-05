// src/pages/EditResidencePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchOwnerResidenceDetails, updateResidence } from '../services/api';

const EditResidencePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State for form data, files, and UI status
  const [formData, setFormData] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]); // State for new file uploads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch existing residence data on page load
  useEffect(() => {
    const getResidence = async () => {
      try {
        const response = await fetchOwnerResidenceDetails(id);
        setFormData(response.data);
      } catch (err) {
        setError("Failed to load residence data.");
      } finally {
        setLoading(false);
      }
    };
    getResidence();
  }, [id]);

  // Handler for text-based form inputs
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // --- THIS IS THE MISSING FUNCTION ---
  // Handler for the file input
  const handleFileChange = (e) => {
    setUploadedImages(Array.from(e.target.files));
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const residenceFormData = new FormData();
    
    // Append all text/number/boolean fields from the form state
    for (const key in formData) {
      if (key !== 'photos' && key !== 'id' && key !== 'owner' && key !== 'created_at') {
        residenceFormData.append(key, formData[key]);
      }
    }

    // Append any newly uploaded image files
    if (uploadedImages.length > 0) {
      uploadedImages.forEach(image => {
        // Use the key 'uploaded_images' as expected by the backend
        residenceFormData.append('uploaded_images', image);
      });
    }
    
    try {
      await updateResidence(id, residenceFormData);
      navigate('/owner/dashboard');
    } catch (err) {
      setError("Failed to update residence. Please check your inputs.");
      console.error(err)
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading editor...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!formData) return null;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg text-gray-800">
        <h1 className="text-3xl font-bold mb-6">Modifier Résidence</h1>
        {/* Display existing images */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Photos existantes</h3>
            <div className="flex flex-wrap gap-4">
                {formData.photos.map(photo => (
                    <img key={photo.id} src={photo.image} alt="Existing residence" className="w-32 h-32 object-cover rounded-md shadow-md"/>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">L'upload de nouvelles photos s'ajoutera aux photos existantes. La gestion (suppression) des photos sera ajoutée ultérieurement.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
          <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2">Nom de la résidence</label>
          <input name="title" value={formData.title} required onChange={handleChange} className="input-style" />
          <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description} required rows="4" onChange={handleChange} className="input-style"></textarea>
          
          <div className="grid grid-cols-1 md:grid-cols-2">
            <label htmlFor="address" className="text-sm font-medium text-gray-700">Adresse</label>
            <input name="address" value={formData.address} required onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="city" className="text-sm font-medium text-gray-700">Ville</label>
            <input name="city" value={formData.city} required onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="country" className="text-sm font-medium text-gray-700">Pays</label>
            <input name="country" value={formData.country} required onChange={handleChange} className="input-style mb-6" />
            <label htmlFor="price_per_night" className="text-sm font-medium text-gray-700">Prix/jour</label>
            <input name="price_per_night" value={formData.price_per_night} type="number" required onChange={handleChange} className="input-style" />
          </div>

          <label htmlFor="conditions" className="text-sm font-medium text-gray-700 mb-2">Conditions et options</label>
          <textarea name="conditions" value={formData.conditions || ''} placeholder="Conditions (e.g., no pets, no smoking)" rows="3" onChange={handleChange} className="input-style"></textarea>

          <div>
            <label htmlFor="uploaded_images" className="block text-sm font-medium text-gray-700">Ajouter de nouvelles photos</label>
            {/* This input now correctly uses handleFileChange */}
            <input id="uploaded_images" name="uploaded_images" type="file" multiple onChange={handleFileChange} className="mt-1 input-style" />
          </div>

          <div className="flex items-center">
            <input id="is_available" name="is_available" type="checkbox" checked={formData.is_available} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
            <label htmlFor="is_available" className="ml-2 block text-sm text-gray-900">La résidence est-elle disponible?</label>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Link to="/owner/dashboard" className="bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300">Annuler</Link>
            <button type="submit" disabled={saving} className="sweet-gradient-btn font-bold text-gray-800 px-6 py-2">
              {saving ? 'Modification en cours...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResidencePage;