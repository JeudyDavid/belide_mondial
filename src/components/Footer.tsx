
import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="gradient-purple text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src={'/belide-logo.png'} 
              alt='Belide Magazine'
              style={{ maxWidth: '150px',width: '100%' }}
            />
    
         
            <p className="text-purple-100 font-inter text-sm leading-relaxed">
            Bèlide Magazine est une plateforme médiatique évoluant 
            dans le secteur culturel haïtien. Notre objectif est
            d’informer, d’éduquer et de divertir.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-200 hover:text-yellow-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-yellow-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-yellow-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-purple-200 hover:text-yellow-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-inter font-semibold">Liens Rapides</h4>
            <ul className="space-y-2 text-purple-100">
              <li><a href="https://belidemag.net" className="hover:text-yellow-400 transition-colors text-sm">Accueil</a></li>
              <li><a href="https://belidemag.net/culture" className="hover:text-yellow-400 transition-colors text-sm">Culture</a></li>
              <li><a href="https://belidemag.net/societe" className="hover:text-yellow-400 transition-colors text-sm">Société</a></li>
              <li><a href="https://belidemag.net/podcasts-emissions/" className="hover:text-yellow-400 transition-colors text-sm">Podcasts</a></li>
              <li><a href="https://belidemag.net/podcasts-emissions/" className="hover:text-yellow-400 transition-colors text-sm">Émissions</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-inter font-semibold">Services</h4>
            <ul className="space-y-2 text-purple-100">

              <li><a href="https://belidemag.net/plans-promotionnels" className="hover:text-yellow-400 transition-colors text-sm">Plans Promotionnels</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-inter font-semibold">Contact</h4>
            <div className="space-y-3 text-purple-100">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">contact@belidemag.net</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">+509 37 74 9691</span>
              </div>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-purple-200 font-inter text-sm">
              © 2025 Belide Magazine. Tous droits réservés.
            </p>
            <div className="flex space-x-6 text-purple-200 text-sm">
              <a href="/legal-notice" className="hover:text-yellow-400 transition-colors">Politique de confidentialité</a>
              <a href="/privacy-policy" className="hover:text-yellow-400 transition-colors">Conditions d'utilisation</a>
              <a href="/terms-of-service" className="hover:text-yellow-400 transition-colors">Mentions légales</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
