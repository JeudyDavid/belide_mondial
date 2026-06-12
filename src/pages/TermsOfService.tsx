
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">
            Conditions d'Utilisation
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                1. Acceptation des conditions
              </h2>
              <p className="text-gray-600 leading-relaxed">
                En accédant et en utilisant le site de Belide Magazine, vous acceptez d'être lié 
                par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, 
                veuillez ne pas utiliser notre site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                2. Utilisation du site
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Vous vous engagez à utiliser notre site de manière légale et appropriée. 
                Il est interdit de :
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                <li>Perturber le fonctionnement du site</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Tout le contenu présent sur le site de Belide Magazine, incluant les textes, 
                images, logos, et designs, est protégé par les droits d'auteur et autres 
                droits de propriété intellectuelle.
              </p>
            </section>


            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
              45. Limitation de responsabilité
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Belide Magazine ne sera pas responsable des dommages directs, indirects, 
                accessoires ou consécutifs résultant de l'utilisation de notre site ou 
                de nos services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                5. Modifications
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. 
                Les modifications prendront effet dès leur publication sur le site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                7. Contact
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Pour toute question concernant ces conditions d'utilisation, 
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

export default TermsOfService;
