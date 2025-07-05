// src/components/Shared/ResidenceCard.jsx
import { Link } from 'react-router-dom';

const ResidenceCard = ({ residence }) => {
  return (
    <Link to={`/residence/${residence.id}`}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
        <img
            className="h-56 w-full object-cover"
            src={residence.main_photo_url || 'https://via.placeholder.com/400x250.png?text=No+Image'}
            alt={`Photo of ${residence.title}`}
        />
        <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{residence.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{residence.address} . {residence.city}</p>
            <p className="text-lg font-bold resirent-color mt-2">
            {parseInt(residence.price_per_night, 10)}<span className="text-sm font-normal resirent-color">FCFA</span> <span className="text-sm font-normal text-gray-600">/ jour</span>
            </p>
        </div>
        </div>
    </Link>
  );
};

export default ResidenceCard;