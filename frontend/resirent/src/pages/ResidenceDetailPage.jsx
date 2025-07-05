// src/pages/ResidenceDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchResidenceDetails, createBooking } from '../services/api';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Imports carousel CSS

const ResidenceDetailPage = () => {
  // Hooks for routing and state management
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // State for fetching residence data
  const [residence, setResidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the booking form
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  // State to hold booking confirmation details after a successful booking
  const [bookingDetails, setBookingDetails] = useState(null);

  // Effect to fetch residence details when the component mounts or ID changes
  useEffect(() => {
    const getResidenceDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchResidenceDetails(id);
        setResidence(response.data);
      } catch (err) {
        setError('Failed to fetch residence details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getResidenceDetails();
  }, [id]);

  // Handler for booking form submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingDetails(null);

    // 1. Check if user is logged in before proceeding
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // 2. Simple frontend validation
    if (!checkInDate || !checkOutDate) {
      setBookingError('Please select both a check-in and check-out date.');
      return;
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      setBookingError('Check-out date must be after check-in date.');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        residence: residence.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
      };
      const response = await createBooking(bookingData);
      // On success, store the entire booking confirmation object
      setBookingDetails(response.data);
    } catch (err) {
      // Display the specific error from the backend if available
      setBookingError(err.response?.data?.detail || 'Booking failed. The residence may not be available for these dates.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Render loading/error states
  if (loading) return <div className="text-center p-8">Loading Residence...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;
  if (!residence) return <div className="text-center p-8">Residence not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Photo Carousel Section */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-2xl">
        {residence.photos.length > 0 ? (
          <Carousel showThumbs={true} infiniteLoop={true} autoPlay={true} interval={5000} showArrows={true} emulateTouch={true}>
            {residence.photos.map(photo => (
              <div key={photo.id} className="h-[300px] md:h-[500px]">
                <img src={photo.image} alt={`View of ${residence.title}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </Carousel>
        ) : (
          <div className="bg-gray-200 w-full h-96 flex items-center justify-center rounded-lg shadow-lg">
            <p className="text-gray-500">No Images Available</p>
          </div>
        )}
      </div>

      {/* Main Content Card */}
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900">{residence.title}</h1>
        <p className="text-md text-gray-500 mt-2">{residence.address}, {residence.city}</p>
        <p className="text-sm text-gray-600 mt-4">Publiée par {residence.owner.first_name}</p>

        <div className="border-t border-gray-200 my-6"></div>

        <p className="text-gray-700 whitespace-pre-wrap">{residence.description}</p>
        
        <div className="border-t border-gray-200 my-6"></div>

        <p className="text-gray-800 text-2xl font-bold whitespace-pre-wrap mb-2">Conditions & Options</p>
        <p className="text-gray-700 whitespace-pre-wrap">{residence.conditions}</p>
        
        <div className="border-t border-gray-200 my-6"></div>
        
        <div className="flex justify-between items-center mb-6">
          <p className="text-2xl font-bold resirent-color">
            {new Intl.NumberFormat('fr-CI', { style: 'currency', currency: 'XOF' }).format(residence.price_per_night)}
            <span className="text-lg font-normal text-gray-600"> / jour</span>
          </p>
        </div>

        {/* --- DYNAMIC BOOKING SECTION --- */}
        {bookingDetails ? (
          // View 1: Show after a successful booking
          <div className="p-6 text-center bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-2xl font-bold text-green-800">Réservation en validation !</h3>
            <p className="mt-2 text-gray-700">Votre demande a été envoyée. Le propriétaire vous contactera pour confirmer et organiser le paiement.</p>
            <div className="mt-4 pt-4 border-t text-left bg-white p-4 rounded-md">
              <h4 className="font-semibold text-gray-800">Infos contacts :</h4>
              <p className="text-gray-800"><strong>Propriétaire:</strong> {bookingDetails.owner.first_name} {bookingDetails.owner.last_name}</p>
              <p className="text-gray-800"><strong>Email:</strong> {bookingDetails.owner.email}</p>
              <p className="text-gray-800"><strong>Téléphone:</strong> {bookingDetails.owner.phone_number || 'Non disponible'}</p>
            </div>
            <button onClick={() => setBookingDetails(null)} className="mt-6 sweet-gradient-btn font-bold text-gray-800">Réserver un autre séjour ou des dates différentes</button>
          </div>
        ) : user ? (
          // View 2: Show booking form if user is logged in
          <form onSubmit={handleBookingSubmit}>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 ">Faire une réservation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="check_in_date" className="block text-sm font-medium text-gray-800">Date d'arrivée</label>
                <input type="date" id="check_in_date" value={checkInDate} onChange={e => setCheckInDate(e.target.value)} className="mt-1 input-style" />
              </div>
              <div>
                <label htmlFor="check_out_date" className="block text-sm font-medium text-gray-800">Date de départ</label>
                <input type="date" id="check_out_date" value={checkOutDate} onChange={e => setCheckOutDate(e.target.value)} className="mt-1 input-style" />
              </div>
            </div>
            {bookingError && <p className="mt-4 text-red-600">{bookingError}</p>}
            <div className="mt-6">
              <button type="submit" disabled={bookingLoading || !residence.is_available} className="w-full sweet-gradient-btn text-gray-800 font-bold">
                {bookingLoading ? 'Réservation en cours...' : (residence.is_available ? 'Réserver maintenant' : 'Actuellement indisponible')}
              </button>
            </div>
          </form>
        ) : (
          // View 3: Show login prompt if user is logged out
          <div className="text-center p-6 border-2 border-dashed rounded-lg bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800">Connectez-vous pour réserver</h3>
            <p className="text-gray-600 my-2">Vous devez être connecté(e) pour faire une réservation.</p>
            <Link to="/login" state={{ from: location }} className="mt-4 inline-block sweet-gradient-btn">Se connecter ou s'inscrire</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidenceDetailPage;