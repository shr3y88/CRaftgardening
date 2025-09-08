import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Participants = () => {
  const { id } = useParams(); // Fetch the 'id' from the URL
  const [participants, setParticipants] = useState([]); // State to hold participants
  const [error, setError] = useState(null); // State for error messages
  const [loading, setLoading] = useState(true); // State to handle loading state
  const navigate = useNavigate(); // Hook to handle navigation (if needed)
  const API_BASE = "https://craftgardening-2.onrender.com";

  // useEffect to fetch participants when component mounts or `id` changes
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true); // Start loading when API call is initiated
      try {
        const token = localStorage.getItem("token"); // Get token from local storage

        if (!token) {
          setError("User is not authenticated.");
          setLoading(false); // Stop loading if not authenticated
          return;
        }

        const response = await axios.get(
          `${API_BASE}/api/participants/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token in header for authentication
            },
          }
        );

        setParticipants(response.data || []); // Store participants in state
        setLoading(false); // Stop loading when data is fetched
      } catch (err) {
        setLoading(false); // Stop loading if there's an error
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          // Optionally redirect to login page
          // navigate("/login"); // Uncomment if you want to redirect to login
        } else {
          setError("Failed to load participants.");
        }
        console.error("Error fetching participants:", err);
        setParticipants([]); // Clear participants data on error
      }
    };

    if (id) {
      fetchParticipants(); // Fetch participants if `id` exists in URL
    }
  }, [id, navigate]); // Re-run the effect if `id` or `navigate` changes

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error message if there is any
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Participants</h1>
      {participants.length === 0 ? (
        <p>No participants yet.</p> // Message if no participants are available
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

