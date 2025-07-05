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
            <h3 className="font-bold">Registration Successful!</h3>
            <p>Your account is pending admin approval. You will be notified via email once it is active.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-center text-gray-900">
              Create your Owner Account
            </h2>
            <div className="text-center text-gray-500">Step {step} of 2</div>

            {/* --- STEP 1 FORM --- */}
            {step === 1 && (
              <form onSubmit={goToNextStep} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="first_name" type="text" required placeholder="First Name" onChange={handleChange} className="input-style" />
                  <input name="last_name" type="text" required placeholder="Last Name" onChange={handleChange} className="input-style" />
                  <input name="email" type="email" required placeholder="Email Address" onChange={handleChange} className="input-style" />
                  <input name="username" type="text" required placeholder="Username" onChange={handleChange} className="input-style" />
                  <input name="password" type="password" required placeholder="Password" onChange={handleChange} className="input-style" />
                  <input name="phone_number" type="tel" required placeholder="Phone Number" onChange={handleChange} className="input-style" />
                </div>
                <input name="address" type="text" required placeholder="Full Address" onChange={handleChange} className="input-style" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <label htmlFor="id_front_photo" className="block text-sm font-medium text-gray-700">ID Front Photo</label>
                    <input id="id_front_photo" name="id_front_photo" type="file" required onChange={handleFileChange} className="mt-1 input-style" />
                  </div>
                  <div>
                    <label htmlFor="id_back_photo" className="block text-sm font-medium text-gray-700">ID Back Photo</label>
                    <input id="id_back_photo" name="id_back_photo" type="file" required onChange={handleFileChange} className="mt-1 input-style" />
                  </div>
                </div>
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                <div className="flex justify-end">
                  <button type="submit" className="sweet-gradient-btn">Next: Confirm Pricing</button>
                </div>
              </form>
            )}

            {/* --- STEP 2 FORM --- */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-6 border rounded-lg bg-gray-50">
                  <h3 className="text-xl font-semibold text-center text-gray-700 mb-4">Pricing Summary</h3>
                  <div>
                    <label htmlFor="residences_to_publish" className="block text-sm font-medium text-gray-700">Number of residences to publish</label>
                    <input id="residences_to_publish" name="residences_to_publish" type="number" min="1" required value={formData.residences_to_publish} onChange={handleChange} className="mt-1 input-style" />
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-700">Price per Residence:</span>
                      <span className="font-semibold text-gray-700">{PRICE_PER_RESIDENCE.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                    <div className="flex justify-between items-center text-2xl text-gray-700 font-bold mt-2">
                      <span>Total Cost:</span>
                      <span>{totalCost.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={goToPrevStep} className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300">
                    &larr; Back
                  </button>
                  <button type="submit" disabled={loading} className="sweet-gradient-btn px-6 py-3">
                    {loading ? 'Submitting...' : 'Confirm & Complete Registration'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterOwnerPage;