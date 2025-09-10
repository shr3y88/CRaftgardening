import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import Plants from './pages/Plants'
import Participants from './pages/Participants'

const API_BASE = "https://craftgardening-3.onrender.com";

// 🔹 Get all recipes
const getAllRecipes = async () => {
  try {
    const res = await axios.get(`${API_BASE}/recipe`);
    return { recipes: res.data || [] };
  } catch (err) {
    console.error("Error fetching all recipes:", err);
    return { recipes: [] };
  }
};

// 🔹 Get user’s own recipes
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return { recipes: [] };

  const { recipes } = await getAllRecipes();
  return { recipes: recipes.filter(item => item.createdBy === user._id) };
};

// 🔹 Get saved/fav recipes
const getFavRecipes = () => {
  return { recipes: JSON.parse(localStorage.getItem("fav")) || [] };
};

// 🔹 Get single recipe + creator email
const getRecipe = async ({ params }) => {
  try {
    const res = await axios.get(`${API_BASE}/recipe/${params.id}`);
    let recipe = res.data;

    const userRes = await axios.get(`${API_BASE}/user/${recipe.createdBy}`);
    recipe = { ...recipe, email: userRes.data.email };

    return { recipe };
  } catch (error) {
    console.error("Error fetching recipe:", error);
    throw new Error("Failed to load recipe");
  }
};

// 🔹 Get participants for an event
const getParticipants = async ({ params }) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return { participants: [] };

    const response = await axios.get(
      `${API_BASE}/api/participants/${params.id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { participants: response.data || [] };
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { participants: [] };
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/my-events", element: <Home />, loader: getMyRecipes },
      { path: "/saved-events", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
      { path: "/plants", element: <Plants /> },
      { path: "/participants/:id", element: <Participants />, loader: getParticipants }
    ]
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}

