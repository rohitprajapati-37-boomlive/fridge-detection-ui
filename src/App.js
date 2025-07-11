import { useState } from "react";
import './App.css';
import Navbar from "./components/Navbar";
// import IFNRecipeApp from "./components/old-IFNRecipeApp";
import IFNRecipeApp from "./components/IFNRecipeApp";

function App() {
  return (
    <>
      <Navbar />
              <section class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1>🍛 What's in Your Fridge?</h1>
                    <p>Turn your leftover ingredients into delicious Indian recipes! Add the ingredients you have at home, and we'll suggest authentic Indian dishes you can cook right now. Reduce food waste while discovering new flavors from India's rich culinary heritage.</p>
                </div>
            </div>
        </section>

      <main className=" bg-[#fff] min-h-screen  main-section">
        <IFNRecipeApp />
      </main>
    </>
  );
}

export default App;
