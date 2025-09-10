import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { MdDateRange } from "react-icons/md";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
  const { recipes } = useLoaderData(); // from loader in App.js
  const [allRecipes, setAllRecipes] = useState([]);
  const navigate = useNavigate();
  const API_BASE = "https://craftgardening-3.onrender.com";

  // path check: are we in My Events?
  const isMyEventsPage = window.location.pathname === "/my-events";

  let favItems = JSON.parse(localStorage.getItem("fav")) ?? [];

  useEffect(() => {
    setAllRecipes(recipes || []);
  }, [recipes]);

  const onDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/recipe/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAllRecipes((prev) => prev.filter((recipe) => recipe._id !== id));
      let filterItem = favItems.filter((recipe) => recipe._id !== id);
      localStorage.setItem("fav", JSON.stringify(filterItem));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete recipe.");
    }
  };

  const favRecipe = (item) => {
    const exists = favItems.some((recipe) => recipe._id === item._id);
    let updatedFavs;

    if (exists) {
      updatedFavs = favItems.filter((recipe) => recipe._id !== item._id);
    } else {
      updatedFavs = [...favItems, item];
    }

    localStorage.setItem("fav", JSON.stringify(updatedFavs));
    favItems = updatedFavs;
    // trigger rerender
    setAllRecipes([...allRecipes]);
  };

  return (
    <div className='card-container'>
      {allRecipes?.map((item) => (
        <div
          key={item._id}
          className='card'
          onDoubleClick={() => navigate(`/recipe/${item._id}`)}
        >
          <img
            src={`${API_BASE}/images/${item.coverImage}`}
            width="120px"
            height="100px"
            alt={item.title}
          />
          <div className='card-body'>
            <div className='title'>{item.title}</div>
            <div className='icons'>
              <div className='timer'>
                <MdDateRange /> {item.time}
              </div>
              {!isMyEventsPage ? (
                <FaHeart
                  onClick={() => favRecipe(item)}
                  style={{
                    color: favItems.some((res) => res._id === item._id)
                      ? "red"
                      : ""
                  }}
                />
              ) : (
                <div className='action'>
                  <Link to={`/editRecipe/${item._id}`} className="editIcon">
                    <FaEdit />
                  </Link>
                  <MdDelete
                    onClick={() => onDelete(item._id)}
                    className='deleteIcon'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

