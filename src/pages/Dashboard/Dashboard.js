import React, { useState, useEffect } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import CachedIcon from '@mui/icons-material/Cached';
import { useSelector } from 'react-redux';
import "./Dashboard.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import AddBox from '../../components/UnderBox/AddBox';

import CircleChart from '../../components/CircleChart';

import loadingBg from '../../assets/images/background_2.jpg';

export default function Dashboard(props) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  const loading = useSelector((state) => state.main.loading);
  const projects = useSelector((state) => state.main.projects);
  const current = useSelector((state) => state.main.current);
  const settings = useSelector((state) => state.main.settings);

  const navigate = useNavigate();  

  useEffect(() => {
    let interval = setInterval(() => {
      let date = new Date();

      setTime(date.toLocaleTimeString("en-GB"));
    }, 100);

    return () => {
      clearInterval(interval);
    }
  }, [])

  const closeUnderBox = (id) => {
    props.closeUnderBox();
    navigate("/task/" + id, { state: { projectId: id, taskId: "", isProject: true } });
  }

  return (
    <>
      <Header
        isDashboard
        loading={loading}
        toggle={props.toggleNav}
        name="Dashboard" />

      <div className="layout_container">
        {/* Top */}
        <div className="dashboard_top">
          <img src={loadingBg} alt="Dashboard Top Background" />
          <div className="overlay" style={{ backgroundColor: current.accent, opacity: 0.3 }} />

          {/* Main */}
          <div className="main" style={{ borderColor: current.accent }}>
            <div style={{ display: 'flex' }}>
              {/* Name */}
              <div className={["name", loading || projects.length <= 1 ? "disabled" : null].join(" ")} tabIndex="0">
                <span className="text">{current.name}</span>
                <span className="icon"><KeyboardArrowDownIcon sx={{ fontSize: 34 }} /></span>

                {/* Drop Down */}
                <div className="drop_down">
                  {projects.map(project =>
                    <button
                      key={project.id}
                      className="project_item"
                      onClick={() => {
                        const { tasks, ...filteredProject } = project;

                        DATA.setCurrent(filteredProject);
                      }}>
                      <CircleChart accent={project.accent} percent={project.percent} size={34} small dark />
                      <span style={{ color: project.accent }}>{project.name}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Desc */}
            <p className="desc">{current.name === "" ?
              "No projects found, add one by tapping the plus button below" :
              current.desc === "" ? "No description, add one by going into the project's page's options" : current.desc}</p>
          </div>

          {/* Secondary */}
          <div className="secondary">
            {/* Clock */}
            <span className="clock">{time}</span>

            {/* Chart */}
            <CircleChart accent={current.accent} percent={current.percent} />

            {/* Stats */}
            <span className="isCompleted">{current.isCompleted}/{current.total}</span>
          </div>
        </div >

        {/* Content */}
        < div className="dashboard_content" >
          {
            loading ?
              <>
                < h2 className="layout_name" > Projects: [?]</h2 >
                <div className="loader" />
              </>
              :
              <>
                <h2 className="layout_name">Projects: [{projects.length}]</h2>
                {projects.length === 0 ?
                  <p className="layout_empty">No projects found, add one by tapping the plus button below</p>
                  :
                  projects.map(project =>
                    <button
                      key={project.id}
                      className="project_item"
                      onClick={() => navigate("/task/" + project.id, { state: { projectId: project.id, taskId: "", isProject: true } })}>
                      <CircleChart accent={project.accent} percent={project.percent} size={34} small dark />
                      <span style={{ color: project.accent }}>{project.name}</span>
                    </button>)}
              </>
          }

          {/* Options */}
          <div className="dashboard_options_box">
            {/* Reload */}
            {settings.showReload && <span className="icon dashboard_option_button small" onClick={() => window.location.reload()}>
              <CachedIcon sx={{ fontSize: 28 }} />
            </span>}


            {/* Add */}
            <span className="icon dashboard_option_button" onClick={() => props.openUnderBox(
              "Create a new project",
              <AddBox closeUnderBox={closeUnderBox} isProject={true} />
            )}>
              <AddIcon sx={{ fontSize: 40 }} />
            </span>
          </div>
        </div >
      </div>
    </>
  )
}
