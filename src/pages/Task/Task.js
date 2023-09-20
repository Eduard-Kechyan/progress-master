import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CachedIcon from '@mui/icons-material/Cached';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import "./Task.scss";

import DATA from '../../utilities/dataHandler';

import Header from '../../components/Layout/Header';
import Modal from "../../components/Modal/Modal";
import OptionsBox from '../../components/UnderBox/OptionsBox';
import AddBox from '../../components/UnderBox/AddBox';
import EditBox from '../../components/UnderBox/EditBox';
import TaskItem from './TaskItem';

import CircleChart from '../../components/CircleChart';

export default function Task(props) {
    const [loadingTask, setLoadingTask] = useState(true);
    const [isProject, setIsProject] = useState(true);
    const [project, setProject] = useState(null);
    const [current, setCurrent] = useState(null);

    const descRef = useRef(null);

    const loading = useSelector((state) => state.main.loading);
    const tasks = useSelector((state) => state.main.currentTasks);

    const location = useLocation();
    const navigate = useNavigate();

    // Get data from location
    useEffect(() => {
        if (!loading) {
            setIsProject(location.state.isProject);

            let projectId = location.state.projectId;
            let taskId = location.state.taskId;

            if (projectId.includes("task")) {
                console.log("Error");
            } else {
                if (location.state.isProject) {
                    DATA.setTasks(projectId).then(() => {
                        DATA.getProject(projectId).then((projectValue) => {
                            setProject(projectValue);
                            setCurrent(projectValue);

                            setTimeout(() => {
                                setLoadingTask(false);
                            }, 200);
                        })
                    });
                } else {
                    DATA.setTasks(taskId).then(() => {
                        DATA.getProject(projectId).then((projectValue) => {
                            setProject(projectValue);

                            DATA.getTask(taskId).then((taskValue) => {
                                setCurrent(taskValue);

                                setTimeout(() => {
                                    setLoadingTask(false);
                                }, 200);
                            })
                        })
                    })
                }
            }
        }
        // eslint-disable-next-line
    }, [loading, location])

    useEffect(() => {
        let scrollInterval = null;

        if (!loadingTask && descRef.current !== null && current !== null && current.desc !== "") {
            let previousScrollTop = 0;
            let dirDown = true;

            scrollInterval = setInterval(() => {
                if (dirDown) {
                    if (previousScrollTop === descRef.current.scrollTop && descRef.current.scrollTop !== 0) {
                        dirDown = false;
                    } else {
                        previousScrollTop = descRef.current.scrollTop;

                        descRef.current.scrollTop++;
                    }
                } else {
                    if (previousScrollTop === 0) {
                        dirDown = true;
                    } else {
                        previousScrollTop = descRef.current.scrollTop;

                        descRef.current.scrollTop--;
                    }
                }
            }, 100);
        }

        return () => {
            clearInterval(scrollInterval);
        }
    }, [current, loadingTask])

    // Set task percent
    const setTaskPercent = (plus) => {
        let newPercent = plus ? current.percent + 1 : current.percent - 1;

        DATA.setTaskPercent(project.id, current.id, newPercent);
    }

    // Edit
    const edit = () => {
        props.openUnderBox(
            "Edit " + current.name,
            <EditBox
                id={current.id}
                isProject={isProject}
                name={current.name}
                desc={current.desc}
                accent={project.accent}
                closeUnderBox={props.closeUnderBox} />);
    }

    // Remove
    const remove = () => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Removing"
                        desc={"Are you sure you want to remove this " + isProject ? "project: " : "task: " + current.name}
                        isConfirm={true}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            if (isProject) {
                                DATA.removeProject(project.id).then(() => {
                                    props.closeUnderBox();
                                    navigate("/dashboard");
                                });
                            } else {
                                DATA.removeTask(project.id, current.parentId, current.id, isProject, true).then(() => {
                                    props.closeUnderBox();
                                    navigate(-1);
                                });
                            }
                        }}
                    />
                );
            }
        });
    }

    // Remove single task
    const removeTask = (id, name) => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Removing"
                        desc={"Are you sure you want to remove this task: " + name}
                        isConfirm={true}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            DATA.removeTask(project.id, current.id, id, isProject).then(() => {
                                onClose();
                            });
                        }}
                    />
                );
            }
        });
    }

    // Reorder tasks
    const onDragEnd = (result) => {
        if (!result.destination || result.source.index === result.destination.index) {
            return;
        }

        let newData = {
            id: result.draggableId,
            from: result.source.index,
            to: result.destination.index
        }

        let newTasks = [...tasks];

        newTasks.splice(newData.from, 1);
        newTasks.splice(newData.to, 0, tasks.filter(e => e.id === newData.id)[0]);

        let newNewTasks = []

        for (let i = 0; i < newTasks.length; i++) {
            newNewTasks.push({
                ...newTasks[i],
                order: i
            });
        }

        DATA.orderTasks(current.id, newNewTasks);
    }

    return (
        <>
            <Header
                goBack
                hasOptions
                loading={loadingTask}
                toggle={props.toggleNav}
                name={loadingTask ? "Loading..." : current.name}
                optionAction={() => {
                    props.openUnderBox(
                        "Options",
                        <OptionsBox edit={edit} remove={remove} />);
                }} />

            <div className="layout_container">
                <div className="layout_scroll_box">
                    {loadingTask ? <div className="loader" /> :
                        <>
                            <h4 className="task_desc" ref={descRef}>
                                {current.desc === "" ? "No description, edit the " + (isProject ? "project" : "task") + " to add one!" : current.desc}
                            </h4>

                            <div className={["task_circle", tasks.length === 0 ? "task" : null].join(" ")}>
                                {!isProject && tasks.length === 0 && <span
                                    className={["minus", current.percent === 0 ? "disabled" : null].join(" ")}
                                    onClick={() => setTaskPercent(false)}>
                                    <RemoveIcon sx={{ fontSize: 40 }} />
                                </span>}

                                <CircleChart accent={project.accent} percent={current.percent} />

                                {!isProject && tasks.length === 0 && <span
                                    className={["plus", current.percent === 100 ? "disabled" : null].join(" ")}
                                    onClick={() => setTaskPercent(true)}>
                                    <AddIcon sx={{ fontSize: 40 }} />
                                </span>}
                            </div>

                            <h4 className="task_count">Sub tasks: [{tasks.length}]</h4>

                            <DragDropContext onDragEnd={onDragEnd}>
                                <Droppable droppableId={current.id} >
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>
                                            {tasks.length === 0 ? <p className="layout_empty">There are no tasks here, add on by tapping the plus button</p> :
                                                tasks.map((taskItem, index) =>
                                                    <TaskItem
                                                        key={taskItem.id}
                                                        data={taskItem}
                                                        index={index}
                                                        project={{ id: project.id, accent: project.accent }}
                                                        currentId={current.id}
                                                        removeTask={removeTask} />
                                                )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>

                            <div className="task_end_line" />
                        </>}
                </div>

                {/* Options */}
                <div className="task_options_box">
                    {/* Reload */}
                    <span className="icon task_option_button small" onClick={() => window.location.reload()}>
                        <CachedIcon sx={{ fontSize: 28 }} />
                    </span>

                    {/* Add Quick */}
                    <span className="icon task_option_button small" style={loadingTask ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                        "Add a new " + isProject ? "project" : "task",
                        <AddBox
                            projectId={project.id}
                            currentId={current.id}
                            closeUnderBox={props.closeUnderBox}
                            accent={project.accent}
                            isAddingToProject={isProject}
                            quick={true} />
                    )}>
                        <WhatshotIcon sx={{ fontSize: 28 }} />
                    </span>

                    {/* Add */}
                    <span className="icon task_option_button" style={loadingTask ? {} : { backgroundColor: project.accent }} onClick={() => props.openUnderBox(
                        "Add a new " + isProject ? "project" : "task",
                        <AddBox
                            projectId={project.id}
                            currentId={current.id}
                            closeUnderBox={props.closeUnderBox}
                            accent={project.accent}
                            isAddingToProject={isProject} />
                    )}>
                        <AddIcon sx={{ fontSize: 40 }} />
                    </span>
                </div>
            </div>
        </>
    )
}
