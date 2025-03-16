import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // If we're in the main page, go to login
    if (window.location.pathname === '/main') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      ←
    </button>
  );
};

export default BackButton; 