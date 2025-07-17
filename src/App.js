import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import IFNRecipeApp from "./components/IFNRecipeApp";

function App() {
  return (
    <>
      <Navbar />
      
      <section className="bg-gradient-to-br from-gray-50 to-white py-[60px] pb-10">
        <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              🍛 What's in Your Fridge?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Turn your leftover ingredients into delicious Indian recipes! Add the ingredients
              you have at home, and we'll suggest authentic Indian dishes you can cook right now.
              Reduce food waste while discovering new flavors from India's rich culinary heritage.
            </p>
          </div>
        </div>
      </section>

      <main className="bg-[#fff] min-h-screen main-section">
        <IFNRecipeApp />
      </main>
    </>
  );
}

export default App;
