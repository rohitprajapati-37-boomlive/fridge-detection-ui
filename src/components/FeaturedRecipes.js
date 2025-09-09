import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Clock, Play, ExternalLink, Calendar, Youtube } from 'lucide-react';

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

    // Enhanced description length control
    const truncateDescription = (text, maxLength = 120) => {
        if (!text) return "Delicious traditional recipe perfect for festival celebrations.";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    };

    // Function to extract YouTube video ID for thumbnails
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Get YouTube thumbnail URL
    const getYouTubeThumbnail = (videoUrl) => {
        const videoId = getYouTubeVideoId(videoUrl);
        return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
    };

    // Enhanced fallback data with mixed content
    const getFallbackData = () => {
        return [
            {
                id: 'onam',
                name: 'Onam',
                date: '2025-09-05',
                description: 'Celebrate Kerala\'s harvest festival with traditional Onam Sadya recipes! Experience authentic flavors.',
                color: 'from-green-500 to-yellow-600',
                // Mixed content array with both recipes and videos
                content: [
                    {
                        id: 1,
                        type: 'recipe',
                        name: "Onam Payasam",
                        description: "Traditional Kerala rice pudding with jaggery and coconut milk. Perfect sweet ending to your feast.",
                        image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&h=300&fit=crop",
                        cookTime: "45 mins",
                        difficulty: "MEDIUM",
                        category: "Sweet",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/onam-payasam",
                        author: "Kerala Kitchen",
                        tags: ["sweet", "traditional", "medium"]
                    },
                    {
                        id: 'v1',
                        type: 'video',
                        title: "How to make Perfect Onam Payasam - Step by Step",
                        description: "Learn the authentic Kerala style payasam recipe with detailed instructions and tips.",
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                        thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
                        duration: "8:45",
                        channelName: "Kerala Kitchen",
                        views: "125K views",
                        uploadedAt: "2 days ago"
                    },
                    {
                        id: 2,
                        type: 'recipe',
                        name: "Kerala Sambar",
                        description: "Tangy lentil curry with coconut and curry leaves. Quintessential South Indian comfort food.",
                        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
                        cookTime: "35 mins",
                        difficulty: "EASY",
                        category: "onam",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/kerala-sambar",
                        author: "Traditional Recipe",
                        tags: ["traditional", "spicy", "easy"]
                    },
                    {
                        id: 'v2',
                        type: 'video',
                        title: "Authentic Kerala Sambar Recipe",
                        description: "Traditional South Indian sambar recipe with coconut and curry leaves.",
                        videoUrl: "https://www.youtube.com/watch?v=example123",
                        thumbnail: "https://img.youtube.com/vi/example123/hqdefault.jpg",
                        duration: "12:30",
                        channelName: "Traditional Recipe",
                        views: "89K views",
                        uploadedAt: "1 week ago"
                    },
                    {
                        id: 3,
                        type: 'recipe',
                        name: "Avial",
                        description: "Mixed vegetables in coconut and yogurt. Colorful medley offering nutrition and taste.",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                        cookTime: "25 mins",
                        difficulty: "EASY",
                        category: "onam",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/avial",
                        author: "Traditional Chef",
                        tags: ["healthy", "traditional"]
                    },
                    {
                        id: 'v3',
                        type: 'video',
                        title: "Complete Onam Sadya Preparation Guide",
                        description: "Complete guide to preparing traditional Onam feast with multiple dishes.",
                        videoUrl: "https://www.youtube.com/watch?v=sadya456",
                        thumbnail: "https://img.youtube.com/vi/sadya456/hqdefault.jpg",
                        duration: "25:15",
                        channelName: "Festival Foods",
                        views: "256K views",
                        uploadedAt: "3 days ago"
                    }
                ]
            },
            {
                id: 'ganesh-chaturthi',
                name: 'Ganesh Chaturthi',
                date: '2025-08-29',
                description: 'Celebrate Lord Ganesha with traditional recipes! Prepare auspicious dishes for Bappa.',
                color: 'from-orange-500 to-red-600',
                content: [
                    {
                        id: 1,
                        type: 'recipe',
                        name: "Modak",
                        description: "Steamed dumplings with jaggery and coconut. Lord Ganesha's favorite sweet offering.",
                        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
                        cookTime: "45 mins",
                        difficulty: "MEDIUM",
                        category: "ganesh-chaturthi",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/modak",
                        author: "Festival Chef",
                        tags: ["sweet", "traditional", "medium"]
                    },
                    {
                        id: 'v1',
                        type: 'video',
                        title: "Traditional Modak Recipe for Ganesh Chaturthi",
                        description: "Step by step modak making process with traditional techniques.",
                        videoUrl: "https://www.youtube.com/watch?v=modak789",
                        thumbnail: "https://img.youtube.com/vi/modak789/hqdefault.jpg",
                        duration: "15:20",
                        channelName: "Festival Chef",
                        views: "95K views",
                        uploadedAt: "5 days ago"
                    },
                    {
                        id: 2,
                        type: 'recipe',
                        name: "Coconut Laddoo",
                        description: "Sweet coconut balls perfect for prasad. Made with fresh coconut and cardamom.",
                        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=300&fit=crop",
                        cookTime: "20 mins",
                        difficulty: "EASY",
                        category: "Sweet",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/coconut-laddoo",
                        author: "Sweet Master",
                        tags: ["sweet", "easy"]
                    },
                    {
                        id: 'v2',
                        type: 'video',
                        title: "Ganesh Chaturthi Special Sweets Collection",
                        description: "Multiple sweet recipes perfect for Ganesh Chaturthi celebration.",
                        videoUrl: "https://www.youtube.com/watch?v=ganesh456",
                        thumbnail: "https://img.youtube.com/vi/ganesh456/hqdefault.jpg",
                        duration: "18:45",
                        channelName: "Sweet Traditions",
                        views: "142K views",
                        uploadedAt: "1 week ago"
                    }
                ]
            },
            {
                id: 'navratri',
                name: 'Navratri',
                date: '2025-09-22',
                description: 'Nine nights celebrating Goddess Durga with pure fasting recipes for devotion.',
                color: 'from-red-500 to-pink-600',
                content: [
                    {
                        id: 1,
                        type: 'recipe',
                        name: "Sabudana Vada",
                        description: "Crispy tapioca fritters for Navratri fasting. Golden crunchy delight for breaking fast.",
                        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
                        cookTime: "25 mins",
                        difficulty: "MEDIUM",
                        category: "navratri",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/sabudana-vada",
                        author: "Fasting Expert",
                        tags: ["fasting", "traditional", "medium"]
                    },
                    {
                        id: 'v1',
                        type: 'video',
                        title: "Perfect Sabudana Vada for Navratri Vrat",
                        description: "Learn to make crispy sabudana vada perfect for fasting.",
                        videoUrl: "https://www.youtube.com/watch?v=sabu101",
                        thumbnail: "https://img.youtube.com/vi/sabu101/hqdefault.jpg",
                        duration: "10:45",
                        channelName: "Fasting Expert",
                        views: "78K views",
                        uploadedAt: "2 days ago"
                    },
                    {
                        id: 2,
                        type: 'recipe',
                        name: "Kuttu Ki Puri",
                        description: "Buckwheat flour bread for vrat. Soft pillowy puris perfect for fasting meals.",
                        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop",
                        cookTime: "20 mins",
                        difficulty: "EASY",
                        category: "Fasting",
                        recipeUrl: "https://www.indiafoodnetwork.in/recipes/kuttu-puri",
                        author: "Vrat Specialist",
                        tags: ["fasting"]
                    },
                    {
                        id: 'v2',
                        type: 'video',
                        title: "Complete Navratri Fasting Menu",
                        description: "All-in-one guide for Navratri vrat recipes and meal planning.",
                        videoUrl: "https://www.youtube.com/watch?v=navratri202",
                        thumbnail: "https://img.youtube.com/vi/navratri202/hqdefault.jpg",
                        duration: "22:30",
                        channelName: "Vrat Recipes",
                        views: "186K views",
                        uploadedAt: "4 days ago"
                    }
                ]
            }
        ];
    };

    // Process API data with mixed content
    const processAPIData = (data) => {
        return data.results
            .filter(festivalData => festivalData.recipes && festivalData.recipes.length > 0)
            .map(festivalData => {
                const content = [];
                
                festivalData.recipes.forEach((recipe, index) => {
                    // Add recipe
                    content.push({
                        id: `recipe-${index + 1}`,
                        type: 'recipe',
                        name: recipe.heading,
                        description: truncateDescription(recipe.description || `Traditional ${festivalData.festival} recipe with authentic flavors and time-honored cooking techniques.`),
                        image: recipe.thumbUrl || getDefaultImage(),
                        cookTime: recipe.cookTime || null,
                        difficulty: getDifficultyFromTags(recipe.tags, true),
                        category: Math.random() > 0.5 ? festivalData.festival.toLowerCase().replace(/\s+/g, '-') : getTypeFromTags(recipe.tags),
                        recipeUrl: recipe.url,
                        author: (recipe.author && recipe.author !== "Chef Special") ? recipe.author : null,
                        tags: recipe.tags || []
                    });

                    // Add videos if available
                    if (recipe.youtube_videos && recipe.youtube_videos.length > 0) {
                        recipe.youtube_videos.forEach((video, videoIndex) => {
                            content.push({
                                id: `video-${index}-${videoIndex}`,
                                type: 'video',
                                title: video.title || `${recipe.heading} - Video Tutorial`,
                                description: truncateDescription(video.description || `Watch how to make ${recipe.heading} with step-by-step video instructions.`),
                                videoUrl: video.youtube_url,
                                thumbnail: getYouTubeThumbnail(video.youtube_url) || recipe.thumbUrl,
                                duration: video.duration || null,
                                channelName: video.channel_name || null,
                                views: video.views || null,
                                uploadedAt: video.uploaded_at || null
                            });
                        });
                    }
                });

                // Shuffle content to mix recipes and videos
                const shuffledContent = content.sort(() => Math.random() - 0.5);

                return {
                    id: festivalData.festival.toLowerCase().replace(/\s+/g, '-'),
                    name: festivalData.festival,
                    date: festivalData.date,
                    description: truncateDescription(`Celebrate ${festivalData.festival} with these traditional and delicious recipes! Experience the authentic flavors and cultural richness.`, 100),
                    color: getRandomGradient(),
                    content: shuffledContent
                };
            });
    };

    // Fetch festival recipes
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
                const processedFestivals = processAPIData(data);
                
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
            // Removed console.error for clean output
            setError(error.message);
            setFallbackData();
        } finally {
            setLoading(false);
        }
    };

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

    const getTagDisplayName = (type, festivalId) => {
        if (festivalTagMappings[type]) {
            return type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' ');
        }
        return type;
    };

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

    const getCardsToShow = () => {
        if (typeof window === 'undefined') return 3;
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 1024) return 2;
        return 3;
    };

    const [cardsToShow, setCardsToShow] = useState(getCardsToShow());

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

    useEffect(() => {
        setFallbackData();
        setLoading(false);
        fetchFestivalRecipes();
    }, []);

    const currentFestivalData = festivalsData.find(f => f.id === currentFestival) || festivalsData[0];
    const content = currentFestivalData?.content || [];

    const handleCardClick = (item) => {
        if (item.type === 'recipe' && item.recipeUrl) {
            window.open(item.recipeUrl, '_blank');
        } else if (item.type === 'video' && item.videoUrl) {
            window.open(item.videoUrl, '_blank');
        }
    };

    // Navigation functions
    const nextSlide = useCallback(() => {
        if (!isTransitioning || content.length <= cardsToShow) return;
        
        setCurrentIndex(prev => {
            const nextIndex = prev + 1;
            return nextIndex >= content.length ? 0 : nextIndex;
        });
    }, [isTransitioning, content.length, cardsToShow]);

    const prevSlide = useCallback(() => {
        if (!isTransitioning || content.length <= cardsToShow) return;
        
        setCurrentIndex(prev => {
            const prevIndex = prev - 1;
            return prevIndex < 0 ? content.length - 1 : prevIndex;
        });
    }, [isTransitioning, content.length, cardsToShow]);

    const goToSlide = (index) => {
        if (!isTransitioning) return;
        setCurrentIndex(index);
    };

    // Auto-slide
    useEffect(() => {
        if (content.length <= cardsToShow || isHovered) {
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
    }, [content.length, isHovered, nextSlide, cardsToShow]);

    // Reset index when switching festivals
    useEffect(() => {
        setCurrentIndex(0);
    }, [currentFestival]);

    const totalSlides = Math.max(1, content.length - cardsToShow + 1);
    const currentSlideIndex = Math.min(currentIndex, totalSlides - 1);

    const getFestivalTagUrl = (festivalId) => {
        const tag = festivalTagMappings[festivalId];
        return tag ? `https://www.indiafoodnetwork.in/tags/${tag}` : null;
    };

    // Count recipes and videos
    const recipeCount = content.filter(item => item.type === 'recipe').length;
    const videoCount = content.filter(item => item.type === 'video').length;

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

    if (!currentFestivalData || content.length === 0) {
        return (
            <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-gray-600">No festival content available at the moment</p>
                    </div>
                </div>
            </div>
        );
    }

    const festivalTagUrl = getFestivalTagUrl(currentFestival);

    return (
        <div className="py-12 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className={`inline-block bg-gradient-to-r ${currentFestivalData.color} text-white px-6 py-2 rounded-full text-sm font-semibold mb-4`}>
                        ✨ Trending Recipes & Videos This Month ✨
                    </div>
                    {/* <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        {currentFestivalData.name} Special Collection
                    </h2> */}
                    {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
                        {currentFestivalData.description}
                    </p> */}
                    
                    {/* Content Count Display */}
                    {/* <div className="flex items-center justify-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                            <ExternalLink className="w-4 h-4" />
                            <span>{recipeCount} Recipes</span>
                        </div>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <div className="flex items-center gap-1">
                            <Youtube className="w-4 h-4 text-red-600" />
                            <span>{videoCount} Videos</span>
                        </div>
                    </div> */}
                    
                    {/* {currentFestivalData.date && (
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
                    )} */}
                    
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

 <h2 className="text-3xl md:text-4xl  text-gray-800 mb-4 mt-6">
                        {currentFestivalData.name} Special Collection
                    </h2>

                </div>

                {/* Mixed Content Carousel */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    {content.length > cardsToShow && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="hidden lg:flex absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 border border-gray-200 items-center justify-center"
                            >
                                <ChevronLeft className="w-5 h-5 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="hidden lg:flex absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 shadow-lg rounded-full p-3 transition-all duration-200 hover:scale-110 border border-gray-200 items-center justify-center"
                            >
                                <ChevronRight className="w-5 h-5 text-gray-700" />
                            </button>

                            <button
                                onClick={prevSlide}
                                className="flex lg:hidden absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 items-center justify-center"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-700" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="flex lg:hidden absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-2 transition-all duration-200 hover:scale-110 items-center justify-center"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-700" />
                            </button>
                        </>
                    )}

                    {/* Cards Container */}
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
                            {content.map((item, index) => (
                                <div
                                    key={`${currentFestival}-${item.id}-${index}`}
                                    className="flex-none px-2"
                                    style={{ 
                                        width: `${100 / cardsToShow}%`
                                    }}
                                    onClick={() => handleCardClick(item)}
                                >
                                    {item.type === 'recipe' ? (
                                        // Recipe Card
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer group h-[480px] flex flex-col">
                                            <div className="relative h-48 overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = getDefaultImage();
                                                    }}
                                                />
                                                
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTagColor(item.category)}`}>
                                                        {getTagDisplayName(item.category, currentFestival)}
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        <ExternalLink className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
                                                    {item.name}
                                                </h3>
                                                
                                                <div className="text-gray-600 text-sm mb-4 flex-grow overflow-hidden">
                                                    <p 
                                                        className="leading-5"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            maxHeight: '5rem'
                                                        }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {(item.cookTime || item.difficulty) && (
                                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 flex-shrink-0">
                                                        <div className="flex items-center gap-1">
                                                            {item.cookTime && (
                                                                <>
                                                                    <Clock className="w-4 h-4" />
                                                                    <span>{item.cookTime}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        
                                                        {item.difficulty && (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                                item.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                                                item.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                                {item.difficulty}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {item.author && item.author !== "Chef Special" && (
                                                    <div className="text-xs text-gray-500 mb-3 flex-shrink-0">
                                                        By {item.author}
                                                    </div>
                                                )}

                                                <button 
                                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 transform group-hover:scale-105 flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick(item);
                                                    }}
                                                >
                                                    View Recipe
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // YouTube Video Card
                                        <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer group h-[480px] flex flex-col">
                                            <div className="relative h-48 overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    loading="lazy"
                                                    onError={(e) => {
                                                        e.target.src = getDefaultImage();
                                                    }}
                                                />
                                                
                                                <div className="absolute top-3 left-3">
                                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        <Youtube className="w-3 h-3" />
                                                        VIDEO
                                                    </span>
                                                </div>

                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-all duration-200 transform group-hover:scale-110 shadow-xl opacity-80 group-hover:opacity-100">
                                                        <Play className="w-8 h-8" />
                                                    </div>
                                                </div>

                                                {item.duration && (
                                                    <div className="absolute bottom-3 right-3 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-xs font-medium">
                                                        {item.duration}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-4 flex flex-col flex-grow">
                                                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300 line-clamp-2 min-h-[3.5rem] flex-shrink-0">
                                                    {item.title}
                                                </h3>
                                                
                                                <div className="text-gray-600 text-sm mb-4 flex-grow overflow-hidden">
                                                    <p 
                                                        className="leading-5"
                                                        style={{
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            maxHeight: '3.75rem'
                                                        }}
                                                    >
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {(item.channelName || item.views || item.uploadedAt) && (
                                                    <div className="space-y-2 mb-4 flex-shrink-0">
                                                        {item.channelName && (
                                                            <div className="flex items-center gap-1 text-xs text-red-600">
                                                                <Youtube className="w-3 h-3" />
                                                                <span>{item.channelName}</span>
                                                            </div>
                                                        )}
                                                        
                                                        {(item.views || item.uploadedAt) && (
                                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                                <span>{item.views || ''}</span>
                                                                <span>{item.uploadedAt || ''}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                <button 
                                                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 transform group-hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick(item);
                                                    }}
                                                >
                                                    <Play className="w-4 h-4" />
                                                    Watch on YouTube
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Navigation */}
                    {content.length > cardsToShow && (
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
                                />
                            ))}
                        </div>
                    )}
                </div>

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
