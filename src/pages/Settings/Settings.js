import React, { useRef, useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 as uuid } from "uuid";
// import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
// import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
// import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined'; 
// import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
// import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import "./Settings.scss";

import { unregister } from '../../serviceWorkerRegistration';

import Header from '../../components/Layout/Header';
import Modal from '../../components/Modal/Modal';

import DATA from '../../utilities/dataHandler';
import UTIL from '../../utilities/utilities';

export default function Settings(props) {
    const [year, setYear] = useState(2023);

    const importInputRef = useRef(null);

    const loading = useSelector((state) => state.main.loading);
    const settings = useSelector((state) => state.main.settings);

    const navigate = useNavigate();

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, [])

    const exportData = () => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Exporting"
                        desc={"Are you sure you want to export all data? This might take a while!"}
                        isConfirm={true}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            onClose();

                            let exportData = {
                                projects: [],
                                tasks: []
                            };

                            DATA.getProjects().then((projectsValue) => {
                                exportData.projects = projectsValue;

                                DATA.getTasks().then((tasksValue) => {
                                    exportData.tasks = tasksValue;

                                    let jsonData = JSON.stringify(exportData);

                                    let date = UTIL.getFullDate();

                                    UTIL.downloadFile(jsonData, "progress_master_export_data_" + date + ".json", "text/json");
                                })
                            })
                        }}
                    />
                );
            }
        });
    }

    const clickImportInput = () => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Importing"
                        desc={"Warning! Data will be overwritten! Are you sure you want to continue?"}
                        isConfirm={true}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            onClose();

                            importInputRef.current.value = null;

                            importInputRef.current.click();
                        }}
                    />
                );
            }
        });
    }

    const importData = (event) => {
        DATA.toggleLoading(true).then(() => {
            UTIL.readFile(event).then(importData => {
                DATA.getProjects().then((projectsValue) => {
                    DATA.getTasks().then((tasksValue) => {
                        let newImportData = JSON.parse(importData);

                        let newProjects = [];
                        let newTasks = [];

                        newProjects = UTIL.mergeByProperty(projectsValue, newImportData.projects, "id");
                        newTasks = UTIL.mergeByProperty(tasksValue, newImportData.tasks, "id");

                        DATA.importProjects(newProjects).then(() => {
                            DATA.importTasks(newTasks);

                            DATA.toggleLoading(false);
                        }).catch(() => {
                            DATA.toggleLoading(false);
                        })
                    }).catch(() => {
                        DATA.toggleLoading(false);
                    })
                }).catch(() => {
                    DATA.toggleLoading(false);
                })
            }).catch(() => {
                DATA.toggleLoading(false);
            })
        });
    }

    // TODO - Remove the eslint comment
    // eslint-disable-next-line
    const importDataAlt = (event) => {
        UTIL.readFile(event).then(importData => {
            let newImportData = JSON.parse(importData);
            let newProject = null;
            let newTasks = [];

            newProject = {
                name: newImportData[0]["Space Name"],
                id: uuid(),
                percent: 0,
                isCompleted: false,
                children: [],
                desc: "",
                accent: "#2d98da"
            };

            //////// FOLDERS ////////
            let folderNames = [];

            // Get folder names
            for (let i = 0; i < newImportData.length; i++) {
                if (!folderNames.includes(newImportData[i]["Folder Name"])) {
                    folderNames.push(newImportData[i]["Folder Name"]);
                }
            }

            // Add folder tasks
            for (let i = 0; i < folderNames.length; i++) {
                let newTask = {
                    projectId: newProject.id,
                    parentId: newProject.id,
                    id: uuid(),
                    name: folderNames[i],
                    desc: "",
                    order: i,
                    children: [],
                    percent: 0,
                    isCompleted: false
                };

                newTasks.push(newTask);

                newProject.children.push(newTask.id);
            }

            //////// LISTS ////////
            let lists = [];

            // Get list names
            for (let i = 0; i < folderNames.length; i++) {
                let newList = [];

                for (let j = 0; j < newImportData.length; j++) {
                    if (newImportData[j]["Folder Name"] === folderNames[i]) {
                        if (!newList.some(e => e.name === newImportData[j]["List Name"])) {
                            newList.push({
                                name: newImportData[j]["List Name"],
                                id: newProject.children[i]
                            });
                        }
                    }
                }

                lists.push(newList);
            }

            for (let i = 0; i < lists.length; i++) {
                for (let j = 0; j < lists[i].length; j++) {
                    let newTask = {
                        projectId: newProject.id,
                        parentId: lists[i][j].id,
                        id: uuid(),
                        name: lists[i][j].name,
                        desc: "",
                        order: j,
                        children: [],
                        percent: 0,
                        isCompleted: false
                    };

                    newTasks.push(newTask);

                    for (let k = 0; k < folderNames.length; k++) {
                        if (folderNames[k] === newTasks[k].name) {
                            if (!newTasks[k].children.includes(newTask.id)) {
                                newTasks[k].children.push(newTask.id);
                            }
                        }
                    }
                }
            }

            //////// TASKS ////////
            for (let i = 0; i < newImportData.length; i++) {
                for (let j = 4; j < 20; j++) {
                    if (newImportData[i]["List Name"] === newTasks[j].name) {
                        let newTask = {
                            projectId: newProject.id,
                            parentId: newTasks[j].id,
                            id: uuid(),
                            tempId: newImportData[i]["Task ID"],
                            tempParentId: newImportData[i]["Parent ID"],
                            name: newImportData[i]["Task Name"],
                            desc: newImportData[i]["Task Content"],
                            order: 0,
                            children: [],
                            percent: newImportData[i]["Status"] === "complete" ? 100 : 0, // TODO - Check if this is necessary, if not, set it to 0
                            isCompleted: newImportData[i]["Status"] === "complete" // TODO - Check if this is necessary, if not, set it to false
                        };

                        newTasks.push(newTask);

                        newTasks[j].children.push(newTask.id);
                    }
                }
            }

            for (let i = 0; i < newTasks.length; i++) {
                if (newTasks[i].tempParentId !== null && newTasks[i].tempParentId !== undefined) {
                    for (let j = 0; j < newTasks.length; j++) {
                        if (newTasks[j].tempId !== null && newTasks[j].tempId !== undefined && newTasks[j].tempId === newTasks[i].tempParentId) {
                            if (!newTasks[j].children.includes(newTasks[i].tempId)) {
                                newTasks[j].children.push(newTasks[i].id);
                            }

                            break;
                        }
                    }
                }
            }

            // Remove tempId and tempParentId from tasks here
            newTasks = newTasks.map(task => {
                delete task.tempId;
                delete task.tempParentId;

                return task;
            });

            console.log(newTasks);

            let jsonData = JSON.stringify({
                projects: [newProject],
                tasks: newTasks
            });

            UTIL.downloadFile(jsonData, "progress_master_export_data_TEST.json", "text/json");
        })
    }

    const clearData = () => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Clearing"
                        desc={"Are you sure you want to clear all data? This can't be undone!"}
                        isConfirm={true}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            onClose();

                            DATA.clearData().then(() => {
                                navigate("/");
                                window.location.reload();
                            });
                        }}
                    />
                );
            }
        });
    }

    const reloadApp = () => {
        confirmAlert({
            overlayClassName: "modal",
            customUI: ({ onClose }) => {
                return (
                    <Modal
                        name="Reloading"
                        desc={"The app will reload after clearing the cache!"}
                        isConfirm={false}
                        cancel={() => {
                            onClose();
                        }}
                        confirm={() => {
                            onClose();
                            unregister();

                            navigate("/");
                            window.location.reload();
                        }}
                    />
                );
            }
        });
    }

    const toggleSettingsProperty = (property) => {
        let newSettings = { ...settings };

        newSettings[property] = !newSettings[property];

        DATA.setSettings(newSettings);
    }

    return (
        <>
            <Header
                goBack
                hasOptions
                openNav
                toggle={props.toggleNav}
                optionAction={() => {
                    console.log("Options opened!");
                }}
                name="Settings" />

            <div className="layout_container">
                <div className="layout_scroll_box">
                    {loading ? <div className="loader" /> :
                        <>
                            {/* Data */}
                            <div className="settings_block">
                                <h3 className="sub_name">Data</h3>

                                <div className="button_box">
                                    <p>Export all data</p>
                                    <button onClick={() => exportData()}>Export</button>
                                </div>
                                <div className="button_box">
                                    <p>Import new data</p>
                                    <button onClick={() => clickImportInput()}>Import</button>
                                </div>
                                <div className="button_box">
                                    <p>Clear all data</p>
                                    <button onClick={() => clearData()}>Clear</button>
                                </div>
                                <div className="button_box">
                                    <p>Reload App</p>
                                    <button onClick={() => reloadApp()}>Reload</button>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="settings_block">
                                <h3 className="sub_name">Options</h3>

                                <div className="toggle" onClick={() => toggleSettingsProperty("darkMode")}>
                                    <span className="icon">
                                        {settings.darkMode ?
                                            <DarkModeOutlinedIcon /> :
                                            < LightModeOutlinedIcon />}
                                    </span>
                                    <span>Theme - {settings.darkMode ? "Dark" : "Light"}</span>
                                </div>

                                <div className="toggle last" onClick={() => toggleSettingsProperty("showReload")}>
                                    <span className="icon">
                                        {settings.showReload ?
                                            <VisibilityOutlinedIcon /> :
                                            < VisibilityOffOutlinedIcon />}
                                    </span>
                                    <span>Reload Buttons - {settings.showReload ? "Showing" : "Hidden"}</span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="settings_block">
                                <h3 className="sub_name">Information</h3>

                                <p className="info_text">v.0.0.1</p>

                                <div className="divider" />

                                <p className="info_text">© 2023 - {year}, Eduard Kechyan.</p>
                                <p className="info_text">All Rights Reserved.</p>
                            </div>
                        </>
                    }

                    {/* Import Input */}
                    <input
                        type="file"
                        className="setting_import_input"
                        ref={importInputRef}
                        onChange={event => importData(event)} />
                </div>
            </div>
        </>
    )
}
