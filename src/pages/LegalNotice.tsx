
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const LegalNotice = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-playfair font-bold text-gray-800 mb-8">
            Mentions Légales
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                1. Informations sur l'éditeur
              </h2>
              <div className="text-gray-600 leading-relaxed space-y-2">
                <p><strong>Nom de la publication :</strong> Belide Magazine</p>
                {/* <p><strong>Directeur de la publication :</strong> [À compléter]</p> */}
                <p><strong>Adresse :</strong> Haïti</p>
                <p><strong>Téléphone :</strong> +509 37 74 9691</p>
                <p><strong>Email :</strong> contact@belidemag.net</p>
                <p><strong>Site web :</strong> https://belidemag.net</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                2. Hébergement
              </h2>
              <div className="text-gray-600 leading-relaxed">
                <p>Ce site est hébergé par :</p>
                <p><strong>ziledev :</strong> Entreprise de développement web</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                3. Propriété intellectuelle
              </h2>
              <p className="text-gray-600 leading-relaxed">
                L'ensemble de ce site relève de la législation haïtienne et internationale 
                sur le droit d'auteur et la propriété intellectuelle. Tous les droits de 
                reproduction sont réservés, y compris pour les documents téléchargeables 
                et les représentations iconographiques et photographiques.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                4. Crédits photos
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les photographies utilisées sur ce site sont soit la propriété de Belide Magazine, 
                soit utilisées avec l'autorisation de leurs propriétaires respectifs, soit 
                libres de droits.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                5. Données personnelles
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Conformément à la loi sur la protection des données personnelles, vous disposez 
                d'un droit d'accès, de rectification et de suppression des données vous concernant. 
                Pour exercer ce droit, contactez-nous à : contact@belidemag.net
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                6. Limitation de responsabilité
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Les informations contenues sur ce site sont aussi précises que possible et 
                le site est périodiquement remis à jour, mais peut toutefois contenir des 
                inexactitudes, des omissions ou des lacunes. Si vous constatez une lacune, 
                erreur ou ce qui parait être un dysfonctionnement, merci de bien vouloir 
                le signaler par email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-montserrat font-semibold text-gray-800 mb-4">
                7. Droit applicable
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Le présent site et les conditions de son utilisation sont régis par le droit haïtien. 
                Tout litige sera de la compétence exclusive des tribunaux haïtiens.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LegalNotice;
