import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Participants = () => {
  const { id } = useParams(); 
  const [participants, setParticipants] = useState([]); 
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const API_BASE = "https://craftgardening-3.onrender.com";

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true); 
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You must log in to view participants.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE}/api/participants/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setParticipants(response.data || []); 
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError("Failed to load participants.");
        }
        setParticipants([]); 
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchParticipants(); 
    }
  }, [id]);  // removed navigate

  if (loading) {
    return <div>Loading participants...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        {error.includes("log in") && (
          <button onClick={() => navigate("/login")}>Go to Login</button>
        )}
      </div>
    );
  }

  return (
    <div className="participants-page">
      <h1>Participants</h1>
      {participants.length === 0 ? (
        <p>No participants yet. Be the first to join!</p>
      ) : (
        <ul>
          {participants.map((participant) => (
            <li key={participant._id || participant.phone}>
              {participant.name}, {participant.age}, {participant.phone}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Participants;

