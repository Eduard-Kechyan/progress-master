import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Project.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import ProjectBox from '../../components/UnderBox/ProjectBox';

export default function Project(props) {
    const [loadingProject, setLoadingProject] = useState(true);
    const [project, setProject] = useState(null);

    const loading = useSelector((state) => state.main.loading);
    const projects = useSelector((state) => state.main.projects);

    const location = useLocation();
    const navigate = useNavigate();

    // Get id from location
    useEffect(() => {
        if (!loading && project === null) {
            let id = location.pathname.replace(process.env.REACT_APP_WEB_URL + "/project/", "");

            if (id.includes("project")) {
                console.log("Error");
            } else {
                setProject(projects.find(e => e.id === id));

                setTimeout(() => {
                    setLoadingProject(false);
                }, 300);
            }
        }
        // eslint-disable-next-line
    }, [loading, location])

    // Edit the project
    const editProject = () => {

    }

    // Remove the project
    const removeProject = () => {
        if (window.confirm("Are you sure you want to remove the project: " + project.title)) {
            DATA.removeProject(project.id).then(() => {
                props.closeUnderBox();
                navigate("/dashboard");
            });
        }
    }

    return (
        <>
            <Header
                hasOptions
                loading={loadingProject || loading}
                toggle={props.toggleNav}
                title={loadingProject || loading ? "Loading..." : project.title}
                optionAction={() => {
                    props.openUnderBox(
                        "Options",
                        <ProjectBox edit={editProject} remove={removeProject} />,
                        project.accent);
                }} />

            <div className="layout_container">
                Project
            </div>
        </>
    )
}
