import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, ExternalLink, Calendar } from 'lucide-react';

const FeaturedRecipes = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [currentFestival, setCurrentFestival] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [festivalsData, setFestivalsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isHovered, setIsHovered] = useState(false);
    const carouselRef = useRef(null);
    const intervalRef = useRef(null);

    // API Configuration
    const API_BASE_URL = 'https://ifn.coolify.vps.boomlive.in/festival-recipes';
    
    // Festival tag mappings for proper IFN links
    const festivalTagMappings = {
        'onam': 'onam-recipes',
        'eid-milad': 'eid-recipes', 
        'navratri': 'navratri-recipes',
        'durga-puja': 'durga-puja-recipes',
        'durga-ashtami': 'navratri-recipes',
        'ganesh-chaturthi': 'ganesh-chaturthi',
        'karwa-chauth': 'karwa-chauth-recipes',
        'diwali': 'diwali-recipes',
        'dussehra': 'dussehra-recipes',
        'janmashtami': 'janmashtami-recipes',
        'parsva-ekadashi': 'ekadashi-recipes',
        'vishwakarma-puja': 'vishwakarma-puja-recipes',
        'mahalaya': 'durga-puja-recipes'
    };

    // Get current month's date range
    const getCurrentMonthRange = () => {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        
        const startDate = new Date(currentYear, currentMonth - 1, 1);
        const endDate = new Date(currentYear, currentMonth, 0);
        
        return {
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0]
        };
    };

    // Fallback data - September 2025 festivals (with real data only)
    const getFallbackData = () => {
        return [
            {
                id: 'onam',
                name: 'Onam',
                date: '2025-09-05',
                description: 'Celebrate Kerala\'s harvest festival with traditional Onam Sadya recipes!',
                color: 'from-green-500 to-yellow-600',
                recipes: [
                    {
                        id: 1,
                        name: "Onam Payasam",
                        description: "Traditional Kerala rice pudding with jaggery and coconut milk",
                        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
                        cookTime: "45 mins",
                        difficulty: "MEDIUM",
                        type: "Sweet",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/onam-payasam",
                        author: "Kerala Kitchen",
                        tags: ["sweet", "traditional", "medium"]
                    },
                    {
                        id: 2,
                        name: "Kerala Sambar",
                        description: "Tangy lentil curry with coconut and curry leaves",
                        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
                        cookTime: "35 mins",
                        difficulty: "EASY",
                        type: "onam",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/kerala-sambar",
                        author: "Traditional Recipe",
                        tags: ["traditional", "spicy", "easy"]
                    },
                    {
                        id: 3,
                        name: "Avial",
                        description: "Mixed vegetables cooked in coconut and yogurt",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                        cookTime: null,
                        difficulty: null,
                        type: "onam",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/avial",
                        author: null,
                        tags: ["healthy", "traditional"]
                    },
                    {
                        id: 4,
                        name: "Banana Chips",
                        description: "Crispy Kerala style banana chips",
                        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
                        cookTime: "25 mins",
                        difficulty: "EASY",
                        type: "Snack",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/banana-chips",
                        author: "Snack Master",
                        tags: ["snack", "easy"]
                    },
                    {
                        id: 5,
                        name: "Coconut Barfi",
                        description: "Sweet coconut fudge perfect for Onam celebrations",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                        cookTime: null,
                        difficulty: null,
                        type: "Sweet",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/coconut-barfi",
                        author: null,
                        tags: ["sweet"]
                    }
                ]
            },
            {
                id: 'ganesh-chaturthi',
                name: 'Ganesh Chaturthi',
                date: '2025-08-29',
                description: 'Celebrate Lord Ganesha with traditional recipes!',
                color: 'from-orange-500 to-red-600',
                recipes: [
                    {
                        id: 1,
                        name: "Modak",
                        description: "Traditional steamed dumplings filled with jaggery and coconut",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                        cookTime: "45 mins",
                        difficulty: "MEDIUM",
                        type: "ganesh-chaturthi",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/modak",
                        author: "Festival Chef",
                        tags: ["sweet", "traditional", "medium"]
                    },
                    {
                        id: 2,
                        name: "Coconut Laddoo",
                        description: "Sweet coconut balls perfect for prasad",
                        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
                        cookTime: "20 mins",
                        difficulty: "EASY",
                        type: "Sweet",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/coconut-laddoo",
                        author: "Sweet Master",
                        tags: ["sweet", "easy"]
                    }
                ]
            },
            {
                id: 'navratri',
                name: 'Navratri',
                date: '2025-09-22',
                description: 'Nine nights of celebrating Goddess Durga with fasting recipes',
                color: 'from-red-500 to-pink-600',
                recipes: [
                    {
                        id: 1,
                        name: "Sabudana Vada",
                        description: "Crispy tapioca fritters perfect for Navratri fasting",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                        cookTime: "25 mins",
                        difficulty: "MEDIUM",
                        type: "navratri",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/sabudana-vada",
                        author: "Fasting Expert",
                        tags: ["fasting", "traditional", "medium"]
                    },
                    {
                        id: 2,
                        name: "Kuttu Ki Puri",
                        description: "Buckwheat flour bread for Navratri vrat",
                        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
                        cookTime: null,
                        difficulty: null,
                        type: "Fasting",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/kuttu-puri",
                        author: null,
                        tags: ["fasting"]
                    },
                    {
                        id: 3,
                        name: "Singhare Ka Halwa", 
                        description: "Water chestnut flour halwa for fasting",
                        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
                        cookTime: "30 mins",
                        difficulty: "EASY",
                        type: "Sweet",
                        videoUrl: null,
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/singhare-halwa",
                        author: "Fasting Sweets",
                        tags: ["sweet", "fasting", "easy"]
                    }
                ]
            }
        ];
    };

    // Fetch festival recipes from API
    const fetchFestivalRecipes = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const { start_date, end_date } = getCurrentMonthRange();
            
            let apiUrl = `${API_BASE_URL}?range=month`;
            let response = await fetch(apiUrl);
            
            if (!response.ok) {
                apiUrl = `${API_BASE_URL}?range=custom&start_date=${start_date}&end_date=${end_date}`;
                response = await fetch(apiUrl);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                const processedFestivals = data.results
                    .filter(festivalData => festivalData.recipes && festivalData.recipes.length > 0)
                    .map(festivalData => ({
                        id: festivalData.festival.toLowerCase().replace(/\s+/g, '-'),
                        name: festivalData.festival,
                        date: festivalData.date,
                        description: `Celebrate ${festivalData.festival} with these traditional and delicious recipes!`,
                        color: getRandomGradient(),
                        recipes: festivalData.recipes.map((recipe, index) => ({
                            id: index + 1,
                            name: recipe.heading,
                            description: recipe.description || `Traditional ${festivalData.festival} recipe`,
                            image: recipe.thumbUrl || getDefaultImage(),
                            cookTime: recipe.cookTime || null,
                            difficulty: getDifficultyFromTags(recipe.tags, true),
                            type: Math.random() > 0.5 ? festivalData.festival.toLowerCase().replace(/\s+/g, '-') : getTypeFromTags(recipe.tags),
                            videoUrl: recipe.youtube_videos?.[0]?.youtube_url || null,
                            recipeUrl: recipe.url,
                            author: (recipe.author && recipe.author !== "Chef Special") ? recipe.author : null,
                            tags: recipe.tags || []
                        }))
                    }));
                
                if (processedFestivals.length > 0) {
                    setFestivalsData(processedFestivals);
                    setCurrentFestival(processedFestivals[0]?.id || null);
                } else {
                    setFallbackData();
                }
            } else {
                setFallbackData();
            }
        } catch (error) {
            console.error('Error fetching festival recipes:', error);
            setError(error.message);
            setFallbackData();
        } finally {
            setLoading(false);
        }
    };

    // Set fallback data
    const setFallbackData = () => {
        const fallbackFestivals = getFallbackData();
        setFestivalsData(fallbackFestivals);
        setCurrentFestival(fallbackFestivals[0]?.id || null);
    };

    // Helper functions
    const getRandomGradient = () => {
        const gradients = [
            'from-blue-500 to-purple-600',
            'from-orange-500 to-red-600',
            'from-green-500 to-teal-600',
            'from-pink-500 to-rose-600',
            'from-indigo-500 to-blue-600'
        ];
        return gradients[Math.floor(Math.random() * gradients.length)];
    };

    const getDefaultImage = () => {
        return "https://images.unsplash.com/photo-1546554137-f86b9593a222?w=400&h=300&fit=crop";
    };

    const getDifficultyFromTags = (tags = [], strictMode = false) => {
        if (tags.some(tag => tag.toLowerCase().includes('easy'))) return 'EASY';
        if (tags.some(tag => tag.toLowerCase().includes('medium'))) return 'MEDIUM';
        if (tags.some(tag => tag.toLowerCase().includes('hard'))) return 'HARD';
        return strictMode ? null : 'EASY';
    };

    const getTypeFromTags = (tags = []) => {
        if (tags.some(tag => tag.toLowerCase().includes('sweet'))) return 'Sweet';
        if (tags.some(tag => tag.toLowerCase().includes('healthy'))) return 'Healthy';
        if (tags.some(tag => tag.toLowerCase().includes('spicy'))) return 'Spicy';
        if (tags.some(tag => tag.toLowerCase().includes('snack'))) return 'Snack';
        if (tags.some(tag => tag.toLowerCase().includes('fasting'))) return 'Fasting';
        return 'Traditional';
    };

    // Get tag display name
    const getTagDisplayName = (type, festivalId) => {
        if (festivalTagMappings[type]) {
            return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
        }
        return type;
    };

    // Get tag color based on type
    const getTagColor = (type) => {
        if (festivalTagMappings[type]) return 'bg-red-500';
        
        switch(type) {
            case 'Healthy': return 'bg-green-500';
            case 'Sweet': return 'bg-pink-500';
            case 'Spicy': return 'bg-red-500';
            case 'Fasting': return 'bg-purple-500';
            case 'Main Course': return 'bg-indigo-500';
            case 'Snack': return 'bg-yellow-500';
            default: return 'bg-orange-500';
        }
    };

    // Updated responsive card count - 3/2/1 cards
    const getCardsToShow = () => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };

    const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            const newCardsToShow = getCardsToShow();
            if (newCardsToShow !== cardsToShow) {
                setCardsToShow(newCardsToShow);
                setCurrentIndex(0);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [cardsToShow]);

    // Fetch data on component mount
    useEffect(() => {
        setFallbackData();
        setLoading(false);
        fetchFestivalRecipes();
    }, []);

    // Get current festival data
    const currentFestivalData = festivalsData.find(f => f.id === currentFestival) || festivalsData[0];
    const recipes = currentFestivalData?.recipes || [];

    // Handle card click
    const handleCardClick = (recipe) => {
        if (recipe.recipeUrl) {
            window.open(recipe.recipeUrl, '_blank');
        }
    };

    // Handle video click
    const handleVideoClick = (e, videoUrl) => {
        e.stopPropagation();
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        }
    };

    // Navigation functions
    const nextSlide = useCallback(() => {
        if (!isTransitioning || recipes.length === 0) return;
        setCurrentIndex(prev => {
            const nextIndex = prev + cardsToShow;
            return nextIndex >= recipes.length ? 0 : nextIndex;
        });
    }, [isTransitioning, recipes.length, cardsToShow]);

    const prevSlide = () => {
        if (!isTransitioning || recipes.length === 0) return;
        setCurrentIndex(prev => {
            const prevIndex = prev - cardsToShow;
            return prevIndex < 0 ? Math.max(0, recipes.length - cardsToShow) : prevIndex;
        });
    };

    const goToSlide = (index) => {
        if (!isTransitioning) return;
        setCurrentIndex(index * cardsToShow);
    };

    // Auto-slide functionality with hover pause
    useEffect(() => {
        if (recipes.length === 0 || isHovered || recipes.length <= cardsToShow) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
        
        intervalRef.current = setInterval(() => {
            nextSlide();
        }, 4000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [recipes.length, isHovered, nextSlide, cardsToShow]);

    // Calculate total slides for dots
    const totalSlides = Math.ceil(recipes.length / cardsToShow);
    const currentSlideIndex = Math.floor(currentIndex / cardsToShow);

    // Get festival date info
    const getFestivalDateInfo = () => {
        if (!currentFestivalData || !currentFestivalData.date) return null;
        
        const today = new Date();
        const festivalDate = new Date(currentFestivalData.date);
        const daysDiff = Math.ceil((festivalDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 0) return "Today!";
        if (daysDiff === 1) return "Tomorrow";
        if (daysDiff > 0) return `In ${daysDiff} days`;
        if (daysDiff >= -3) return "Recently celebrated";
        return null;
    };

    // Get festival tag URL
    const getFestivalTagUrl = (festivalId) => {
        const tag = festivalTagMappings[festivalId];
        return tag ? `https://www.indiafoodnetwork.in/tags/${tag}` : null;
    };

    // Loading state
    if (loading && festivalsData.length === 0) {
        return (
            <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading festival recipes...</p>
                    </div>
                </div>
            </div>
        );
    }

    // No data state
    if (!currentFestivalData || recipes.length === 0) {
        return (
            <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-600">No festival recipes available at the moment</p>
                    </div>
                </div>
            </div>
        );
    }

    const dateInfo = getFestivalDateInfo();
    const festivalTagUrl = getFestivalTagUrl(currentFestival);

    return (
        <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className={`inline-block bg-gradient-to-r ${currentFestivalData.color} text-white px-6 py-2 rounded-full text-sm font-semibold mb-4`}>
                        ✨ Featured This Month {dateInfo && `• ${dateInfo}`} ✨
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {currentFestivalData.name} Special Recipes
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                        {currentFestivalData.description}
                    </p>
                    
                    {/* Festival Date */}
                    {currentFestivalData.date && (
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Festival Date: {new Date(currentFestivalData.date).toLocaleDateString('en-IN', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </span>
                        </div>
                    )}
                    
                    {/* Festival Selector */}
                    {festivalsData.length > 1 && (
                        <div className="flex justify-center mt-6 gap-2 flex-wrap">
                            {festivalsData.map((festival) => (
                                <button
                                    key={festival.id}
                                    onClick={() => {
                                        setCurrentFestival(festival.id);
                                        setCurrentIndex(0);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                        currentFestival === festival.id
                                            ? 'bg-red-500 text-white shadow-lg'
                                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                    }`}
                                >
                                    {festival.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Show error message if API failed */}
                {error && (
                    <div className="text-center mb-4">
                        <p className="text-sm text-orange-600 bg-orange-50 px-4 py-2 rounded-lg inline-block">
                            Unable to load latest data. Showing sample festival recipes.
                        </p>
                    </div>
                )}

                {/* Carousel Container - Responsive Fixed */}
                <div className="relative">
                    {/* Navigation Arrows - Responsive Positioning */}
                    {recipes.length > cardsToShow && (
                        <>
                            {/* Desktop Navigation - Outside cards */}
                            <button
                                onClick={prevSlide}
                                className="hidden lg:flex absolute left-[-70px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-4 transition-all duration-200 hover:scale-110 border border-gray-200 items-center justify-center"
                                aria-label="Previous recipes"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="hidden lg:flex absolute right-[-70px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-4 transition-all duration-200 hover:scale-110 border border-gray-200 items-center justify-center"
                                aria-label="Next recipes"
                            >
                                <ChevronRight className="w-6 h-6 text-gray-700" />
                            </button>

                            {/* Mobile/Tablet Navigation - Inside cards */}
                            <button
                                onClick={prevSlide}
                                className="flex lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 items-center justify-center"
                                aria-label="Previous recipes"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="flex lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 items-center justify-center"
                                aria-label="Next recipes"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Cards Container - Responsive Padding */}
                    <div 
                        className="overflow-hidden px-4 lg:px-0"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <div 
                            ref={carouselRef}
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${(currentIndex * (100 / cardsToShow))}%)`
                            }}
                        >
                            {recipes.map((recipe, index) => (
                                <div
                                    key={`${currentFestival}-${recipe.id}-${index}`}
                                    className="flex-none px-2"
                                    style={{ 
                                        width: `${100 / cardsToShow}%`
                                    }}
                                    onClick={() => handleCardClick(recipe)}
                                >
                                    {/* Recipe Card - Fixed height with flexbox */}
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer group h-[480px] flex flex-col">
                                        {/* Recipe Image - Fixed height */}
                                        <div className="relative h-48 overflow-hidden bg-gray-200 flex-shrink-0">
                                            <img
                                                src={recipe.image}
                                                alt={recipe.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                                onError={(e) => {
                                                    e.target.src = getDefaultImage();
                                                }}
                                            />
                                            
                                            {/* Type Tag - Shows festival name */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTagColor(recipe.type)}`}>
                                                    {getTagDisplayName(recipe.type, currentFestival)}
                                                </span>
                                            </div>
                                            
                                            {/* Video Play Button */}
                                            {recipe.videoUrl && (
                                                <button
                                                    onClick={(e) => handleVideoClick(e, recipe.videoUrl)}
                                                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110"
                                                    title="Watch Video"
                                                >
                                                    <Play className="w-4 h-4" />
                                                </button>
                                            )}

                                            {/* Click Overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <ExternalLink className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Recipe Content - Flexible height with equal distribution */}
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
                                                {recipe.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                                                {recipe.description}
                                            </p>

                                            {/* Recipe Meta - Only show if data exists */}
                                            {(recipe.cookTime || recipe.difficulty) && (
                                                <div className="flex items-center justify-between text-xs text-gray-500 mb-4 flex-shrink-0">
                                                    <div className="flex items-center gap-1">
                                                        {recipe.cookTime && (
                                                            <>
                                                                <Clock className="w-4 h-4" />
                                                                <span>{recipe.cookTime}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    
                                                    {recipe.difficulty && (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            recipe.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                                            recipe.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                        }`}>
                                                            {recipe.difficulty}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Author - Only show if exists and not default */}
                                            {recipe.author && recipe.author !== "Chef Special" && (
                                                <div className="text-xs text-gray-500 mb-3 flex-shrink-0">
                                                    By {recipe.author}
                                                </div>
                                            )}

                                            {/* Action Button - Fixed at bottom */}
                                            <button 
                                                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 transform group-hover:scale-105 flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick(recipe);
                                                }}
                                            >
                                                View Recipe →
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    {totalSlides > 1 && (
                        <div className="flex justify-center mt-8 gap-2">
                            {Array.from({ length: totalSlides }, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                        index === currentSlideIndex
                                            ? 'bg-red-500 w-8' 
                                            : 'bg-gray-300 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* View All Button */}
                {festivalTagUrl && (
                    <div className="text-center mt-8">
                        <button 
                            onClick={() => window.open(festivalTagUrl, '_blank')}
                            className="bg-white border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                        >
                            View All {currentFestivalData.name} Recipes on IFN
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedRecipes;
