import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
    const [recipeData, setRecipeData] = useState({})
    const navigate = useNavigate()
    const onHandleChange = (e) => {
        let val = (e.target.name === "ingredients") ? e.target.value.split(",") : (e.target.name === "file") ? e.target.files[0] : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }
  
const onHandleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first");
    return;
  }

  const formData = new FormData();
  formData.append("title", recipeData.title);
  formData.append("time", recipeData.time);
  formData.append("ingredients", recipeData.ingredients); // Already a string from textarea
  formData.append("instructions", recipeData.instructions);
  formData.append("file", recipeData.file); // file is a File object

  try {
    const response = await axios.post("http://localhost:5000/recipe", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Recipe added:", response.data);
    navigate("/"); // or your success redirect route
  } catch (error) {
    console.error("Error adding recipe:", error.response?.data || error.message);
    alert("Failed to add recipe. Make sure you're logged in.");
  }
};

    return (
        <>
       <h2>Events List</h2>
            <div className='container'>
                
                <form className='form' onSubmit={onHandleSubmit}>
                    <h2>Create Event</h2>
                    <hr></hr>
                    <div className='form-control'>
                        <label>Title</label>
                        <input type="text" className='input' name="title" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Date</label>
                        <input type="text" className='input' name="time" onChange={onHandleChange}></input>
                    </div>
                    <div className='form-control'>
                        <label>Description</label>
                        <textarea type="text" className='input-textarea' name="ingredients" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Place</label>
                        <textarea type="text" className='input-textarea' name="instructions" rows="5" onChange={onHandleChange}></textarea>
                    </div>
                    <div className='form-control'>
                        <label>Event Poster</label>
                        <input type="file" className='input' name="file" onChange={onHandleChange}></input>
                    </div>
                    <button type="submit">Add Recipe</button>
                </form>
            </div>
        </>
    )
}