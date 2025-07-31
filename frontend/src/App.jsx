import React, { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'
import Plants from './pages/Plants'
import Participants from './pages/Participants';

const getAllRecipes = async () => {
  let allRecipes = []
  await axios.get('http://localhost:5000/recipe').then(res => {
    allRecipes = res.data
  })
  return allRecipes
}

const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) return []
  const allRecipes = await getAllRecipes()
  return allRecipes.filter(item => item.createdBy === user._id)
}

const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || []
}

const getRecipe = async ({ params }) => {
  let recipe;
  try {
    const res = await axios.get(`http://localhost:5000/recipe/${params.id}`)
    recipe = res.data

    const userRes = await axios.get(`http://localhost:5000/user/${recipe.createdBy}`)
    recipe = { ...recipe, email: userRes.data.email }

    return recipe
  } catch (error) {
    console.error("Error fetching recipe:", error)
    throw new Error("Failed to load recipe")
  }
}

const getParticipants = async ({ params }) => {
  try {
    const token = localStorage.getItem("token"); // Fetch token from localStorage
console.log("token:",token)
    const response = await axios.get(
      `http://localhost:5000/api/participants/${params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in header
        },
      }
    );

    return { participants: response.data || [] }; // Always return an array
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { participants: [] }; // Return an empty array if error
  }
};



const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/Events", element: <Home />, loader: getMyRecipes },
      { path: "/Participate", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe },
      { path: "/plants", element: <Plants /> },
      { path: "/participants/:id", element: <Participants />, loader: getParticipants }
    ]
  }
])

export default function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}
