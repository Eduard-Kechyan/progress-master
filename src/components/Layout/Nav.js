import React from 'react';
import { NavLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';
import "./Nav.scss";

import loadingBg from '../../assets/images/loading_background.jpg';

export default function Nav(props) {
  return (
    <nav className={props.navOpen ? "nav_open" : null} >
      {/* Overlay */}
      <div className="overlay" onClick={() => props.toggleNav()} />

      {/* Close Nav */}
      <span className="icon close" onClick={() => props.toggleNav()}>
        <ArrowForwardIcon sx={{ fontSize: 34 }} />
      </span>

      {/* Top */}
      <div className="nav_top">
        <img src={loadingBg} alt="Nav Background" />
      </div>

      {/* Links */}
      <div className="nav_links">
        <NavLink to="/dashboard" onClick={() => props.toggleNav()}>
          <span className="icon"><DashboardIcon sx={{ fontSize: 34 }} /></span>
          Dashboard
        </NavLink>
        {/* <NavLink to="/settings" onClick={() => props.toggleNav()}>
          <span className="icon"><TuneIcon sx={{ fontSize: 34 }} /></span>
          Settings
        </NavLink>*/}
      </div>
    </nav>
  )
}
