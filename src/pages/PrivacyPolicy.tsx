
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">
            Politique de Confidentialité
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                1. Collecte d'informations
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Belide Magazine collecte des informations lorsque vous vous inscrivez sur notre site, 
                vous abonnez à notre newsletter, ou participez à nos événements. Les informations 
                collectées incluent votre nom, adresse e-mail, et autres coordonnées pertinentes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                2. Utilisation des informations
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les informations que nous collectons peuvent être utilisées pour :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Personnaliser votre expérience utilisateur</li>
                <li>Améliorer notre site web et nos services</li>
                <li>Vous envoyer des newsletters et communications</li>
                <li>Traiter vos demandes et réservations d'événements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                3. Protection des informations
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous mettons en place diverses mesures de sécurité pour protéger vos informations 
                personnelles. Vos données sont stockées dans un environnement sécurisé et ne sont 
                accessibles qu'aux employés autorisés.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                4. Partage d'informations
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles 
                à des tiers sans votre consentement, sauf pour fournir les services demandés ou 
                si requis par la loi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                5. Cookies
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Notre site utilise des cookies pour améliorer votre expérience de navigation. 
                Vous pouvez choisir de désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                6. Contact
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant cette politique de confidentialité, 
                contactez-nous à : <a href="mailto:contact@belidemag.net" className="text-purple-600 hover:underline">contact@belidemag.net</a>
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
