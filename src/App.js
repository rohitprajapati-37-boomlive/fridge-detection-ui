import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import IFNRecipeApp from "./components/IFNRecipeApp";
import Faq from './components/Faq';

function App() {
  return (
    <>
      <Navbar />

      {/* <section className="bg-gradient-to-br from-gray-50 to-white py-6">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              🍛 What's in Your Fridge?
            </h1>
            <strong className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Got food ingredients in your kitchen? Let’s turn them into magic!
            </strong>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Just enter what you have at home, and we’ll suggest authentic Indian recipes you can cook right now. Discover new flavors, reduce food waste, and bring India’s rich culinary heritage to life, one delicious dish at a time.
            </p>
          </div>
        </div>
      </section> */}

      <div className="bg-white">
        <IFNRecipeApp />
        <Faq />
      </div>
    </>
  );
}

export default App;
