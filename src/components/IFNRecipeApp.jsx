import React, { useState, useEffect } from "react";
// import { Camera, X, Search, ArrowLeft, ChefHat, Clock, Users, Star } from "lucide-react";
import {
  Camera,
  X,
  Search,
  ArrowLeft,
  ChefHat,
  Clock,
  Users,
  Star,
  Share,
  ChevronUp,
} from "lucide-react";

import "../Css/FridgeScanner.css";

// ItemCard Component
const ItemCard = ({ recipe, index = 0, selectedIngredients = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllIngredients, setShowAllIngredients] = useState(false); // ADD THIS LINE
  const recipeName =
    recipe["Dish Name"] ||
    recipe.name ||
    recipe.dish_name ||
    recipe.title ||
    recipe.Name ||
    `Recipe ${index + 1}`;

  const thumbnail =
    recipe["Thumbnail Image"] ||
    recipe.thumbnail ||
    recipe.image ||
    recipe.thumbnail_url;

  const story = recipe.Story || recipe.story || "";
  const recipeUrl =
    recipe["Recipe URL"] || recipe.recipe_url || recipe.url || "";
  const videos = recipe["Similar YouTube Videos"] || recipe.videos || [];

  const ingredientsRaw =
    recipe["Ingredients"] ||
    recipe.ingredients ||
    recipe.ingredient_list ||
    recipe.recipe_ingredients ||
    [];

  const stepsRaw =
    recipe["Steps to Cook"] ||
    recipe.steps ||
    recipe.instructions?.split(/(?=\d+\.)/) ||
    [];

  // Normalize ingredients
  const normalizedIngredients = Array.isArray(ingredientsRaw)
    ? ingredientsRaw
    : typeof ingredientsRaw === "string"
    ? ingredientsRaw.split(/[,;]/).map((i) => i.trim())
    : typeof ingredientsRaw === "object"
    ? Object.values(ingredientsRaw)
    : [];

  // Normalize steps
  const normalizedSteps = Array.isArray(stepsRaw)
    ? stepsRaw
    : typeof stepsRaw === "string"
    ? stepsRaw
        .split(/(?=\d+\.)/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-8 max-w-4xl mx-auto border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
      {/* Compact Card View (when !isExpanded) */}
      {!isExpanded && (
        <div className="flex gap-6 p-6">
          {/* Left Side - Image */}
          <div className="w-48 h-32 flex-shrink-0">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={recipeName}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <ChefHat className="w-8 h-8 text-white" />
              </div>
            )}
          </div>

          {/* Right Side - Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">
              {recipeName}
            </h2>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {story
                ? story.replace(/<[^>]*>/g, "").trim()
                : "Delicious Indian recipe perfect for your selected ingredients"}
            </p>

            {/* Ingredients Preview - MOVED UP */}
            {normalizedIngredients.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    🥕 Ingredients:
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {normalizedIngredients.length} items
                  </span>
                  {normalizedIngredients.length > 4 && (
                    <button
                      onClick={() => setShowAllIngredients(!showAllIngredients)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showAllIngredients ? "Show Less ▲" : "Show All ▼"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(showAllIngredients
                    ? normalizedIngredients
                    : normalizedIngredients.slice(0, 4)
                  ).map((ingredient, idx) => {
                    const ingredientStr = String(ingredient);
                    const isSelected = selectedIngredients.some(
                      (sel) =>
                        ingredientStr
                          .toLowerCase()
                          .includes(sel.toLowerCase()) ||
                        sel.toLowerCase().includes(ingredientStr.toLowerCase())
                    );
                    return (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded-full border transition-all duration-200 ${
                          isSelected
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        {isSelected && "✓ "}
                        {ingredientStr.length > 15
                          ? ingredientStr.substring(0, 15) + "..."
                          : ingredientStr}
                      </span>
                    );
                  })}
                </div>

                {/* Smooth transition animation */}
                <style jsx>{`
                  .ingredient-container {
                    transition: all 0.3s ease-in-out;
                  }
                `}</style>
              </div>
            )}

            {/* Info Row - MOVED AFTER INGREDIENTS */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {recipe["Cook Time"] ||
                    recipe.cook_time ||
                    recipe.cooking_time ||
                    "30-45 min"}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {recipe["Servings"] ||
                    recipe.servings ||
                    recipe.serves ||
                    "4 servings"}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  {recipe["Cuisine"] ||
                    recipe.cuisine ||
                    recipe.category ||
                    "Indian Cuisine"}
                </span>
              </div>

              {/* Share Button - FIXED */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: recipeName,
                      text: `Check out this recipe: ${recipeName}`,
                      url: recipeUrl || window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(
                      `${recipeName} - ${recipeUrl || window.location.href}`
                    );
                    alert("Recipe link copied to clipboard!");
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Share className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Expand Button */}
            <button
              onClick={() => setIsExpanded(true)}
              className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors"
            >
              View Full Recipe
            </button>
          </div>
        </div>
      )}

      {/* Expanded View (when isExpanded) */}
      {isExpanded && (
        <div>
          {/* Collapse Button */}
          <div className="p-4 border-b">
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ChevronUp className="w-5 h-5" />
              Collapse Recipe
            </button>
          </div>

          {/* Header with Image */}
          {thumbnail ? (
            <div className="relative h-72 overflow-hidden">
              <img
                src={thumbnail}
                alt={recipeName}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-3xl font-bold mb-2">{recipeName}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <ChefHat className="w-4 h-4" />
                    Indian Cuisine
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    30-45 min
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />4 servings
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">{recipeName}</h2>
              <div className="flex items-center gap-4 text-sm opacity-90">
                <span className="flex items-center gap-1">
                  <ChefHat className="w-4 h-4" />
                  Indian Cuisine
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  30-45 min
                </span>
              </div>
            </div>
          )}

          <div className="p-8">
            {/* Recipe Description/Story */}
            {story && (
              <div className="mb-6 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                <h3 className="text-lg font-semibold mb-2 text-amber-800 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Recipe Story
                </h3>
                <div className="text-amber-700 text-base leading-relaxed">
                  {story.replace(/<[^>]*>/g, "").trim()}
                </div>
              </div>
            )}

            {recipe.description && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                <p className="text-blue-800 text-base leading-relaxed">
                  {recipe.description}
                </p>
              </div>
            )}

            {/* Action Button */}
            {recipeUrl && (
              <div className="mb-6 text-center">
                <a
                  href={recipeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <ChefHat className="w-5 h-5" />
                  View Full Recipe
                </a>
              </div>
            )}

            {/* Ingredients Section */}
            {normalizedIngredients.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  🥕 Ingredients
                  <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-full">
                    {normalizedIngredients.length} items
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {normalizedIngredients.map((ingredient, idx) => {
                    const ingredientStr = String(ingredient);
                    const isSelected = selectedIngredients.some(
                      (sel) =>
                        ingredientStr
                          .toLowerCase()
                          .includes(sel.toLowerCase()) ||
                        sel.toLowerCase().includes(ingredientStr.toLowerCase())
                    );
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "bg-red-50 border-red-200 text-red-800 shadow-md"
                            : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <span className="text-red-500">✓</span>
                          )}
                          <span className={isSelected ? "font-semibold" : ""}>
                            {ingredientStr}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cooking Steps */}
            {normalizedSteps.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  👨‍🍳 Cooking Steps
                  <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-full">
                    {normalizedSteps.length} steps
                  </span>
                </h3>
                <div className="space-y-4">
                  {normalizedSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="text-gray-700 leading-relaxed">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Videos */}
            {Array.isArray(videos) && videos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  🎥 Related Videos
                  <span className="text-sm font-normal bg-gray-100 px-2 py-1 rounded-full">
                    {videos.length} videos
                  </span>
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {videos.map((video, idx) => {
                    const videoUrl =
                      video.video_url ||
                      video.url ||
                      video.link ||
                      video.youtube_url ||
                      "";
                    const videoTitle = video.title || video.name || "Video";
                    const videoThumbnail =
                      video.thumbnail_url ||
                      video.thumbnail ||
                      video.image ||
                      "";
                    const videoDescription =
                      video.description || video.desc || "";

                    return (
                      <a
                        key={idx}
                        href={videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-4 items-start border-2 border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg transition-all duration-200 p-4 bg-white hover:bg-red-50"
                      >
                        {videoThumbnail && (
                          <img
                            src={videoThumbnail}
                            alt={videoTitle}
                            className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                            {videoTitle}
                          </h4>
                          {videoDescription && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {videoDescription}
                            </p>
                          )}
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-xs text-red-500">
                              ▶️ YouTube
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// VoiceInput Component (Mock)
const VoiceInput = ({ onResult }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onResult("tomatoes onions garlic");
    }, 3000);
    return () => clearTimeout(timer);
  }, [onResult]);

  return (
    <div className="text-center p-4 bg-red-50 rounded-lg">
      <div className="animate-pulse text-red-600">
        🎙️ Listening for ingredients...
      </div>
    </div>
  );
};

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

      // Create query string with ingredients
      const query = ingredientsList
        .map((ingredient) => `ingredients=${encodeURIComponent(ingredient)}`)
        .join("&");

      const response = await fetch(
        `https://ifn.coolify.vps.boomlive.in/find_recipe?${query}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🍲 Fetched Recipe Data ➤", data);

      // Handle different response structures
      if (Array.isArray(data)) {
        setRecipeDatabase(data);
      } else if (Array.isArray(data.recipes)) {
        setRecipeDatabase(data.recipes);
      } else if (data.data && Array.isArray(data.data)) {
        setRecipeDatabase(data.data);
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

  const [availableIngredients, setAvailableIngredients] = useState([
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
]);


const addToAvailableIngredients = (ingredientName) => {
  const id = ingredientName.toLowerCase().replace(/\s+/g, "-");
  const exists = availableIngredients.find(item => item.id === id);
  
  if (!exists) {
    const newIngredient = {
      id: id,
      name: ingredientName,
      emoji: "🥄" // default emoji
    };
    setAvailableIngredients(prev => [...prev, newIngredient]);
  }
};


  const toggleIngredient = (id) => {
    setSelectedIngredients((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

const addCustomIngredient = () => {
  const trimmed = customIngredient.trim();
  if (trimmed) {
    // First add to available ingredients
    addToAvailableIngredients(trimmed);
    
    // Then add to selected
    const id = trimmed.toLowerCase().replace(/\s+/g, "-");
    if (!selectedIngredients.includes(id)) {
      setSelectedIngredients((prev) => [...prev, id]);
    }
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
        "Ingredients",
        "ingredients",
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
        recipe["Dish Name"] ||
        recipe.name ||
        recipe.dish_name ||
        recipe.title ||
        recipe.Name ||
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

    await fetchRecipes(selectedIngredients);
    setShowRecipes(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br via-red-50">
      <div className="p-6 max-w-6xl mx-auto">
        {/* INGREDIENTS SELECTION SECTION */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              🥘 Your Kitchen, Your Recipes
            </h1>
            <p className="text-gray-600 text-xl">
              Tell us what you have in your kitchen, and we'll find perfect
              Indian recipes for you.
            </p>
          </div>

          {/* Photo Upload & Voice Input */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="row-bord-dec-rk  p-8 border border-gray-100">
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
              <label htmlFor="fridge-photo" className="cursor-pointer block">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-xl inline-flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4">
                    <Camera className="mr-3 w-6 h-6" />
                    Upload Fridge Photo
                  </div>
                  <p className="text-gray-500 text-sm">
                    Take a picture of your ingredients for instant recognition
                  </p>
                </div>
              </label>

              {uploadedImageUrl && (
                <div className="mt-6">
                  <img
                    src={uploadedImageUrl}
                    alt="Uploaded"
                    className="max-h-64 mx-auto rounded-xl shadow-lg"
                  />
                </div>
              )}

              {analyzing && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-xl text-center">
                  <div className="animate-pulse text-yellow-600 font-medium">
                    🔍 Analyzing your ingredients...
                  </div>
                </div>
              )}

              {detectedIngredients.length > 0 && !analyzing && (
                <div className="mt-4 p-4 bg-green-50 rounded-xl text-center">
                  <div className="text-green-600 font-medium">
                    ✅ Detected: {detectedIngredients.join(", ")}
                  </div>
                </div>
              )}
            </div>

            <div className="row-bord-dec-rk  p-8 border border-gray-100">
              <div className="text-center">
                <button
                  onClick={() => setListening(true)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl inline-flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-4"
                >
                  🎤 Speak Ingredients
                </button>
                <p className="text-gray-500 text-sm">
                  Say what's in your fridge and we'll add it automatically
                </p>
              </div>

              {listening && (
                <div className="mt-6">
                  <VoiceInput onResult={handleVoiceResult} />
                </div>
              )}
            </div>
          </div>

          {/* Ingredients Selection */}
          <div className=" bg-white p-8  mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Choose Your Ingredients
            </h3>

<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
  {availableIngredients.map((ingredient) => (
    <div key={ingredient.id} className="relative group">
      <button
        onClick={() => toggleIngredient(ingredient.id)}
        className={`w-full text-center transition-all duration-200 transform hover:scale-105 ${
          selectedIngredients.includes(ingredient.id)
            ? "bg-red-50 border-red-400 shadow-lg btn-txt-itm-rk"
            : "btn-txt-itm-rk border-gray-200 hover:border-gray-300 hover:shadow-md"
        }`}
      >
        <div className="text-3xl mb-2">{ingredient.emoji}</div>
        <div className="text-sm font-medium">{ingredient.name}</div>
      </button>
      
      {/* Remove button - only show for custom ingredients */}
      {!["rice", "chicken", "tomatoes", "onions", "potatoes", "lentils", "paneer", "spinach", "carrots", "garlic"].includes(ingredient.id) && (
        <button
          onClick={() => {
            setAvailableIngredients(prev => prev.filter(item => item.id !== ingredient.id));
            setSelectedIngredients(prev => prev.filter(id => id !== ingredient.id));
          }}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  ))}
</div>


            {selectedIngredients.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Selected Ingredients:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedIngredients.map((id) => (
                    <span
                      key={id}
                      className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
                    >
                      {getIngredientName(id)}
                      <button
                        onClick={() =>
                          setSelectedIngredients((prev) =>
                            prev.filter((i) => i !== id)
                          )
                        }
                        className="hover:bg-red-600 rounded-full p-1 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Add custom ingredient..."
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomIngredient()}
                className="border-2 border-gray-200 p-3 flex-1 rounded-xl focus:border-red-500 focus:outline-none transition-colors"
              />
              <button
                onClick={addCustomIngredient}
                className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors shadow-md"
              >
                Add
              </button>
            </div>

            <button
              onClick={handleFindRecipes}
              disabled={selectedIngredients.length === 0}
              className={`w-full p-4 text-white rounded-xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 ${
                selectedIngredients.length
                  ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              <Search className="inline mr-2 w-6 h-6" />
              Find Perfect Recipes for Me! ({selectedIngredients.length}{" "}
              ingredients)
            </button>
          </div>
        </div>
        {/* RECIPE RESULTS SECTION - SAME PAGE */}
        {showRecipes && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-gray-800 mb-2">
                  🍽️ Recipe Suggestions
                </h2>
                <p className="text-gray-600 text-lg">
                  Found {getSuggestedRecipes().length} delicious recipes for
                  your ingredients
                </p>
              </div>
              <button
                onClick={() => setShowRecipes(false)}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium bg-red-50 px-4 py-2 rounded-xl hover:bg-red-100 transition-all duration-200"
              >
                <X className="w-5 h-5" />
                Clear Results
              </button>
            </div>

            {/* Selected Ingredients Display */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-700 mb-2">
                Recipes for your ingredients:
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((id) => (
                  <span
                    key={id}
                    className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {getIngredientName(id)}
                  </span>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">
                  Loading delicious recipes...
                </p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">Error: {error}</p>
                  <button
                    onClick={() => fetchRecipes(selectedIngredients)}
                    className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Recipe Cards */}
            {!loading && !error && (
              <div className="space-y-6">
                {getSuggestedRecipes().length > 0 ? (
                  getSuggestedRecipes().map((recipe, index) => (
                    <ItemCard
                      key={recipe.id || index}
                      recipe={recipe}
                      index={index}
                      selectedIngredients={selectedIngredients}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-50 rounded-xl p-8 max-w-md mx-auto">
                      <div className="text-6xl mb-4">🔍</div>
                      <p className="text-gray-600 mb-4 text-lg">
                        No matching recipes found for your ingredients.
                      </p>
                      <div className="text-sm text-gray-500 mb-6">
                        <p>
                          Selected ingredients: {selectedIngredients.join(", ")}
                        </p>
                        <p>
                          Total recipes in database: {recipeDatabase.length}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedIngredients([])}
                        className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        Show All Recipes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STICKY SCROLL TO TOP BUTTON */}
        {showRecipes && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-all duration-200 hover:scale-110"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default IFNRecipeApp;
