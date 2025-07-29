import React from 'react';
import '../Css/Navbar.css';
import logo from '../assets/ifn-logo-vase.png';
import { ExternalLink } from 'lucide-react'; // Add this import

export default function Navbar() {
  return (
    <header className="bg-white py-5 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto   container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <a href="https://recipefinder.indiafoodnetwork.in/"><img src={logo} alt="India Food Network" className="h-[75px] w-auto" /></a>
        </div>
        
        <a 
          href="https://www.indiafoodnetwork.in/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg"
        >
          <span className="hidden sm:inline">Visit IFN Website</span>
          <span className="sm:hidden">IFN</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </nav>
    </header>
  );
}
