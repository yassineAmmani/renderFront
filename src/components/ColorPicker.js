import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ColorPicker = () => {
  const [color, setColor] = useState('');
  const navigate = useNavigate(); // Corrected this line

  useEffect(() => {
    const fetchColor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/color`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setColor(response.data.favoriteColor);
      } catch (error) {
        console.error('Error fetching color:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login'); // Corrected this line
        }
      }
    };
    fetchColor();
  }, [navigate]); // Dependency array should include navigate

  const handleColorChange = async (e) => {
    const newColor = e.target.value;
    setColor(newColor);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/color`, { color: newColor }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (error) {
      console.error('Error updating color:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login'); // Corrected this line
  };

  return (
    <div>
      <h2>Choose Your Favorite Color</h2>
      <input type="color" value={color} onChange={handleColorChange} />
      <p>Your favorite color: {color}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ColorPicker;
