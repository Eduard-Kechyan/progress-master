import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import "./Project.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import ProjectBox from '../../components/UnderBox/ProjectBox';
import EditProjectBox from '../../components/UnderBox/EditProjectBox';
import AddTaskBox from '../../components/UnderBox/AddTaskBox';
import TaskItem from './TaskItem';

import CircleChart from '../../components/CircleChart';

export default function Project(props) {
    const [loadingProject, setLoadingProject] = useState(true);
    const [project, setProject] = useState(null);

    const loading = useSelector((state) => state.main.loading);
    const tasks = useSelector((state) => state.main.currentTasks);

    const location = useLocation();
    const navigate = useNavigate();

    // Get data from location
    useEffect(() => {
        if (!loading) {
            let id = location.pathname.replace(process.env.REACT_APP_WEB_URL + "/project/", "");

            if (id.includes("project")) {
                console.log("Error");
            } else {
                DATA.setTasks(id).then(() => {
                    DATA.getProject(id).then((value) => {
                        setProject(value);

                        setLoadingProject(false);
                    })
                });
            }
        }
        // eslint-disable-next-line
    }, [loading, location])

    // Edit the project
    const editProject = () => {
        props.openUnderBox(
            "Edit " + project.title,
            <EditProjectBox
                id={project.id}
                title={project.title}
                desc={project.desc}
                accent={project.accent}
                closeUnderBox={props.closeUnderBox} />);
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

    // Remove task
    const removeTask = (id, name) => {
        if (window.confirm("Are you sure you want to remove this task: " + name)) {
            DATA.removeTask(project.id, id);
        }
    }

    return (
        <>
            <Header
                goBack
                hasOptions
                loading={loadingProject}
                toggle={props.toggleNav}
                title={loadingProject ? "Loading..." : project.title}
                optionAction={() => {
                    props.openUnderBox(
                        "Options",
                        <ProjectBox edit={editProject} remove={removeProject} />);
                }} />

            <div className="layout_container">
                <div className="layout_scroll_box">
                    {/* Tasks */}
                    {loadingProject ? <div className="loader" /> :
                        <>
                            <h4 className="project_desc">{project.desc === "" ? "No description, edit the project to add one!" : project.desc}</h4>

                            <div className="project_circle">
                                <CircleChart accent={project.accent} percent={project.percent} />
                            </div>

                            <h4 className="project_task_count">Sub tasks: [{tasks.length}]</h4>

                            {tasks.length === 0 ? <p className="layout_empty">There are no tasks here, add on by tapping the plus button</p> :
                                tasks.map(taskItem =>
                                    <TaskItem
                                        key={taskItem.id}
                                        data={taskItem}
                                        project={{ id: project.id, accent: project.accent }}
                                        currentId=""
                                        removeTask={removeTask} />
                                )}
                        </>}
                </div>

                {/* Add Quick Task */}
                <span className="icon add_task quick" style={loadingProject ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                    "Add a new task",
                    <AddTaskBox projectId={project.id} id={project.id} closeUnderBox={props.closeUnderBox} quick={true} />
                )}>
                    <WhatshotIcon sx={{ fontSize: 28 }} />
                </span>

                {/* Add Task */}
                <span className="icon add_task" style={loadingProject ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                    "Add a new task",
                    <AddTaskBox projectId={project.id} id={project.id} closeUnderBox={props.closeUnderBox} />
                )}>
                    <AddIcon sx={{ fontSize: 40 }} />
                </span>
            </div>
        </>
    )
}
