import React, { useState, useEffect } from 'react';
import profileImg from '../assets/profile.png';
import axios from 'axios';
import { useLoaderData, useNavigate } from 'react-router-dom';

export default function RecipeDetails() {
  const recipe = useLoaderData();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [participants, setParticipants] = useState([]); // State to hold participants list

  useEffect(() => {
    // Optionally, fetch participants data for the recipe if you want to display it on the details page
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/participants/${recipe._id}`);
        setParticipants(res.data); // Store participants data in state
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    fetchParticipants(); // Fetch participants when the component mounts
  }, [recipe._id]); // Re-fetch when the recipe ID changes

  const handleParticipate = async () => {
    if (!user) {
      return alert("Please log in to participate");
    }

    if (!name || !age || !phone) {
      return alert("Please fill all fields");
    }

    try {
      const token = localStorage.getItem("token");
      console.log("Recipe ID for participation:", recipe._id);

      const res = await axios.post(
        `http://localhost:5000/api/participants/${recipe._id}`,
        { name, age, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Participation successful!");
      setName(""); // Reset form fields after success
      setAge("");
      setPhone("");
    } catch (err) {
      console.error(err);
      alert("Error submitting participation");
    }
  };

  const viewParticipants = () => {
    navigate(`/participants/${recipe._id}`);
  };

  return (
    <div className='outer-container'>
      <div className='profile'>
        <img src={profileImg} width="50px" height="50px" alt="profile" />
        <h5>{recipe.email}</h5>
      </div>

      <h3 className='title'>{recipe.title}</h3>

      <img
        src={`http://localhost:5000/images/${recipe.coverImage}`}
        width="220px"
        height="200px"
        alt="recipe"
      />

      <div className="form-section">
        <h4>Join this event</h4>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Your Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button className='participate-btn' onClick={handleParticipate}>
          Participate
        </button>
      </div>

      {user?.email === recipe.email && (
        <button className='view-participants-btn' onClick={viewParticipants}>
          View Participants
        </button>
      )}

      <div className='recipe-details'>
        <div className='ingredients'>
          <h4>Description</h4>
          <ul>{recipe.ingredients.map((item, index) => (<li key={index}>{item}</li>))}</ul>
        </div>
        <div className='instructions'>
          <h4>Place</h4>
          <span>{recipe.instructions}</span>
        </div>
      </div>

      {/* Optional Participants List Display */}
      {participants.length > 0 && (
        <div className="participants-list">
          <h4>Current Participants</h4>
          <ul>
            {participants.map((participant, index) => (
              <li key={index}>
                {participant.name}, {participant.age}, {participant.phone}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
