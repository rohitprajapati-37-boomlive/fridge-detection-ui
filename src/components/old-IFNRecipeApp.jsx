import React, { useState, useEffect } from "react";
import { Camera, X, Search } from "lucide-react";
import "../Css/Navbar.css";
import "../Css/FridgeScanner.css";
import VoiceInput from "./VoiceInput";

const IFNRecipeApp = () => {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [customIngredient, setCustomIngredient] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [detectedIngredients, setDetectedIngredients] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [listening, setListening] = useState(false);
  const [recipeDatabase, setRecipeDatabase] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async (ingredientsList) => {
    try {
      setLoading(true);
      setError(null);

      const query = ingredientsList
        .map((ingredient) => `ingredients=${encodeURIComponent(ingredient)}`)
        .join("&");
      const response = await fetch(
        `https://p0wkg088og0wgc4044wccswc.vps.boomlive.in/find_recipe?${query}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🍲 Fetched Recipe Data ➤", data);

      if (Array.isArray(data)) {
        setRecipeDatabase(data);
      } else if (Array.isArray(data.recipes)) {
        setRecipeDatabase(data.recipes);
      } else {
        console.error("❌ Unexpected API response structure", data);
        setRecipeDatabase([]);
      }
    } catch (error) {
      console.error("⚠️ Failed to fetch recipes:", error);
      setError(error.message);
      setRecipeDatabase([]);
    } finally {
      setLoading(false);
    }
  };

  const availableIngredients = [
    { id: "rice", name: "Rice", emoji: "🍚" },
    { id: "chicken", name: "Chicken", emoji: "🍗" },
    { id: "tomatoes", name: "Tomatoes", emoji: "🍅" },
    { id: "onions", name: "Onions", emoji: "🧅" },
    { id: "potatoes", name: "Potatoes", emoji: "🥔" },
    { id: "lentils", name: "Lentils", emoji: "🫘" },
    { id: "paneer", name: "Paneer", emoji: "🧀" },
    { id: "spinach", name: "Spinach", emoji: "🥬" },
    { id: "carrots", name: "Carrots", emoji: "🥕" },
    { id: "garlic", name: "Garlic", emoji: "🧄" },
  ];

  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const addCustomIngredient = () => {
    const id = customIngredient.trim().toLowerCase().replace(/\s+/g, "-");
    if (id && !selectedIngredients.includes(id)) {
      setSelectedIngredients((prev) => [...prev, id]);
    }
    setCustomIngredient("");
  };

  const handleVoiceResult = (transcript) => {
    if (transcript) {
      setCustomIngredient(transcript);
      setListening(false);
    }
  };

  const getSuggestedRecipes = () => {
    console.log("🔍 Selected ingredients:", selectedIngredients);
    console.log("🔍 Recipe database:", recipeDatabase);

    if (!recipeDatabase || recipeDatabase.length === 0) {
      console.log("❌ No recipes in database");
      return [];
    }

    // If no ingredients selected, return all recipes
    if (selectedIngredients.length === 0) {
      console.log("📝 No ingredients selected, returning all recipes");
      return recipeDatabase;
    }

    const filtered = recipeDatabase.filter((recipe, index) => {
      // Handle different possible ingredient formats
      let recipeIngredients = [];

      // Try different possible field names for ingredients
      const possibleIngredientFields = [
        "ingredients",
        "Ingredients",
        "ingredient_list",
        "recipe_ingredients",
      ];

      let ingredientData = null;
      for (const field of possibleIngredientFields) {
        if (recipe[field]) {
          ingredientData = recipe[field];
          break;
        }
      }

      if (Array.isArray(ingredientData)) {
        recipeIngredients = ingredientData;
      } else if (typeof ingredientData === "string") {
        // Split string ingredients by comma or semicolon
        recipeIngredients = ingredientData
          .split(/[,;]/)
          .map((ing) => ing.trim());
      } else if (ingredientData && typeof ingredientData === "object") {
        recipeIngredients = Object.values(ingredientData);
      }

      // Get recipe name safely
      const recipeName =
        recipe.name ||
        recipe.Name ||
        recipe.dish_name ||
        recipe.title ||
        `Recipe ${index + 1}`;

      console.log(`🔍 Recipe "${recipeName}" ingredients:`, recipeIngredients);

      // More flexible matching
      const matchCount = selectedIngredients.filter((selIng) =>
        recipeIngredients.some((recipeIng) => {
          const recipeIngStr = String(recipeIng).toLowerCase();
          const selIngStr = String(selIng).toLowerCase();
          const match =
            recipeIngStr.includes(selIngStr) ||
            selIngStr.includes(recipeIngStr);
          if (match) {
            console.log(`✅ Match found: "${selIng}" matches "${recipeIng}"`);
          }
          return match;
        })
      ).length;

      console.log(`🔍 Recipe "${recipeName}" match count: ${matchCount}`);
      return matchCount >= 1;
    });

    console.log("🎯 Filtered recipes:", filtered);
    return filtered;
  };

  const getIngredientName = (id) => {
    const found = availableIngredients.find((i) => i.id === id);
    return found ? found.name : id.charAt(0).toUpperCase() + id.slice(1);
  };

  const simulateImageDetection = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const options = [
        "tomatoes",
        "onions",
        "potatoes",
        "carrots",
        "rice",
        "lentils",
      ];
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

  const handleFindRecipes = async () => {
    if (selectedIngredients.length === 0) {
      alert("Please select at least one ingredient!");
      return;
    }

    console.log("🔍 Finding recipes for:", selectedIngredients);
    await fetchRecipes(selectedIngredients);
    setShowRecipes(true);
  };

  if (showRecipes) {
    const recipes = getSuggestedRecipes();
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => setShowRecipes(false)}
          className="mb-4 text-red-500 hover:text-red-700 font-medium"
        >
          ← Back to Ingredients
        </button>

        <h2 className="text-2xl font-bold mb-4">
          Recipe Suggestions ({recipes.length} found)
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading recipes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-2">Error: {error}</p>
            <button
              onClick={() => fetchRecipes(selectedIngredients)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        ) : recipes.length > 0 ? (
          <div className="space-y-6">
            {recipes.map((recipe, index) => {
              // Handle different ingredient formats
              let ingredientsList = [];

              // Try different possible field names for ingredients
              const possibleIngredientFields = [
                "ingredients",
                "Ingredients",
                "ingredient_list",
                "recipe_ingredients",
              ];

              let ingredientData = null;
              for (const field of possibleIngredientFields) {
                if (recipe[field]) {
                  ingredientData = recipe[field];
                  break;
                }
              }

              if (Array.isArray(ingredientData)) {
                ingredientsList = ingredientData;
              } else if (typeof ingredientData === "string") {
                ingredientsList = ingredientData
                  .split(/[,;]/)
                  .map((ing) => ing.trim());
              } else if (ingredientData && typeof ingredientData === "object") {
                ingredientsList = Object.values(ingredientData);
              }

              // Get recipe name safely
              // const recipeName = recipe.name || recipe.Name || recipe.dish_name || recipe.title || `Recipe ${index + 1}`;

              const dish = recipe;
              const recipeName =
                dish["Dish Name"] ||
                dish.name ||
                dish.dish_name ||
                dish.title ||
                dish.Name ||
                `Recipe ${index + 1}`;

              return (
                <div
                  key={recipe.id || index}
                  className="border border-gray-200 rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold mb-2">{recipeName}</h3>
                  {recipe.description && (
                    <p className="text-gray-600 mb-3">{recipe.description}</p>
                  )}

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Ingredients:</h4>
                    <div className="flex flex-wrap gap-2">
                      {ingredientsList.map((ingredient, idx) => {
                        const ingredientStr = String(ingredient);
                        const isSelected = selectedIngredients.some(
                          (sel) =>
                            ingredientStr
                              .toLowerCase()
                              .includes(sel.toLowerCase()) ||
                            sel
                              .toLowerCase()
                              .includes(ingredientStr.toLowerCase())
                        );
                        return (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm ${
                              isSelected
                                ? "bg-red-100 text-red-800 font-semibold"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {ingredientStr}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {recipe.instructions && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Instructions:</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {recipe.instructions}
                      </p>
                    </div>
                  )}

                  {recipe.recipe_url && (
                    <div className="mt-4">
                      <a
                        href={recipe.recipe_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        View Full Recipe →
                      </a>
                    </div>
                  )}

                  {/* Debug info */}
                  <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
                    <p>
                      Debug: Recipe object keys:{" "}
                      {Object.keys(recipe).join(", ")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              No matching recipes found for your ingredients.
            </p>
            <div className="text-sm text-gray-500 mb-4">
              <p>Selected ingredients: {selectedIngredients.join(", ")}</p>
              <p>Total recipes in database: {recipeDatabase.length}</p>
            </div>
            <button
              onClick={() => {
                console.log(
                  "🔍 DEBUG - Selected ingredients:",
                  selectedIngredients
                );
                console.log("🔍 DEBUG - Recipe database:", recipeDatabase);
                console.log(
                  "🔍 DEBUG - Filtered recipes:",
                  getSuggestedRecipes()
                );
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
            >
              Debug: Log Data to Console
            </button>
            <br />
            <button
              onClick={() => {
                // Show all recipes regardless of ingredients
                console.log("🔍 Showing all recipes");
                setSelectedIngredients([]);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Show All Recipes
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="ingredient-panel mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          🥘 Your Available Ingredients
        </h1>
        <p className="text-gray-500 mt-2 text-sm mb-4">
          Tell us what you have in your kitchen, and we'll find perfect Indian
          recipes for you.
        </p>

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
            <label
              htmlFor="fridge-photo"
              className="cursor-pointer inline-block"
            >
              <div className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center justify-center mx-auto">
                <Camera className="mr-2" size={18} /> Upload Fridge Photo
              </div>
            </label>
            <p className="text-gray-500 mt-2 text-sm">
              or take a picture of your ingredients
            </p>
            {uploadedImageUrl && (
              <img
                src={uploadedImageUrl}
                alt="Uploaded"
                className="mt-4 max-h-48 mx-auto rounded"
              />
            )}
            {analyzing && (
              <p className="mt-2 text-yellow-600 animate-pulse">
                🔍 Analyzing your ingredients...
              </p>
            )}
            {detectedIngredients.length > 0 && !analyzing && (
              <p className="mt-2 text-green-600">
                ✅ Detected: {detectedIngredients.join(", ")}
              </p>
            )}
          </div>

          <div className="w-full md:w-1/2 border border-dashed border-gray-300 p-6 rounded-lg text-center">
            <button
              onClick={() => setListening(true)}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded inline-flex items-center justify-center"
            >
              🎤 Speak Ingredients
            </button>
            <p className="text-gray-500 mt-2 text-sm">
              or say what's in your fridge
            </p>
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
              className={`p-3 rounded border text-center transition ${
                selectedIngredients.includes(ingredient.id)
                  ? "bg-red-100 border-red-400"
                  : "border-gray-200 hover:border-gray-300"
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
                className="ml-2 hover:bg-red-600 rounded-full p-1"
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
            onKeyDown={(e) => e.key === "Enter" && addCustomIngredient()}
            className="border p-2 flex-1 rounded focus:border-red-500 focus:outline-none"
          />
          <button
            onClick={addCustomIngredient}
            className="bg-red-500 text-white px-4 rounded hover:bg-red-600"
          >
            Add
          </button>
        </div>

        <button
          onClick={handleFindRecipes}
          disabled={selectedIngredients.length === 0}
          className={`w-full p-4 text-white rounded transition ${
            selectedIngredients.length
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          <Search className="inline mr-2" />
          Find Perfect Recipes for Me! ({selectedIngredients.length}{" "}
          ingredients)
        </button>
      </div>
    </div>
  );
};

export default IFNRecipeApp;
