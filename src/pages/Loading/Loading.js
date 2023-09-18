import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.scss';

import loadingBG from '../../assets/images/loading_background.jpg';

export default function Loading() {
  const navigate = useNavigate();  

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="loading">
      {/* Background */}
      <div className="loading_background">
        <img src={loadingBG} alt="Loading Background" />
        <div className="overlay" />
      </div>

      {/* Title */}
      <div className="loading_title">
        <h3>Progress Master</h3>
        <h3>Progress Master</h3>

        <p>Loading...</p>
      </div>

      {/* Loader */}
      <div className="loader loading_loader" />
    </div>
  )
}
