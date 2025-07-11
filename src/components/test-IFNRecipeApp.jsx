import React, { useState, useEffect } from "react";
import { Camera, X, Search, ArrowLeft, ChefHat, Clock, Users, Star } from "lucide-react";

// ItemCard Component
const ItemCard = ({ recipe, index = 0, selectedIngredients = [] }) => {
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
    ? stepsRaw.split(/(?=\d+\.)/).map((s) => s.trim()).filter(s => s.length > 0)
    : [];

  return (
    <div className="bg-white shadow-xl rounded-3xl overflow-hidden mb-8 max-w-4xl mx-auto border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
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
                <Users className="w-4 h-4" />
                4 servings
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
            <div
              className="text-amber-700 text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: story }}
            />
          </div>
        )}

        {recipe.description && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-blue-800 text-base leading-relaxed">{recipe.description}</p>
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
                    ingredientStr.toLowerCase().includes(sel.toLowerCase()) ||
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
                      {isSelected && <span className="text-red-500">✓</span>}
                      <span className={isSelected ? "font-semibold" : ""}>{ingredientStr}</span>
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
                <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div className="text-gray-700 leading-relaxed">{step}</div>
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
              {videos.map((video, idx) => (
                <a
                  key={idx}
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 items-start border-2 border-gray-200 rounded-xl hover:border-red-300 hover:shadow-lg transition-all duration-200 p-4 bg-white hover:bg-red-50"
                >
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-32 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-2">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
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
      <div className="animate-pulse text-red-600">🎙️ Listening for ingredients...</div>
    </div>
  );
};

// Main App Component
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

      // Mock API response for demo
      const mockRecipes = [
        {
          "Dish Name": "Butter Chicken",
          "Thumbnail Image": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
          "Story": "A rich and creamy North Indian curry that's perfect for special occasions. This dish originated in Delhi and has become one of the most beloved Indian dishes worldwide.",
          "Ingredients": ["chicken", "tomatoes", "onions", "garlic", "ginger", "cream", "butter", "garam masala", "red chili powder", "turmeric"],
          "Steps to Cook": [
            "Marinate chicken pieces in yogurt and spices for 30 minutes",
            "Heat butter in a pan and cook marinated chicken until golden brown",
            "In the same pan, sauté onions until golden, then add garlic and ginger",
            "Add tomatoes and cook until they break down into a sauce",
            "Add spices and cook for 2-3 minutes until fragrant",
            "Add cream and cooked chicken, simmer for 10 minutes",
            "Garnish with fresh coriander and serve hot with naan or rice"
          ],
          "Recipe URL": "https://example.com/butter-chicken",
          "Similar YouTube Videos": [
            {
              "title": "Authentic Butter Chicken Recipe",
              "video_url": "https://youtube.com/watch?v=example1",
              "thumbnail_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200",
              "description": "Learn to make restaurant-style butter chicken at home"
            },
            {
              "title": "Quick Butter Chicken in 30 Minutes",
              "video_url": "https://youtube.com/watch?v=example2",
              "thumbnail_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200",
              "description": "Perfect weeknight dinner recipe"
            }
          ]
        },
        {
          "Dish Name": "Vegetable Biryani",
          "Thumbnail Image": "https://images.unsplash.com/photo-1563379091339-03246963d071?w=400",
          "Story": "A fragrant and flavorful rice dish layered with aromatic spices and fresh vegetables. This vegetarian delight is perfect for festive occasions.",
          "Ingredients": ["basmati rice", "potatoes", "carrots", "onions", "garlic", "ginger", "mint leaves", "saffron", "ghee", "biryani masala"],
          "Steps to Cook": [
            "Soak basmati rice for 30 minutes, then drain",
            "Heat ghee in a heavy-bottomed pot and fry onions until golden",
            "Add vegetables and cook until tender",
            "Layer rice over vegetables, sprinkle with mint and saffron",
            "Cover and cook on high heat for 2 minutes, then reduce to low",
            "Cook for 45 minutes without opening the lid",
            "Serve hot with raita and pickle"
          ],
          "Recipe URL": "https://example.com/veg-biryani",
          "Similar YouTube Videos": [
            {
              "title": "Perfect Vegetable Biryani",
              "video_url": "https://youtube.com/watch?v=example3",
              "thumbnail_url": "https://images.unsplash.com/photo-1563379091339-03246963d071?w=200",
              "description": "Step by step biryani making guide"
            }
          ]
        }
      ];

      setRecipeDatabase(mockRecipes);
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
    if (!recipeDatabase || recipeDatabase.length === 0) {
      return [];
    }

    if (selectedIngredients.length === 0) {
      return recipeDatabase;
    }

    const filtered = recipeDatabase.filter((recipe) => {
      const recipeIngredients = recipe.Ingredients || recipe.ingredients || [];
      const matchCount = selectedIngredients.filter((selIng) =>
        recipeIngredients.some((recipeIng) => {
          const recipeIngStr = String(recipeIng).toLowerCase();
          const selIngStr = String(selIng).toLowerCase();
          return recipeIngStr.includes(selIngStr) || selIngStr.includes(recipeIngStr);
        })
      ).length;
      return matchCount >= 1;
    });

    return filtered;
  };

  const getIngredientName = (id) => {
    const found = availableIngredients.find((i) => i.id === id);
    return found ? found.name : id.charAt(0).toUpperCase() + id.slice(1);
  };

  const simulateImageDetection = () => {
    setAnalyzing(true);
    setTimeout(() => {
      const options = ["tomatoes", "onions", "potatoes", "carrots", "rice", "lentils"];
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

  if (showRecipes) {
    const recipes = getSuggestedRecipes();
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="p-6 max-w-6xl mx-auto">
          <button
            onClick={() => setShowRecipes(false)}
            className="mb-6 inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium bg-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Ingredients
          </button>

          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              🍽️ Recipe Suggestions
            </h2>
            <p className="text-gray-600 text-lg">
              Found {recipes.length} delicious recipes for your ingredients
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading delicious recipes...</p>
            </div>
          ) : error ? (
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
          ) : recipes.length > 0 ? (
            <div className="space-y-8">
              {recipes.map((recipe, index) => (
                <ItemCard
                  key={recipe.id || index}
                  recipe={recipe}
                  index={index}
                  selectedIngredients={selectedIngredients}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-600 mb-4 text-lg">
                  No matching recipes found for your ingredients.
                </p>
                <div className="text-sm text-gray-500 mb-6">
                  <p>Selected ingredients: {selectedIngredients.join(", ")}</p>
                  <p>Total recipes in database: {recipeDatabase.length}</p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🥘 Your Kitchen, Your Recipes
          </h1>
          <p className="text-gray-600 text-xl">
            Tell us what you have in your kitchen, and we'll find perfect Indian recipes for you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Choose Your Ingredients
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {availableIngredients.map((ingredient) => (
              <button
                key={ingredient.id}
                onClick={() => toggleIngredient(ingredient.id)}
                className={`p-4 rounded-xl border-2 text-center transition-all duration-200 transform hover:scale-105 ${
                  selectedIngredients.includes(ingredient.id)
                    ? "bg-red-50 border-red-400 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                }`}
              >
                <div className="text-3xl mb-2">{ingredient.emoji}</div>
                <div className="text-sm font-medium">{ingredient.name}</div>
              </button>
            ))}
          </div>

          {selectedIngredients.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Selected Ingredients:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((id) => (
                  <span
                    key={id}
                    className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-md"
                  >
                    {getIngredientName(id)}
                    <button
                      onClick={() =>
                        setSelectedIngredients((prev) => prev.filter((i) => i !== id))
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
            Find Perfect Recipes for Me! ({selectedIngredients.length} ingredients)
          </button>
        </div>
      </div>
    </div>
  );
};

export default IFNRecipeApp;