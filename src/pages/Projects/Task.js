import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import "./Project.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import ProjectBox from '../../components/UnderBox/ProjectBox';
import AddTaskBox from '../../components/UnderBox/AddTaskBox';
import EditTaskBox from '../../components/UnderBox/EditTaskBox';
import TaskItem from './TaskItem';

import CircleChart from '../../components/CircleChart';

export default function Task(props) {
    const [loadingTask, setLoadingTask] = useState(true);
    const [project, setProject] = useState(null);
    const [task, setTask] = useState(null);

    const loading = useSelector((state) => state.main.loading);
    const tasks = useSelector((state) => state.main.currentTasks);

    const location = useLocation();

    // Get data from location
    useEffect(() => {
        if (!loading) {
            let pathData = location.pathname.replace(process.env.REACT_APP_WEB_URL + "/task/", "").split("/");
            let projectId = pathData[0];
            let id = pathData[1];

            if (projectId.includes("project") || id.includes("task")) {
                console.log("Error");
            } else {
                DATA.setTasks(id).then(() => {
                    DATA.getProject(projectId).then((projectValue) => {
                        setProject(projectValue);

                        DATA.getTask(id).then((taskValue) => {
                            setTask(taskValue);

                            setLoadingTask(false);
                        })
                    })
                })
            }
        }
        // eslint-disable-next-line
    }, [loading, location])

    // Edit the project
    const editTask = () => {
        props.openUnderBox(
            "Edit " + task.name,
            <EditTaskBox
                id={task.id}
                name={task.name}
                desc={task.desc}
                accent={project.accent}
                closeUnderBox={props.closeUnderBox} />);
    }

    // Remove task
    const removeTask = (id, name) => {
        if (window.confirm("Are you sure you want to remove this task: " + name)) {
            DATA.removeTask(project.id, id);
        }
    }

    // Set task percent
    const setTaskPercent = (plus) => {
        let newPercent = plus ? task.percent + 1 : task.percent - 1;

        DATA.setTaskPercent(project.id, task.id, newPercent);
    }

    return (
        <>
            <Header
                goBack
                hasOptions
                loading={loadingTask}
                toggle={props.toggleNav}
                title={loadingTask ? "Loading..." : task.name}
                optionAction={() => {
                    props.openUnderBox(
                        "Options",
                        <ProjectBox edit={editTask} remove={removeTask} />);
                }} />


            <div className="layout_container">
                <div className="layout_scroll_box">
                    {/* Tasks */}
                    {loadingTask ? <div className="loader" /> :
                        <>
                            <h4 className="project_desc">{task.desc === "" ? "No description, edit the task to add one!" : task.desc}</h4>

                            <div className={["project_circle", tasks.length === 0 ? "task" : null].join(" ")}>
                                {tasks.length === 0 && <span
                                    className={["minus", task.percent === 0 ? "disabled" : null].join(" ")}
                                    onClick={() => setTaskPercent(false)}>
                                    <RemoveIcon sx={{ fontSize: 40 }} />
                                </span>}

                                <CircleChart accent={project.accent} percent={task.percent} />

                                {tasks.length === 0 && <span
                                    className={["plus", task.percent === 100 ? "disabled" : null].join(" ")}
                                    onClick={() => setTaskPercent(true)}>
                                    <AddIcon sx={{ fontSize: 40 }} />
                                </span>}
                            </div>

                            <h4 className="project_task_count">Sub tasks: [{tasks.length}]</h4>

                            {tasks.length === 0 ? <p className="layout_empty">There are no tasks here, add on by tapping the plus button</p> :
                                tasks.map(taskItem =>
                                    <TaskItem
                                        key={taskItem.id}
                                        data={taskItem}
                                        project={{ id: project.id, accent: project.accent }}
                                        currentId={task.id}
                                        removeTask={removeTask} />
                                )}
                        </>}
                </div>

                {/* Add Quick Task */}
                <span className="icon add_task quick" style={loadingTask ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                    "Add a new task",
                    <AddTaskBox projectId={project.id} id={task.id} closeUnderBox={props.closeUnderBox} quick={true} />
                )}>
                    <WhatshotIcon sx={{ fontSize: 28 }} />
                </span>

                {/* Add Task */}
                <span className="icon add_task" style={loadingTask ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                    "Add a new task",
                    <AddTaskBox projectId={project.id} id={task.id} closeUnderBox={props.closeUnderBox} />
                )}>
                    <AddIcon sx={{ fontSize: 40 }} />
                </span>
            </div>
        </>)
}
