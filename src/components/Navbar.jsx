import React from 'react';
import '../Css/Navbar.css';
import logo from '../assets/ifn-logo-vase.png';
import { ExternalLink, Mail } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="bg-cream-50 py-5 border-b border-ink-line sticky top-0 z-50 shadow-sm">
      <nav className="max-w-6xl mx-auto   container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center gap-3">
          <a href="https://recipefinder.indiafoodnetwork.in/"><img src={logo} alt="India Food Network" className="h-[75px] w-auto" /></a>
        </div>
        
        {/* Right side links */}
        <div className="flex items-center gap-3">
          {/* Newsletter: icon only, appears before Visit IFN Website */}
          <a
            href="https://ifncooks.indiafoodnetwork.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Newsletter"
            className="p-2 rounded-full bg-spice hover:bg-spice-600 text-white shadow-sm flex items-center justify-center transition-colors duration-200"
          >
            <Mail className="w-5 h-5" />
          </a>

          <a 
            href="https://www.indiafoodnetwork.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-spice hover:text-spice-800 font-medium transition-colors duration-200 bg-butter hover:bg-butter-200 px-4 py-2 rounded-lg"
          >
            <span className="hidden sm:inline">Visit IFN Website</span>
            <span className="sm:hidden">IFN</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
     </nav>
   </header>
  );
}
