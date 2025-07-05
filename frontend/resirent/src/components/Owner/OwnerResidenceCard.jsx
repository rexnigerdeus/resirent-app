// src/components/Owner/OwnerResidenceCard.jsx
import { Link } from 'react-router-dom';

const OwnerResidenceCard = ({ residence }) => {
  const mainPhoto = residence.photos.length > 0 ? residence.photos[0].image : 'https://via.placeholder.com/400x250.png?text=No+Image';

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-2 mb-4 border">
      <img src={mainPhoto} alt={residence.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-bold truncate">{residence.title}</h3>
        <p className="text-sm text-gray-500">{residence.city}</p>
        <div className="mt-2">
          {residence.is_available ? (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Available</span>
          ) : (
            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Unavailable</span>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Link to={`/owner/residences/edit/${residence.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
            Edit Residence
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OwnerResidenceCard;