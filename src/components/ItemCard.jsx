import React from "react";

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
    ? stepsRaw.split(/(?=\d+\.)/).map((s) => s.trim())
    : [];

  return (
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden mb-8 max-w-4xl mx-auto border border-gray-200">
      {thumbnail && (
        <div className="relative">
          <img
            src={thumbnail}
            alt={recipeName}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4 w-full text-xl font-semibold">
            {recipeName}
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Description / Story */}
        {story && (
          <div
            className="text-gray-700 text-base mb-4"
            dangerouslySetInnerHTML={{ __html: story }}
          />
        )}
        {recipe.description && (
          <p className="text-gray-600 mb-3">{recipe.description}</p>
        )}

        {/* Recipe URL */}
        {recipeUrl && (
          <a
            href={recipeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mb-6"
          >
            View Full Recipe
          </a>
        )}

        {/* Ingredients */}
        {normalizedIngredients.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">🥕 Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {normalizedIngredients.map((ingredient, idx) => {
                const ingredientStr = String(ingredient);
                const isSelected = selectedIngredients.some(
                  (sel) =>
                    ingredientStr.toLowerCase().includes(sel.toLowerCase()) ||
                    sel.toLowerCase().includes(ingredientStr.toLowerCase())
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
        )}

        {/* Steps / Instructions */}
        {normalizedSteps.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">👨‍🍳 Steps</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1">
              {normalizedSteps.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* YouTube Videos */}
        {Array.isArray(videos) && videos.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">🎥 Related Videos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {videos.map((video, idx) => (
                <a
                  key={idx}
                  href={video.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 items-start border rounded-lg hover:shadow-md transition p-2"
                >
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-28 h-20 object-cover rounded"
                  />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-800">{video.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-2">{video.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-4 p-2 bg-gray-50 rounded text-xs text-gray-500">
          <p>
            Debug: Recipe object keys: {Object.keys(recipe).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
