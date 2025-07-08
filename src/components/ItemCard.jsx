import { useState } from "react";
import { fetchRecipe } from "../utils/fetchRecipe";

export default function ItemCard({ item }) {
  const [recipe, setRecipe] = useState(null);

  const handleGetRecipe = async () => {
    const res = await fetchRecipe(item.name);
    setRecipe(res);
  };

  return (
    <div className="border rounded p-4 w-64 shadow bg-white">
      <img src={item.image} alt={item.name} className="h-32 object-cover" />
      <h3 className="font-bold text-lg">{item.name}</h3>
      <p>Expiry: {item.expiry}</p>
      <button onClick={handleGetRecipe} className="mt-2 bg-green-600 text-white px-4 py-2 rounded">
        Get Recipe
      </button>

      {recipe && (
        <div className="mt-2 text-sm">
          <p className="font-bold">{recipe.title}</p>
          <p>Ingredients: {recipe.ingredients.join(", ")}</p>
          <a href={recipe.link} className="text-blue-600 underline" target="_blank" rel="noreferrer">
            View Recipe
          </a>
        </div>
      )}
    </div>
  );
}
