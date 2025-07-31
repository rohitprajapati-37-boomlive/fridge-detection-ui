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
    const [activeMode, setActiveMode] = useState("photo"); // "photo" or "ai"
    const uploadPhotoRef = useRef(null);

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

    const [userQuery, setUserQuery] = useState("");
    const [queryRecipes, setQueryRecipes] = useState([]);
    const [queryLoading, setQueryLoading] = useState(false);
    const [queryError, setQueryError] = useState(null);

    const handleUserQuery = async () => {
        if (!userQuery.trim()) return;
        setQueryLoading(true);
        setFetchingRecipes(true); // <-- Add this
        setQueryError(null);
        setQueryRecipes([]);
        // Add input as selected ingredient
        const id = userQuery.trim().toLowerCase().replace(/\s+/g, "-");
        if (!selectedIngredients.includes(id)) {
            setSelectedIngredients(prev => [...prev, id]);
            addToAvailableIngredients(userQuery.trim());
        }
        try {
            const res = await fetch(
                `https://ifn.coolify.vps.boomlive.in/find_recipe_by_query?query=${encodeURIComponent(userQuery)}`
            );
            if (!res.ok) throw new Error("Failed to fetch recipes");
            const data = await res.json();
            let recipes = [];
            if (Array.isArray(data)) {
                recipes = data;
            } else if (Array.isArray(data.data)) {
                recipes = data.data;
            } else if (data.recipes && Array.isArray(data.recipes)) {
                recipes = data.recipes;
            }
            setRecipeDatabase(recipes);
            setShowRecipes(true);
            setTimeout(() => {
                recipeSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }, 100);
            setUserQuery(""); // <-- Input clear after submit
        } catch (err) {
            setQueryError("No recipes found or server error.");
        } finally {
            setQueryLoading(false);
            setFetchingRecipes(false); // <-- Add this
        }
    };

    const [isListening, setIsListening] = useState(false);

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice recognition not supported in this browser.");
            return;
        }
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        setIsListening(true); // Start animation
        recognition.start();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserQuery(transcript);
            setIsListening(false); // Stop animation
        };
        recognition.onerror = (event) => {
            alert("Voice recognition error: " + event.error);
            setIsListening(false); // Stop animation
        };
        recognition.onend = () => {
            setIsListening(false); // Stop animation
        };
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
                        thumbnail_url: "" // <-- Fix: use thumbnail_url, not thumbnail
                    }
                ]
            },
            // ...baaki recipes...
        ]);
    }, []);

    // Mode switch handler
    const handleModeSwitch = (mode) => {
        setActiveMode(mode);
        if (mode === "photo") {
            setUserQuery("");
            setTimeout(() => {
                uploadPhotoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        } else if (mode === "ai") {
            setUploadedImageUrl("");
            setDetectedIngredients([]);
            setAnalyzing(false);
        }
    };

    return (
        <div className="py-8 bg-gradient-to-br via-red-50">
            {/* Adjust main container padding */}
            <div className="px-4 sm:px-6 max-w-6xl mx-auto">
                <div className="ktn-recp-ingdnt bg-white rounded-2xl shadow-xl p-4 sm:p-8 border border-gray-100 mb-8">
                    {/* Header Section */}
                    <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-red-50">
                          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3">
              🍛 What's in Your Fridge?
            </h1>
            <strong className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">Got food ingredients in your kitchen? Let’s turn them into magic!
            </strong>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Just enter what you have at home, and we’ll suggest authentic Indian recipes you can cook right now. Discover new flavors, reduce food waste, and bring India’s rich culinary heritage to life, one delicious dish at a time.
            </p>
                        <div className="text-sm text-gray-500 font-medium">
                            Powered by <a href="https://www.indiafoodnetwork.in/" target="_blank" rel="noopener noreferrer"   class="text-orange-700  hover:text-green-700 "   >India Food Network</a>
                        </div>
                    </div>

                    {/* Mode Selection Cards */}
                    <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Snap & Cook Option */}
                            <div
                                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                    activeMode === "photo"
                                        ? "ring-2 ring-orange-400 bg-orange-50"
                                        : "hover:bg-gray-50"
                                } border-2 rounded-xl p-6 text-center min-h-[200px] flex flex-col justify-center ${
                                    activeMode === "photo" ? "border-orange-400" : "border-gray-200"
                                }`}
                                onClick={() => handleModeSwitch("photo")}
                                tabIndex={0}
                                role="button"
                                aria-pressed={activeMode === "photo"}
                            >
                                {activeMode === "photo" && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        ✓
                                    </div>
                                )}
                                <div className="text-4xl mb-4">📱✨</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Snap & Cook!</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Just take a photo of your fridge or pantry - our AI will instantly identify 
                                    ingredients and suggest delicious recipes!
                                </p>
                            </div>
                            {/* Chat with Chef AI Option */}
                            <div
                                className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                                    activeMode === "ai"
                                        ? "ring-2 ring-green-400 bg-green-50"
                                        : "hover:bg-gray-50"
                                } border-2 rounded-xl p-6 text-center min-h-[200px] flex flex-col justify-center ${
                                    activeMode === "ai" ? "border-green-400" : "border-gray-200"
                                }`}
                                onClick={() => handleModeSwitch("ai")}
                                tabIndex={0}
                                role="button"
                                aria-pressed={activeMode === "ai"}
                            >
                                {activeMode === "ai" && (
                                    <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                        ✓
                                    </div>
                                )}
                                <div className="text-4xl mb-4">🤖💬</div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Chat with Chef AI</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Describe what you have or what you're craving - get personalized recipe 
                                    recommendations!
                                </p>
                            </div>
                        </div>

                        {/* Dynamic Content Based on Selected Mode */}
                        {activeMode === "photo" && (
                            <div ref={uploadPhotoRef}>
                                <div className="border-2 border-dashed border-green-400 rounded-xl p-4 sm:p-8 text-center bg-gray-50 hover:bg-green-50 transition-all duration-300 mb-6 overflow-visible">
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
    <div className="flex flex-col items-center gap-3">
        <button
            type="button"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-4 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer w-full justify-center"
            onClick={() => document.getElementById('fridge-photo').click()}
        >
            <Camera className="w-5 h-5" />
            Upload Fridge Photo
        </button>
        <span className="text-gray-600 text-sm">
            or take a picture of your ingredients
        </span>
    </div>
    {/* Image Preview & Detected Ingredients */}
    {uploadedImageUrl && (
        <div className="mt-4 w-full flex flex-col items-center">
            <img
                src={uploadedImageUrl}
                alt="Uploaded ingredients"
                className="max-h-48 w-auto rounded-xl shadow-lg mx-auto object-contain"
            />
            <div className="relative w-full flex flex-col items-center">
                <div className="absolute top-2 right-2 z-10">
                    <button
                        onClick={() => {
                            setUploadedImageUrl('');
                            setDetectedIngredients([]);
                            setAnalyzing(false);
                        }}
                        className="bg-white bg-opacity-90 hover:bg-red-500 hover:text-white text-gray-600 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all duration-200"
                    >
                        ×
                    </button>
                </div>
                <div className="w-full mt-4">
                    {analyzing && (
                        <div className="bg-green-600 bg-opacity-95 text-white px-3 py-2 rounded-lg text-center animate-pulse text-sm">
                            🔍 Analyzing your ingredients...
                        </div>
                    )}
                    {!analyzing && detectedIngredients.length > 0 && (
                        <div className="bg-green-600 bg-opacity-95 text-white px-3 py-2 rounded-lg text-center text-sm max-h-40 overflow-y-auto">
                            <span className="font-bold">✓ Found:</span> {detectedIngredients.join(', ')}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )}
</div>
                            </div>
                        )}

                        {activeMode === "ai" && (
                            <div>
                                {/* User Query Section - Input, Search, Voice */}
                                <div className="bg-gray-50 rounded-xl p-6">
                                    {/* MOBILE: input upar, buttons neeche. DESKTOP: input+buttons ek row me */}
                                    <div className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
                                        <input
                                            type="text"
                                            placeholder="e.g. I have chicken, rice and tomatoes. What can I cook?"
                                            value={userQuery}
                                            onChange={(e) => setUserQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleUserQuery()}
                                            className="w-full pl-4 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none text-base"
                                            style={{ minHeight: 48 }}
                                        />
                                        {/* Desktop: buttons right of input */}
                                        <div className="hidden sm:flex gap-3">
                                            <button
                                                onClick={handleVoiceInput}
                                                className={`bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200 ${
                                                    isListening ? "animate-pulse" : ""
                                                }`}
                                                title="Voice Search"
                                                tabIndex={-1}
                                            >
                                                🎤
                                            </button>
                                            <button
                                                onClick={handleUserQuery}
                                                className="bg-green-600 hover:bg-green-700 text-white rounded-lg w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-200"
                                                title="Search"
                                                tabIndex={-1}
                                            >
                                                <Search className="w-6 h-6" />
                                            </button>
                                        </div>
                                    </div>
                                    {/* Mobile: buttons below input */}
                                    <div className="flex sm:hidden w-full gap-3 mb-2">
                                        <button
                                            onClick={handleVoiceInput}
                                            className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-12 flex items-center justify-center shadow-lg transition-all duration-200 ${
                                                isListening ? "animate-pulse" : ""
                                            }`}
                                            title="Voice Search"
                                            tabIndex={-1}
                                        >
                                            🎤
                                        </button>
                                        <button
                                            onClick={handleUserQuery}
                                            className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg h-12 flex items-center justify-center shadow-lg transition-all duration-200"
                                            title="Search"
                                            tabIndex={-1}
                                        >
                                            <Search className="w-6 h-6" />
                                        </button>
                                    </div>
                                    {/* Example Cards */}
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-3">Try these examples:</h4>
                                        <div className="space-y-2">
                                            {[
                                                'I have leftover rice and vegetables',
                                                'I want something spicy with chicken',
                                                'What curry can I make with paneer?',
                                                'I need healthy recipe with lentils'
                                            ].map((example, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => setUserQuery(example)}
                                                    className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
                                                >
                                                    <span className="text-gray-700 text-sm font-medium">
                                                        "{example}"
                                                    </span>
                                                    <span className="text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-200">
                                                        →
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Find Recipes Button - Responsive text */}
                    <div className="mt-2">
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
