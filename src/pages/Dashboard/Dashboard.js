import React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import "./Dashboard.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import AddProjectBox from '../../components/UnderBox/AddProjectBox';

import CircleChart from '../../components/CircleChart';

import loadingBg from '../../assets/images/background_2.jpg';

export default function Dashboard(props) {
  const loading = useSelector((state) => state.main.loading);
  const projects = useSelector((state) => state.main.projects);
  const current = useSelector((state) => state.main.current);

  const navigate = useNavigate();

  const closeUnderBox = (id) => {
    props.closeUnderBox();
    navigate("/project/" + id);
  }

  return (
    <>
      <Header
        loading={loading}
        toggle={props.toggleNav}
        title="Dashboard" />

      <div className="layout_container">
        {/* Top */}
        <div className="dashboard_top" style={{ borderColor: current.accent }}>
          <img src={loadingBg} alt="Dashboard Top Background" />
          <div className="overlay" style={{ backgroundColor: current.accent, opacity: 0.3 }} />

          {/* Main */}
          <div className="main">
            <div style={{ display: 'flex' }}>
              {/* Name */}
              <div className={["name", loading || projects.length <= 1 ? "disabled" : null].join(" ")} tabIndex="0">
                <span>{current.title}</span>
                <span className="icon"><KeyboardArrowDownIcon sx={{ fontSize: 34 }} /></span>

                {/* Drop Down */}
                <div className="drop_down">
                  {projects.map(project =>
                    <button
                      key={project.id}
                      className="project_item"
                      onClick={() => {
                        const { content, ...filteredProject } = project;

                        DATA.setCurrent(filteredProject);
                      }}>
                      <CircleChart accent={project.accent} percent={10} size={34} small dark />
                      <span style={{ color: project.accent }}>{project.title}</span>
                    </button>)}
                </div>
              </div>
            </div>

            {/* Desc */}
            <p className="desc">{current.title === "" ?
              "No projects found, add one by tapping the plus button below" :
              current.desc}</p>
          </div>

          {/* Secondary */}
          <div className="secondary">
            {/* Chart */}
            <CircleChart accent={current.accent} percent={current.percent} />

            {/* Stats */}
            <span className="completed">{current.completed}/{current.total}</span>
          </div>
        </div >

        {/* Content */}
        < div className="dashboard_content" >
          {
            loading ?
              <>
                < h2 className="layout_title" > Projects: [?]</h2 >
                <div className="loader" />
              </>
              :
              <>
                <h2 className="layout_title">Projects: [{projects.length}]</h2>
                {projects.length === 0 ?
                  <p className="layout_empty">No projects found, add one by tapping the plus button below</p>
                  :
                  projects.map(project =>
                    <button
                      key={project.id}
                      className="project_item"
                      onClick={() => navigate("/project/" + project.id)}>
                      <CircleChart accent={project.accent} percent={project.percent} size={34} small dark />
                      <span style={{ color: project.accent }}>{project.title}</span>
                    </button>)}
              </>
          }

          {/* Add */}
          <span className="icon add_project" onClick={() => props.openUnderBox(
            "Create a new Project",
            <AddProjectBox closeUnderBox={closeUnderBox} />
          )}>
            <AddIcon sx={{ fontSize: 40 }} />
          </span>
        </div >
      </div>
    </>
  )
}
