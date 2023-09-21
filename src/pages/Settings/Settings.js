import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from "uuid";
import "./Settings.scss";

import Header from '../../components/Layout/Header';

import DATA from '../../utilities/dataHandler';
import UTIL from '../../utilities/utilities';

export default function Settings(props) {
    const importInputRef = useRef(null);

    const navigate = useNavigate();

    const exportData = () => {
        if (window.confirm("Are you sure you want to export all data? This might take a while!")) {
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
        }
    }

    const clickImportInput = () => {
        if (window.confirm("Warning! Data will be overwritten! Are you sure you want to continue?")) {
            importInputRef.current.value = null;

            importInputRef.current.click();
        }
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
        if (window.confirm("Are you sure you want to clear all data? This can't be undone!")) {
            DATA.clearData().then(() => {
                navigate("/");
                window.location.reload();
            });
        }
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
                    </div>

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
