import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddEvent() {
    const [eventData, setEventData] = useState({})
    const navigate = useNavigate()
    const API_BASE = "https://craftgardening-3.onrender.com";

    const onHandleChange = (e) => {
        let val = (e.target.name === "file") 
            ? e.target.files[0] 
            : e.target.value;

        setEventData(prev => ({ ...prev, [e.target.name]: val }))
    }

    const onHandleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please login first");
            return;
        }

        const formData = new FormData();
        formData.append("title", eventData.title);
        formData.append("time", eventData.time);
        formData.append("description", eventData.description);
        formData.append("place", eventData.place);
        formData.append("file", eventData.file);

        try {
            const response = await axios.post(`${API_BASE}/api/events`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Event added:", response.data);
            navigate("/Events"); 
        } catch (error) {
            console.error("Error adding event:", error.response?.data || error.message);
            alert("Failed to add event. Make sure you're logged in.");
        }
    };

    return (
        <>
            <h2>Events</h2>
            <div className='container'>
                <form className='form' onSubmit={onHandleSubmit}>
                    <h2>Create Event</h2>
                    <hr />

                    <div className='form-control'>
                        <label>Title</label>
                        <input 
                            type="text" 
                            className='input' 
                            name="title" 
                            onChange={onHandleChange} 
                        />
                    </div>

                    <div className='form-control'>
                        <label>Date</label>
                        <input 
                            type="text" 
                            className='input' 
                            name="time" 
                            onChange={onHandleChange} 
                        />
                    </div>

                    <div className='form-control'>
                        <label>Description</label>
                        <textarea 
                            className='input-textarea' 
                            name="description" 
                            rows="5" 
                            onChange={onHandleChange} 
                        />
                    </div>

                    <div className='form-control'>
                        <label>Place</label>
                        <textarea 
                            className='input-textarea' 
                            name="place" 
                            rows="3" 
                            onChange={onHandleChange} 
                        />
                    </div>

                    <div className='form-control'>
                        <label>Event Poster</label>
                        <input 
                            type="file" 
                            className='input' 
                            name="file" 
                            onChange={onHandleChange} 
                        />
                    </div>

                    <button type="submit">Add Event</button>
                </form>
            </div>
        </>
    )
}

