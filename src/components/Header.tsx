import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Mondial 2026', href: '/mondial', hasDropdown: false },
    { name: 'Ma Formation', href: '/formation', hasDropdown: false },
    { name: 'Où regarder ?', href: '/ou-regarder', hasDropdown: false },
    { name: 'Retour sur Belide Magazine', href: 'https://belidemag.net', hasDropdown: false },
  ];

  return (
    <header className="relative">
      <div style={{ background: 'linear-gradient(180deg, rgb(115, 2, 97) 0%, rgb(54, 4, 46) 100%)' }} className="shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/mondial">
                <img
                  src={'/belide-logo.png'}
                  alt='Belide Magazine'
                  style={{ maxWidth: '220px', width: '100%' }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {menuItems.map((item) => (
                <div key={item.name} className="relative group">
                  {item.href.startsWith('http') ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors duration-200 font-inter font-medium text-sm uppercase"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="flex items-center space-x-1 text-white hover:text-yellow-400 transition-colors duration-200 font-inter font-medium text-sm uppercase"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white hover:text-yellow-400"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div style={{ background: 'linear-gradient(180deg, rgb(115, 2, 97) 0%, rgb(54, 4, 46) 100%)' }} className="lg:hidden border-t border-white/20">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-4">
                {menuItems.map((item) =>
                  item.href.startsWith('http') ? (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-white hover:text-yellow-400 transition-colors duration-200 font-inter font-medium text-sm uppercase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block text-white hover:text-yellow-400 transition-colors duration-200 font-inter font-medium text-sm uppercase"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
