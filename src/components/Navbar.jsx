import React from 'react';
import '../Css/Navbar.css';
import logo from '../assets/ifn-logo-vase.png';  // Import image

export default function Navbar() {
  return (
       <header className="bg-white py-5 border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <nav className="container mx-auto flex justify-center items-center">
          <div className="flex items-center gap-3">
             <img src={logo} alt="India Food Network"  className="h-[75px] w-auto" />
          </div>
        </nav>
      </header>
  );
}
