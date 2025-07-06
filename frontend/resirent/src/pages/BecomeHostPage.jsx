// src/pages/BecomeHostPage.jsx
import { Link } from 'react-router-dom';

import ResidenceView from '../assets/residence-view.jpg';

const BecomeHostPage = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:block lg:w-1/2 lg:pl-10 mb-5">
            <img src={ResidenceView} alt="Photo of a beautiful residence" className="rounded-lg shadow-xl" />
        </div>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Faites croître le potentiel de vos résidences en Côte d'Ivoire
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Vous êtes propriétaire de résidences à Abidjan et souhaitez compléter vos revenus tout en donnant aux voyageurs et touristes des expériences locales authentiques ? Rejoignez notre communauté d'hôtes et faites de votre bien un atout précieux.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <p className="text-lg text-gray-700">Touchez un large public de locataires locaux et internationaux.</p>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <p className="text-lg text-gray-700">Bénéficiez d'un contrôle flexible sur vos annonces, votre disponibilité et vos tarifs.</p>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <p className="text-lg text-gray-700">Traitez vous-même les paiements de façon sécurisée et directement avec les clients.</p>
              </div>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                <p className="text-lg text-gray-700">Un accompagnement dédié pour vous aider à réussir en tant qu'hôte.</p>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/register-owner" className="sweet-gradient-btn text-xl text-gray-900 py-3 px-8 rounded-md">
                Créer un compte
              </Link>
              <p className="mt-3 text-sm text-gray-500">Il est facile de commencer, créer un compte maintenant!</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Comment ça marche</h2>
          <div className="md:grid md:grid-cols-3 md:gap-8">
            <div>
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-blue-100 text-blue-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Publier votre résidence</h3>
              <p className="mt-2 text-md text-gray-600">Créez une annonce détaillée avec photos, équipements et tarifs. Mettez en valeur les atouts de votre résidence à Abidjan.</p>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-green-100 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5l-14 4.5m5-.5l14-4.5M4 9l14-3M4 15l14 3M4 20l14-4.5m-14 4.5l14 4.5"></path></svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Gérer vos réservations</h3>
              <p className="mt-2 text-md text-gray-600">Recevez les demandes de réservation des clients intéressés. Gérez votre calendrier et communiquez directement avec les locataires.</p>
            </div>
            <div className="mt-8 md:mt-0">
              <div className="flex items-center justify-center h-16 w-16 rounded-md bg-yellow-100 text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Gagner de l'argent</h3>
              <p className="mt-2 text-md text-gray-600">Recevez directement vos paiements en toute sécurité pour vos réservations confirmées. Augmentez vos revenus en partageant le lien de votre résidence.</p>
            </div>
          </div>
        </div>

        {/* Call to Action Section (Mobile) */}
        <div className="mt-10 text-center lg:hidden">
          <Link to="/register-owner" className="sweet-gradient-btn text-xl text-gray-900 py-3 px-8 rounded-md">
            Créer un compte
          </Link>
          <p className="mt-3 text-sm text-gray-500">Il est facile de commencer, créer un compte maintenant!.</p>
        </div>
      </div>
    </div>
  );
};

export default BecomeHostPage;