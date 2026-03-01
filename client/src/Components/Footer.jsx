import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-400 py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-lg text-white">PLENTICA</span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/" className="hover:text-white transition">Home</Link>
          <Link to="/about" className="hover:text-white transition">About</Link>
          <Link to="/features" className="hover:text-white transition">Features</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
        </div>

        {/* Divider & Copyright */}
        <div className="w-full border-t border-gray-800 pt-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Plentica. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
