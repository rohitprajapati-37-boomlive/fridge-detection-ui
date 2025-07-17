import React, { useState, useEffect, useRef } from "react";
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
const ItemCard = ({
    recipe,
    index = 0,
    selectedIngredients = [],
}) => {
    const [showAllIngredients, setShowAllIngredients] = useState(false);

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

    // Ingredients
    const ingredientsRaw =
        recipe["Ingredients"] ||
        recipe.ingredients ||
        recipe.ingredient_list ||
        recipe.recipe_ingredients ||
        [];
    const normalizedIngredients = Array.isArray(ingredientsRaw)
        ? ingredientsRaw
        : typeof ingredientsRaw === "string"
            ? ingredientsRaw.split(/[,;]/).map((i) => i.trim())
            : typeof ingredientsRaw === "object"
                ? Object.values(ingredientsRaw)
                : [];

    // How many ingredients to show by default
    const defaultCount = 8;
    const showMoreCount = normalizedIngredients.length - defaultCount;

    return (
        <div className="card-rk-wth-65 bg-white shadow-xl rounded-3xl overflow-hidden mb-8 max-w-4xl mx-auto border border-gray-100 hover:shadow-2xl transition-shadow duration-300 w-full">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6 p-4 sm:p-6">
                {/* Image container - Fixed mobile size */}
                <div className="w-full md:w-48 h-48 md:h-32 flex-shrink-0">
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
                {/* Content container - Responsive text */}
                <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">
                        {recipeName}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2">
                        {story
                            ? story.replace(/<[^>]*>/g, "").trim()
                            : "Delicious Indian recipe perfect for your selected ingredients"}
                    </p>
                    {normalizedIngredients.length > 0 && (
                        <div className="mb-3">
                            <span className="text-sm font-semibold text-gray-700">
                                🥕 Ingredients:
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full ml-2">
                                {normalizedIngredients.length} items
                            </span>
                            {/* Ingredients List */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {(showAllIngredients
                                    ? normalizedIngredients
                                    : normalizedIngredients.slice(0, defaultCount)
                                ).map((ing, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs border border-red-200 cursor-default"
                                    >
                                        {ing}
                                    </span>
                                ))}
                                {!showAllIngredients && normalizedIngredients.length > defaultCount && (
                                    <button
                                        className="text-xs text-gray-500 ml-2 underline cursor-pointer bg-transparent border-none"
                                        onClick={() => setShowAllIngredients(true)}
                                    >
                                        +{showMoreCount} more
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    {recipeUrl && (
                        <a
                            href={recipeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors inline-block text-center mt-2"
                        >
                            View Full Recipe
                        </a>
                    )}
                </div>
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
            <div className="animate-pulse text-red-600">
                🎙️ Listening for ingredients...
            </div>
        </div>
    );
};

const IFNRecipeApp = () => {
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [fetchingRecipes, setFetchingRecipes] = useState(false);
    const [expandedRecipe, setExpandedRecipe] = useState(null);
    const recipeSectionRef = useRef(null);
    const [showRecipes, setShowRecipes] = useState(false);
    const [customIngredient, setCustomIngredient] = useState("");
    const [uploadedImageUrl, setUploadedImageUrl] = useState("");
    const [detectedIngredients, setDetectedIngredients] = useState([]);
    const [analyzing, setAnalyzing] = useState(false);
    const [listening, setListening] = useState(false);
    const [recipeDatabase, setRecipeDatabase] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(4); // Show 4 cards initially

    const fetchRecipes = async (ingredientsList) => {
        try {
            setFetchingRecipes(true);
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
            setFetchingRecipes(false); // YE LINE ADD KAREIN
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
        const exists = availableIngredients.find((item) => item.id === id);

        if (!exists) {
            const newIngredient = {
                id: id,
                name: ingredientName,
                emoji: "🥄", // default emoji
            };
            setAvailableIngredients((prev) => [...prev, newIngredient]);
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

    const detectItemsFromImage = async (file) => {
        setAnalyzing(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("https://ifn.coolify.vps.boomlive.in/detect_items", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("API error:", errorData.error || "Unknown error");
                setAnalyzing(false);
                return;
            }

            const data = await response.json();
            const detected = data.detected_items?.ingredients || [];

            setDetectedIngredients(detected);
            setSelectedIngredients((prev) => [...new Set([...prev, ...detected])]);
        } catch (error) {
            console.error("Network or server error:", error);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleFindRecipes = async () => {
        if (selectedIngredients.length === 0) {
            alert("Please select at least one ingredient!");
            return;
        }

        setFetchingRecipes(true); // YE LINE ADD KAREIN
        await fetchRecipes(selectedIngredients);
        setShowRecipes(true);

        // SCROLL KE LIYE YE ADD KAREIN:
        setTimeout(() => {
            recipeSectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }, 100);
    };

    const getDisplayRecipes = () => {
        const filtered = getSuggestedRecipes();
        if (filtered.length >= 4) {
            return filtered;
        }
        // Agar kam hain toh baki recipeDatabase se fill karein
        const extra = recipeDatabase.filter(r => !filtered.includes(r));
        return [...filtered, ...extra].slice(0, Math.max(4, visibleCount));
    };

    useEffect(() => {
        // Test ke liye manually ek recipe add karein
        setRecipeDatabase([
            {
                name: "Gajar Ka Paratha",
                // ...other fields...
                "Similar YouTube Videos": [
                    {
                        title: "How to make Gajar Paratha",
                        video_url: "https://youtube.com/xyz",
                        thumbnail_url: "https://img.youtube.com/vi/xyz/0.jpg"
                    }
                ]
            },
            // ...baaki recipes...
        ]);
    }, []);

    return (
        <div className="py-8 bg-gradient-to-br via-red-50">
            {/* Adjust main container padding */}
            <div className="px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="ktn-recp-ingdnt bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 mb-8">
                    {/* ...existing header code... */}

                    {/* Adjust grid container */}
                    <div className="items-center grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {/* First column */}
                        <div className="space-y-4 md:space-y-8">
                            {/* Upload section */}
                            <div className="row-bord-dec-rk p-4 sm:p-8 border border-gray-100 rounded-xl">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id="fridge-photo"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setUploadedImageUrl(URL.createObjectURL(file));
                                            detectItemsFromImage(file);
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

                            {/* Voice Input Section - Commented out for now */}
                            {/* <div className="row-bord-dec-rk p-8 border border-gray-100 rounded-xl">
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
                            </div> */}
                        </div>

                        {/* Second column */}
                        <div className="bg-white p-4 sm:p-8 border border-gray-100 rounded-xl">
                            <h3 className="font-bold text-gray-800 mb-6 text-center">
                                Choose Your Ingredients
                            </h3>

                            {/* Ingredients Grid - Fixed mobile overflow */}
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 mb-6">
                                {availableIngredients.map((ingredient) => (
                                    <div key={ingredient.id} className="relative group w-full">
                                        <button
                                            onClick={() => toggleIngredient(ingredient.id)}
                                            className={`w-full text-center p-1 sm:p-1.5 transition-all duration-200 transform hover:scale-105 ${
                                                selectedIngredients.includes(ingredient.id)
                                                    ? "bg-red-50 border-red-400 shadow-sm btn-txt-itm-rk"
                                                    : "btn-txt-itm-rk border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                            }`}
                                        >
                                            <div className="text-base sm:text-lg mb-0.5">{ingredient.emoji}</div>
                                            <div className="text-[10px] sm:text-[13px] font-medium truncate px-1">
                                                {ingredient.name}
                                            </div>
                                        </button>

                                        {/* Remove button - Adjusted positioning */}
                                        {![
                                            "rice",
                                            "chicken",
                                            "tomatoes",
                                            "onions",
                                            "potatoes",
                                            "lentils",
                                            "paneer",
                                            "spinach",
                                            "carrots",
                                            "garlic",
                                        ].includes(ingredient.id) && (
                                            <button
                                                onClick={() => {
                                                    setAvailableIngredients((prev) =>
                                                        prev.filter((item) => item.id !== ingredient.id)
                                                    );
                                                    setSelectedIngredients((prev) =>
                                                        prev.filter((id) => id !== ingredient.id)
                                                    );
                                                }}
                                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full w-4 h-4 sm:w-6 sm:h-6 text-[10px] sm:text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Selected Ingredients - Smaller font size */}
                            {selectedIngredients.length > 0 && (
                                <div className="mt-6">
                                    <h4 className="text-base font-semibold text-gray-800 mb-2">
                                        Selected Ingredients:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIngredients.map((id) => (
                                            <span
                                                key={id}
                                                className="bg-red-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md text-sm"
                                            >
                                                {getIngredientName(id)}
                                                <button
                                                    onClick={() =>
                                                        setSelectedIngredients((prev) =>
                                                            prev.filter((i) => i !== id)
                                                        )
                                                    }
                                                    className="hover:bg-red-600 rounded-full p-0.5 transition-colors"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Custom Ingredient Input - Smaller button */}
                            <div className="mt-6">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Add custom ingredient..."
                                        value={customIngredient}
                                        onChange={(e) => setCustomIngredient(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && addCustomIngredient()}
                                        className="border-2 border-gray-200 p-2 sm:p-3 flex-1 rounded-xl focus:border-red-500 focus:outline-none transition-colors text-sm"
                                    />
                                    <button
                                        onClick={addCustomIngredient}
                                        className="bg-red-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-red-600 transition-colors shadow-md text-sm whitespace-nowrap"
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Find Recipes Button - Responsive text */}
                    <div className="mt-8">
                        <button
                            onClick={handleFindRecipes}
                            disabled={selectedIngredients.length === 0 || fetchingRecipes}
                            className={`w-full p-3 sm:p-4 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base ${
                                selectedIngredients.length && !fetchingRecipes
                                    ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                                    : "bg-gray-300 cursor-not-allowed"
                            }`}
                        >
                            {fetchingRecipes ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>Finding Recipes...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Search className="w-5 h-5" />
                                    <span className="hidden sm:inline">Find Perfect Recipes for Me!</span>
                                    <span className="sm:hidden">Find Recipes</span>
                                    <span>({selectedIngredients.length})</span>
                                </div>
                            )}
                        </button>
                    </div>
                </div>

                {/* pura page loading show  */}

                {fetchingRecipes && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md mx-auto text-center shadow-2xl">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                🔍 Finding Perfect Recipes
                            </h3>
                            <p className="text-gray-600">
                                Searching through our database for recipes that match your
                                ingredients...
                            </p>
                            <div className="mt-4 flex justify-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                                <div
                                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.1s" }}
                                ></div>
                                <div
                                    className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* RECIPE RESULTS SECTION - SAME PAGE */}
                {showRecipes && (
                    <div
                        ref={recipeSectionRef}
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mt-8"
                    >
                        {/* Recipe Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className=" sm:text-2xl font-bold text-gray-800 mb-1">
                                    🍽️ Recipe Suggestions
                                </h2>
                                <p className=" sm:text-sm text-gray-600">
                                    Found {getSuggestedRecipes().length} delicious recipes
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRecipes(false)}
                                className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition-all duration-200"
                                title="Clear Results"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Recipe Cards with improved mobile view */}
                        <div className="space-y-6">
                            {getDisplayRecipes().slice(0, visibleCount).map((recipe, index) => {
                                let videos = recipe["Similar YouTube Videos"] || [];
                                if ((!videos || videos.length === 0) && recipe["YouTube Link"]) {
                                    videos = [{
                                        title: recipe["Dish Name"] || recipe.name || "Related Video",
                                        video_url: recipe["YouTube Link"],
                                        thumbnail_url: recipe["Thumbnail Image"] || ""
                                    }];
                                }
                                return (
                                    <div key={recipe.id || index} className="flex flex-col md:flex-row gap-6 w-full">
                                        <div className="flex-1 min-w-0">
                                            <ItemCard
                                                recipe={recipe}
                                                index={index}
                                                selectedIngredients={selectedIngredients}
                                            />
                                        </div>
                                        {videos.length > 0 && (
                                            <div className="flex flex-col gap-4 md:w-1/3 w-full">
                                                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                    🎥 Related Videos
                                                </h4>
                                                {videos.slice(0, 2).map((video, vidIdx) => (
                                                    <a
                                                        key={vidIdx}
                                                        href={video.video_url || video.url || video.link || video.youtube_url || ""}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="border border-gray-200 rounded-lg p-2 bg-white hover:bg-red-50 transition-colors w-full"
                                                    >
                                                        {video.thumbnail_url ? (
                                                            <img
                                                                src={video.thumbnail_url}
                                                                alt={video.title || "Video"}
                                                                className="w-full h-32 sm:h-24 object-cover rounded"
                                                            />
                                                        ) : null}
                                                        <div className="font-semibold text-xs mt-2 line-clamp-2">{video.title || "Video"}</div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* View More Button - Matching theme */}
                        {getDisplayRecipes().length > visibleCount && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setVisibleCount((prev) => prev + 4)}
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg font-semibold"
                                >
                                    View More Recipes
                                </button>
                            </div>
                        )}

                        {/* Related Videos */}
                        {/* <div className="mt-8">
                            {getSuggestedRecipes().flatMap(r => r["Similar YouTube Videos"] || []).length > 0 && (
                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2 text-2xl">
                                        🎥 Related Videos
                                    </h4>
                                    <div className="flex flex-wrap gap-4">
                                        {getSuggestedRecipes()
                                            .flatMap(r => r["Similar YouTube Videos"] || [])
                                            .slice(0, visibleCount)
                                            .map((video, idx) => (
                                                <a
                                                    key={idx}
                                                    href={video.video_url || video.url || video.link || video.youtube_url || ""}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="border border-gray-200 rounded-lg p-2 bg-white hover:bg-red-50 transition-colors w-48"
                                                >
                                                    {video.thumbnail_url || video.thumbnail ? (
                                                        <img
                                                            src={video.thumbnail_url || video.thumbnail}
                                                            alt={video.title || "Video"}
                                                            className="w-full h-24 object-cover rounded"
                                                        />
                                                    ) : null}
                                                    <div className="font-semibold text-xs mt-2 line-clamp-2">{video.title || "Video"}</div>
                                                </a>
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div> */}
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
