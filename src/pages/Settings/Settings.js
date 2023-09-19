import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
        DATA.toggleLoading(true).then(()=>{
            UTIL.readFile(event).then(importData => {
                DATA.getProjects().then((projectsValue) => {
                    DATA.getTasks().then((tasksValue) => {
                        let newImportData = JSON.parse(importData);

                        let newProjects = [];
                        let newTasks = [];

                        newProjects = UTIL.mergeArrays(projectsValue, newImportData.projects);
                        newTasks = UTIL.mergeArrays(tasksValue, newImportData.tasks);

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
            }).catch(()=>{
                DATA.toggleLoading(false);
            })
        });
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
