import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Participants = () => {
  const { id } = useParams(); 
  const [participants, setParticipants] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const API_BASE = "https://craftgardening-2.onrender.com";

 
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("User is not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE}/api/participants/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          }
        );

        setParticipants(response.data || []); 
        setLoading(false); 
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          
        } else {
          setError("Failed to load participants.");
        }
        console.error("Error fetching participants:", err);
        setParticipants([]); 
      }
    };

    if (id) {
      fetchParticipants(); 
    }
  }, [id, navigate]); 

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

 
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Participants</h1>
      {participants.length === 0 ? (
        <p>No participants yet.</p> 
      ) : (
        <ul>
          {participants.map((participant, index) => (
            <li key={index}>
              {participant.name}, {participant.age}, {participant.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Participants;


