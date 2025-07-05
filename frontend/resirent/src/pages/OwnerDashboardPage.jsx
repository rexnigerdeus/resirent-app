// src/pages/OwnerDashboardPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { fetchOwnerResidences, fetchOwnerBookings, updateBookingStatus } from '../services/api';
import Modal from '../components/Shared/Modal';

const OwnerDashboardPage = () => {
  const { user } = useAuth();
  const [residences, setResidences] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // We need to know the residence limit from the user's profile
  // The 'user' object from our AuthContext contains this from the JWT token!
  const residenceLimit = user?.residences_to_publish || 0;
  const canAddResidence = residences.length < residenceLimit;

  // Function to fetch all dashboard data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [residencesResponse, bookingsResponse] = await Promise.all([
        fetchOwnerResidences(),
        fetchOwnerBookings()
      ]);
      setResidences(residencesResponse.data);
      setBookings(bookingsResponse.data);
    } catch (err) {
      setError("Failed to fetch your dashboard data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle booking status updates
  const handleBookingUpdate = async (bookingId, newStatus) => {
    const originalBookings = [...bookings];
    // Optimistically update the UI for a fast user experience
    setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    try {
      await updateBookingStatus(bookingId, newStatus);
    } catch (err) {
      setError("Failed to update booking status. Please try again.");
      // If the API call fails, revert the change
      setBookings(originalBookings);
    }
  };

  if (loading) return <div className="text-center p-8">Loading your dashboard...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="mt-1 text-md text-gray-600">Votre plan vous donne droit à {residenceLimit} résidence(s). Vous avez publié {residences.length}.</p>
            </div>
            
            {/* --- UPDATED BUTTON LOGIC --- */}
            {canAddResidence ? (
              <Link to="/owner/residences/create" className="sweet-gradient-btn mt-4 sm:mt-0">
                + Ajouter résidence
              </Link>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="sweet-gradient-btn mt-4 sm:mt-0 bg-gray-400 cursor-pointer hover:bg-gray-500">
                + Ajouter résidence
              </button>
            )}
          </div>
          
        
        {/* Residences Section - Responsive Table */}
        <div className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-2xl font-bold text-gray-800 p-6">Mes Résidences</h2>
          <div className="hidden md:block">
            {residences.length > 0 ? (
              <table className="min-w-full table-auto border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    <th className="text-left px-4 py-2">Nom</th>
                    <th className="text-left px-4 py-2">Statut</th>
                    <th className="text-left px-4 py-2">Prix/Jour</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {residences.map((residence) => (
                    <tr key={residence.id} className="flex flex-col md:table-row mb-4 md:mb-0 border-b md:border-none border-t border-gray-200">
                      <td className="px-6 py-4 whitespace-nowrap md:w-auto w-full font-bold md:font-medium text-gray-900" data-label="Title">{residence.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap md:w-auto w-full" data-label="Status">
                        {residence.is_available ? (
                          <span className="badge-green">Available</span>
                        ) : (
                          <span className="badge-red">Unavailable</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap md:w-auto w-full text-gray-900" data-label="Price">{new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(residence.price_per_night)}</td>
                      <td className="px-6 py-4 whitespace-nowrap md:text-right text-left text-sm font-medium">
                        <Link to={`/owner/residences/edit/${residence.id}`} className="resirent-color">Modifier</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="p-6 text-gray-500">You have not added any residences yet.</p>
            )}
          </div>

          {/* Mobile version */}
            <div className="md:hidden space-y-4">
              {residences.map((residence) => (
                <div
                  key={residence.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Nom: </span>
                    <span className="font-semibold text-gray-800"> {residence.title} </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Statut: </span>
                      {residence.is_available ? (
                        <span className="badge-green">Available</span>
                      ) : (
                        <span className="badge-red">Unavailable</span>
                      )}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-600">Prix: </span>
                    <span className="font-semibold text-gray-800">
                      {new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(residence.price_per_night)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-600">Actions: </span>
                    <Link to={`/owner/residences/edit/${residence.id}`} className="resirent-color">Modifier</Link>
                  </div>
                </div>
              ))}
            </div>
        </div>

        {/* Bookings Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Mes Réservations</h2>
          <div className="space-y-4">
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md border">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                    <div className="flex-grow">
                      <p className="font-bold text-lg text-gray-800">{booking.residence_title}</p>
                      <p className="text-sm text-gray-600 pt-2">
                        <strong>Intéressé(e):</strong> {booking.guest.first_name} {booking.guest.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Contact:</strong> {booking.guest.phone_number || 'Non disponible'}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600 mt-2 sm:mt-0 sm:text-right">
                      <p><strong>Dates:</strong> {booking.check_in_date} to {booking.check_out_date}</p>
                      <p><strong>A payer:</strong>{booking.price_per_night} FCFA</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <p className="text-sm text-gray-600 font-medium">Etat: <span className="capitalize font-bold">{booking.status}</span></p>
                    {booking.status === 'pending' && (
                      <div className="flex space-x-2 mt-2 sm:mt-0">
                        <button onClick={() => handleBookingUpdate(booking.id, 'confirmed')} className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600">Confirm</button>
                        <button onClick={() => handleBookingUpdate(booking.id, 'cancelled')} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="p-6 bg-white rounded-lg shadow-md text-gray-800">Vous n'avez pas de réservations.</p>
            )}
          </div>
        </div>
      </div>

      {/* --- MODAL DEFINITION --- */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)}
        className="text-gray-800"
        title="Publier plus de résidences"
      >
        <p className="text-gray-800">Vous avez atteint la limite de {residenceLimit} résidences.</p>
        <p className="mt-4 text-gray-800">Pour publier plus de résidences, veuillez contacter notre équipe d'assistance pour mettre à niveau votre forfait.</p>
        <div className="mt-6 text-center">
            <a href="mailto:admin@resirent.com" className="sweet-gradient-btn">
                Contactez l'admin
            </a>
        </div>
      </Modal>
    </>
  );
};

export default OwnerDashboardPage;