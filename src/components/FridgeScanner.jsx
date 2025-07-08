import React, { useState, useEffect } from 'react';
import { Camera, X, Search } from 'lucide-react';
import '../Css/Navbar.css';
import '../Css/FridgeScanner.css';
import VoiceInput from './VoiceInput';

const IFNRecipeApp = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [customIngredient, setCustomIngredient] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [listening, setListening] = useState(false);
  const [recipeDatabase, setRecipeDatabase] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipes = async (ingredientsList) => {

    try {
      // Format the query: ?ingredients=tomato&ingredients=onion
      const query = ingredientsList.map(ingredient => `ingredients=${encodeURIComponent(ingredient)}`).join('&');

      console.log(query)
      const response = await fetch(`https://p0wkg088og0wgc4044wccswc.178.16.139.168.sslip.io/find_recipe?${query}`);
      const data = await response.json();
      console.log(response)
      console.log("🍲 Fetched Recipe Data ➤", data);

      if (Array.isArray(data.recipes)) {
        setRecipeDatabase(data.recipes);
      } else {
        console.error("❌ No 'recipes' array in API response");
        setRecipeDatabase([]);
      }
    } catch (error) {
      console.error("⚠️ Failed to fetch recipes:", error);
      setRecipeDatabase([]);
    } finally {
      setLoading(false);
    }
  };


  const availableIngredients = [
    { id: 'rice', name: 'Rice', emoji: '🍚' },
    { id: 'chicken', name: 'Chicken', emoji: '🍗' },
    { id: 'tomatoes', name: 'Tomatoes', emoji: '🍅' },
    { id: 'onions', name: 'Onions', emoji: '🧅' },
    { id: 'potatoes', name: 'Potatoes', emoji: '🥔' },
    { id: 'lentils', name: 'Lentils', emoji: '🫘' },
    { id: 'paneer', name: 'Paneer', emoji: '🧀' },
    { id: 'spinach', name: 'Spinach', emoji: '🥬' },
    { id: 'carrots', name: 'Carrots', emoji: '🥕' },
    { id: 'garlic', name: 'Garlic', emoji: '🧄' },
  ];

  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addCustomIngredient = () => {
    const id = customIngredient.trim().toLowerCase().replace(/\s+/g, '-');
    if (id && !selectedIngredients.includes(id)) {
      setSelectedIngredients((prev) => [...prev, id]);
    }
    setCustomIngredient('');
  };

  const handleVoiceResult = (transcript) => {
    if (transcript) {
      setCustomIngredient(transcript);
      setListening(false);
    }
  };

  const getSuggestedRecipes = () => {
    return recipeDatabase
      .filter((recipe) => {
        const matchCount = recipe.ingredients.filter((i) => selectedIngredients.includes(i)).length;
        return matchCount >= 2;
      })
      .sort((a, b) => {
        const aMatch = a.ingredients.filter((i) => selectedIngredients.includes(i)).length;
        const bMatch = b.ingredients.filter((i) => selectedIngredients.includes(i)).length;
        return bMatch - aMatch;
      });
  };

  const getIngredientName = (id) => {
    const found = availableIngredients.find((i) => i.id === id);
    return found ? found.name : id;
  };

  const simulateImageDetection = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const options = ['tomatoes', 'onions', 'potatoes', 'carrots', 'rice', 'lentils'];
      const count = Math.floor(Math.random() * 3) + 3;
      const detected = [];
      while (detected.length < count) {
        const item = options[Math.floor(Math.random() * options.length)];
        if (!detected.includes(item)) {
          detected.push(item);
        }
      }
      setDetectedIngredients(detected);
      setSelectedIngredients((prev) => [...new Set([...prev, ...detected])]);
      setAnalyzing(false);
    }, 2000);
  };

  if (showRecipes) {
    const recipes = getSuggestedRecipes();
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button onClick={() => setShowRecipes(false)} className="mb-4 text-red-500">← Back</button>
        {loading ? (
          <p>Loading recipes...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : recipes.length > 0 ? (
          recipes.map((r) => (
            <div key={r.id} className="mb-6 p-4 border rounded">
              <h2 className="text-xl font-bold">{r.name}</h2>
              <p className="text-sm text-gray-600">{r.description}</p>
              <p className="mt-2">
                Ingredients:{' '}
                {r.ingredients.map((ing, index) => (
                  <span
                    key={ing}
                    className={selectedIngredients.includes(ing) ? 'font-semibold text-red-600' : ''}
                  >
                    {getIngredientName(ing)}{index < r.ingredients.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </div>
          ))
        ) : (
          <p>No matching recipes found.</p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="ingredient-panel mx-auto">
        <h1 className="text-3xl font-bold mb-4">🥘 Your Available Ingredients</h1>
        <p className="text-gray-500 mt-2 text-sm mb-4">Tell us what you have in your kitchen, and we'll find perfect Indian recipes for you.</p>

        <div className="flex flex-col md:flex-row gap-10 mb-12 items-stretch">
          <div className="w-full md:w-1/2 border border-dashed border-gray-300 p-6 rounded-lg text-center">
            <input
              type="file"
              accept="image/*"
              id="fridge-photo"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setUploadedImageUrl(URL.createObjectURL(file));
                  simulateImageDetection();
                }
              }}
            />
            <label htmlFor="fridge-photo" className="cursor-pointer inline-block">
              <div className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center justify-center mx-auto">
                <Camera className="mr-2" size={18} /> Upload Fridge Photo
              </div>
            </label>
            <p className="text-gray-500 mt-2 text-sm">or take a picture of your ingredients</p>
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="mt-4 max-h-48 mx-auto rounded"
              />
            )}
            {analyzing && <p className="mt-2 text-yellow-600 animate-pulse">🔍 Analyzing your ingredients...</p>}
            {detectedIngredients.length > 0 && !analyzing && (
              <p className="mt-2 text-green-600">✅ Detected: {detectedIngredients.join(', ')}</p>
            )}
          </div>

          <div className="w-full md:w-1/2 border border-dashed border-gray-300 p-6 rounded-lg text-center">
            <button
              onClick={() => setListening(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center justify-center"
            >
              🎤 Speak Ingredients
            </button>
            <p className="text-gray-500 mt-2 text-sm">or say what's in your fridge</p>
          </div>
        </div>

        {listening && (
          <>
            <p className="text-red-600 mb-2 animate-pulse">🎙️ Listening...</p>
            <VoiceInput onResult={handleVoiceResult} />
          </>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {availableIngredients.map((ingredient) => (
            <button
              key={ingredient.id}
              onClick={() => toggleIngredient(ingredient.id)}
              className={`p-3 rounded border text-center transition ${selectedIngredients.includes(ingredient.id)
                  ? 'bg-red-100 border-red-400'
                  : 'border-gray-200'
                }`}
            >
              <div className="text-2xl">{ingredient.emoji}</div>
              <div className="text-sm">{ingredient.name}</div>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {selectedIngredients.map((id) => (
            <span
              key={id}
              className="bg-red-500 text-white px-4 py-1 rounded-full flex items-center"
            >
              {getIngredientName(id)}
              <button
                onClick={() =>
                  setSelectedIngredients((prev) => prev.filter((i) => i !== id))
                }
                className="ml-2"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter custom ingredient"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
            className="border p-2 flex-1 rounded"
          />
          <button onClick={addCustomIngredient} className="bg-red-500 text-white px-4 rounded">
            Add
          </button>
        </div>

        <button
          onClick={() => {
            fetchRecipes(selectedIngredients);
            setShowRecipes(true);
          }}
          disabled={selectedIngredients.length === 0}
          className={`w-full p-4 text-white rounded ${selectedIngredients.length ? 'bg-red-600' : 'bg-gray-300 cursor-not-allowed'
            }`}
        >
          <Search className="inline mr-2" /> Find Perfect Recipes for Me!
        </button>

      </div>
    </div>
  );
};

export default IFNRecipeApp;
