// src/utils/fetchRecipe.js
export const fetchRecipe = async (itemName) => {
  const recipes = {
    tomato: {
      title: "Tomato Curry",
      link: "https://www.indiafoodnetwork.in/recipes/tomato-curry/",
      ingredients: ["Tomato", "Onion", "Spices"],
    },
    banana: {
      title: "Banana Pancakes",
      link: "https://www.indiafoodnetwork.in/recipes/banana-pancakes/",
      ingredients: ["Banana", "Flour", "Milk"],
    },
  };

  const result = recipes[itemName.toLowerCase()];
  return result || null;
};
