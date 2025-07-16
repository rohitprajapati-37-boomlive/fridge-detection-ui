import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
import IFNRecipeApp from "./components/IFNRecipeApp";

function App() {
  return (
    <>
      <Navbar />
      <section className="px-4 sm:px-6 py-8 sm:py-12 max-w-6xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🍛 What's in Your Fridge?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Turn your leftover ingredients into delicious Indian recipes! Add the ingredients
            you have at home, and we'll suggest authentic Indian dishes you can cook right now.
            Reduce food waste while discovering new flavors from India's rich culinary heritage.
          </p>
        </div>
      </section>

      <main className="bg-[#fff] min-h-screen main-section">
        <IFNRecipeApp />
      </main>
    </>
  );
}

export default App;
