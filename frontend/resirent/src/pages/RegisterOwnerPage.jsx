// src/pages/RegisterOwnerPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerOwner } from '../services/api';

const RegisterOwnerPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    first_name: '',
    last_name: '',
    password: '',
    address: '',
    phone_number: '',
    residences_to_publish: 1,
  });
  const [idFrontPhoto, setIdFrontPhoto] = useState(null);
  const [idBackPhoto, setIdBackPhoto] = useState(null);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const PRICE_PER_RESIDENCE = 25000;
  const totalCost = formData.residences_to_publish * PRICE_PER_RESIDENCE;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === 'id_front_photo') {
      setIdFrontPhoto(e.target.files[0]);
    } else if (e.target.name === 'id_back_photo') {
      setIdBackPhoto(e.target.files[0]);
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    // Simple validation before going to the next step
    if (!idFrontPhoto || !idBackPhoto) {
      setError("Please upload both front and back photos of your ID.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const goToPrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const ownerFormData = new FormData();
    for (const key in formData) {
      ownerFormData.append(key, formData[key]);
    }
    // Append profile data with dot notation for nested serializer on the backend
    ownerFormData.append('profile.address', formData.address);
    ownerFormData.append('profile.phone_number', formData.phone_number);
    ownerFormData.append('profile.residences_to_publish', formData.residences_to_publish);
    ownerFormData.append('profile.id_front_photo', idFrontPhoto);
    ownerFormData.append('profile.id_back_photo', idBackPhoto);

    try {
      await registerOwner(ownerFormData);
      setSuccess(true);
    } catch (err) {
      setError('Registration failed. A user with this email or username might already exist.');
      console.error(err);
      setStep(1); // Go back to step 1 if there's an error to allow correction
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-12">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-xl shadow-lg">
        {success ? (
          <div className="p-4 text-center bg-green-100 text-green-800 rounded-md">
            <h3 className="font-bold">Inscription réussie !</h3>
            <p>Votre compte est en attente de vérification et d'approbation par l'administrateur. Vous serez contactés par e-mail et par appel pour le paiement et l'activation de votre compte.</p>
            <p>Merci d'avoir choisi <span className="resirent-color">RESIRENT</span></p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
              Créer votre compte
            </h2>
            <div className="text-center text-gray-500">Etape {step} sur 2</div>

            {/* --- STEP 1 FORM --- */}
            {step === 1 && (
              <form onSubmit={goToNextStep} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="first_name" type="text" required placeholder="Prénom" onChange={handleChange} className="input-style" />
                  <input name="last_name" type="text" required placeholder="Nom" onChange={handleChange} className="input-style" />
                  <input name="email" type="email" required placeholder="Adresse Email" onChange={handleChange} className="input-style" />
                  <input name="username" type="text" required placeholder="Nom d'utilisateur" onChange={handleChange} className="input-style" />
                  <input name="password" type="password" required placeholder="Mot de passe" onChange={handleChange} className="input-style" />
                  <input name="phone_number" type="tel" required placeholder="Téléphone" onChange={handleChange} className="input-style" />
                </div>
                <input name="address" type="text" required placeholder="Adresse (lieu d'habitation)" onChange={handleChange} className="input-style" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label htmlFor="id_front_photo" className="block text-sm font-medium text-gray-700">Pièce d'identité (avant)</label>
                    <input id="id_front_photo" name="id_front_photo" type="file" required onChange={handleFileChange} className="mt-1 input-style" />
                  </div>
                  <div>
                    <label htmlFor="id_back_photo" className="block text-sm font-medium text-gray-700">Pièce d'identité (arrière)</label>
                    <input id="id_back_photo" name="id_back_photo" type="file" required onChange={handleFileChange} className="mt-1 input-style" />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="flex justify-end">
                  <button type="submit" className="sweet-gradient-btn text-gray-800">Continuer</button>
                </div>
              </form>
            )}

            {/* --- STEP 2 FORM --- */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 border rounded-lg bg-gray-50">
                  <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Frais d'hébergement</h3>
                  <div>
                    <label htmlFor="residences_to_publish" className="block text-sm font-medium text-gray-700">Nombre de résidences à publier</label>
                    <input id="residences_to_publish" name="residences_to_publish" type="number" min="1" required value={formData.residences_to_publish} onChange={handleChange} className="mt-1 input-style" />
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-700">Coût par résidence:</span>
                      <span className="font-semibold text-gray-700">{PRICE_PER_RESIDENCE.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl text-gray-700 font-bold mt-2">
                      <span>Coût total:</span>
                      <span>{totalCost.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">A partir de 4 résidences vous serez contactés par l'administrateur pour des bonus de réductions sur vos coûts.</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={goToPrevStep} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300">
                    <span className="resirent-color">&larr;</span>
                  </button>
                  <button type="submit" disabled={loading} className="sweet-gradient-btn text-gray-800 px-6 py-3">
                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        <p className="text-sm text-center text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterOwnerPage;