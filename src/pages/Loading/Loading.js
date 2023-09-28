import React, {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.scss';

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard");
    }, 1000);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="loading">
      {/* Background */}
      <div className="loading_background">
        <img src={process.env.PUBLIC_URL + "/images/backgrounds/bg_0.jpg"} alt="Loading Background" />
        <div className="overlay" />
      </div>

      {/* Name */}
      <div className="loading_name">
        <h3>Progress Master</h3>

        {/*<p>Loading...</p>*/}
      </div>

      {/* Loader */}
      <div className="loader loading_loader" />
    </div>
  )
}
