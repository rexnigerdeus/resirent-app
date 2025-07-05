// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { fetchPublicResidences } from '../services/api';
import ResidenceCard from '../components/Shared/ResidenceCard';

const HomePage = () => {
  const [residences, setResidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function to fetch the data
    const getResidences = async () => {
      try {
        const response = await fetchPublicResidences();
        setResidences(response.data);
      } catch (err) {
        setError('Failed to fetch residences. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getResidences();
  }, []); // The empty array [] means this effect runs only once when the component mounts

  // Conditional Rendering based on the state
  if (loading) {
    return <div className="text-center p-8">Loading residences...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Découvrez nos Résidences</h1>
      {residences.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {residences.map((residence) => (
            <ResidenceCard key={residence.id} residence={residence} />
          ))}
        </div>
      ) : (
        <p>Aucune résidence disponible pour le moment. Réessayez plus tard.</p>
      )}
    </div>
  );
};

export default HomePage;