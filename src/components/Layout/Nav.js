import React from 'react';
import { NavLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TuneIcon from '@mui/icons-material/Tune';
import { useSelector } from 'react-redux';
import "./Nav.scss";

import CircleChart from '../CircleChart';

export default function Nav(props) {
  const loading = useSelector((state) => state.main.loading);
  const projects = useSelector((state) => state.main.projects);

  return (
    <nav className={props.open ? "nav_open" : null} >
      {/* Overlay */}
      <div className="overlay" onClick={() => props.toggle()} />

      {/* Close Nav */}
      <span className="icon close" onClick={() => props.toggle()}>
        <ArrowForwardIcon sx={{ fontSize: 34 }} />
      </span>

      {/* Top */}
      <div className="nav_top">
        {/* <img src={loadingBg} alt="Nav Background" />*/}
      </div>

      {/* Links */}
      <div className="nav_links">
        <NavLink to="/dashboard" onClick={() => props.toggle()}>
          <span className="icon"><DashboardIcon sx={{ fontSize: 34 }} /></span>
          Dashboard
        </NavLink>

        {loading || projects.length === 0 ? null
          :
          projects.map(project =>
            <NavLink
              key={project.id}
              to={"/task/" + project.id}
              state={{ projectId: project.id, taskId: "", isProject: true }}
              onClick={() => props.toggle()}>
              <CircleChart accent={project.accent} percent={project.percent} size={34} small dark />
              <span style={{ color: project.accent }}>{project.name}</span>
            </NavLink>)}

        <NavLink to="/settings" onClick={() => props.toggle()} className="settings">
          <span className="icon"><TuneIcon sx={{ fontSize: 34 }} /></span>
          Settings
        </NavLink>
      </div>
    </nav>
  )
}
