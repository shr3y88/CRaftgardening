import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function EditRecipe() {
    const [recipeData, setRecipeData] = useState({
        title: "",
        ingredients: "",
        instructions: "",
        time: "",
        file: null
    })
    const navigate = useNavigate()
    const { id } = useParams()
    const API_BASE = "https://craftgardening-3.onrender.com";

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${API_BASE}/recipe/${id}`)
                let res = response.data
                setRecipeData({
                    title: res.title,
                    ingredients: res.ingredients.join(","), // convert array -> string
                    instructions: res.instructions,
                    time: res.time,
                    file: null
                })
            } catch (err) {
                console.error("Error fetching recipe:", err)
            }
        }
        getData()
    }, [id])

    const onHandleChange = (e) => {
        let val = (e.target.name === "file")
            ? e.target.files[0]
            : e.target.value
        setRecipeData(pre => ({ ...pre, [e.target.name]: val }))
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData()
            formData.append("title", recipeData.title)
            formData.append("time", recipeData.time)
            formData.append("ingredients", recipeData.ingredients) // send as string
            formData.append("instructions", recipeData.instructions)
            if (recipeData.file) {
                formData.append("file", recipeData.file)
            }

            await axios.put(`${API_BASE}/recipe/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'authorization': 'bearer ' + localStorage.getItem("token")
                }
            })

            navigate("/Events")
        } catch (err) {
            console.error("Error updating recipe:", err)
        }
    }

    return (
        <div className='container'>
            <form className='form' onSubmit={onHandleSubmit}>
                <h2>Edit Event</h2>
                <hr />

                <div className='form-control'>
                    <label>Title</label>
                    <input
                        type="text"
                        className='input'
                        name="title"
                        onChange={onHandleChange}
                        value={recipeData.title}
                    />
                </div>

                <div className='form-control'>
                    <label>Time</label>
                    <input
                        type="text"
                        className='input'
                        name="time"
                        onChange={onHandleChange}
                        value={recipeData.time}
                    />
                </div>

                <div className='form-control'>
                    <label>Ingredients</label>
                    <textarea
                        className='input-textarea'
                        name="ingredients"
                        rows="5"
                        onChange={onHandleChange}
                        value={recipeData.ingredients}
                    />
                </div>

                <div className='form-control'>
                    <label>Instructions</label>
                    <textarea
                        className='input-textarea'
                        name="instructions"
                        rows="5"
                        onChange={onHandleChange}
                        value={recipeData.instructions}
                    />
                </div>

                <div className='form-control'>
                    <label>Recipe Image</label>
                    <input
                        type="file"
                        className='input'
                        name="file"
                        onChange={onHandleChange}
                    />
                </div>

                <button type="submit">Edit Recipe</button>
            </form>
        </div>
    )
}

