import localForage from "localforage";
import {
    // Projects
    addProject,
    editProject,
    removeProject,
    setProjects,
    // Tasks
    addTask,
    editTask,
    removeTask,
    setTasks,
    setCurrentTasks,
    // Other
    setLoading,
    setCurrent
} from '../store/mainSlice';
import store from '../store/store';
import { v4 as uuid } from "uuid";

/*const round = (value) => {
    let multiplier = Math.pow(10, 1 || 0);
    return Math.round(value * multiplier) / multiplier;
}
*/

const editTaskFromTask = (array, currentId, editId, editedItem) => {
    return array.map(task => {
        if (task.id === currentId) {
            if (editId === "") {
                return {
                    ...task,
                    ...editedItem,
                };
            } else {
                let newTask = { ...task };

                newTask.tasks = newTask.tasks.map(e => {
                    if (e.id === editId) {
                        return {
                            ...e,
                            ...editedItem,
                        };
                    }

                    return e;
                });

                return newTask;
            }
        } else if (task.tasks.length > 0) {
            return editTaskFromTask(task.tasks, currentId, editId, editedItem);
        } else {
            return task;
        }
    });
}

const checkToggledFromTask = (array, currentId, toggleId) => {
    return array.map(task => {
        if (task.id === currentId) {
            let newTask = { ...task };
            let isCompleted = false;

            newTask.tasks = newTask.tasks.map(e => {
                isCompleted = !e.completed;

                if (e.id === toggleId) {
                    return {
                        ...e,
                        completed: isCompleted
                    };
                }

                return e;
            });

            newTask.completed = isCompleted ? newTask.completed + 1 : newTask.completed - 1;

            return newTask;
        } else if (task.tasks.length > 0) {
            return editTaskFromTask(task.tasks, currentId, toggleId);
        } else {
            return task;
        }
    });
}

const updatePercentages = (item) => {
    if (item.tasks.length > 0) {
        for (let i = 0; i < item.tasks.length; i++) {
            if (item.tasks[i].tasks.length > 0) {

            } else if (item.tasks[i].completed) {

            }
        }
    } else {
        // TODO - Before resetting "completed" and "percent", 
        // TODO - make sure this was not a single task that is completed, in that case don't reset it
        return {
            ...item,
            completed: 0,
            percent: 0
        }
    }
}

const getIdsOfChildrenToRemove = (tasks, taskId, newIds) => {
    // TODO - Check if this method works
    let foundTasks = newIds;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].parentId === taskId) {
            console.log(tasks[i].name);
            foundTasks.push({
                id: tasks[i].id,
                checked: false
            });
        }
    }

    for (let i = 0; i < foundTasks.length; i++) {
        if (!foundTasks[i].checked && tasks.some(task => task.parentId === foundTasks[i].id)) {
            console.log("A");

            let newFoundTasks = foundTasks.map(task => {
                if (task === foundTasks[i].id) {
                    return {
                        id: task.id,
                        checked: true
                    }
                }

                return task;
            });

            foundTasks = getIdsOfChildrenToRemove(tasks, foundTasks[i].id, newFoundTasks);
        }
    }

    console.log("B");
    return foundTasks;
}

const DATA = {
    // Project
    addProject: (title, accent) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            if (store.getState().main.projects.some(e => e.title === title)) {
                reject("exists");
                store.dispatch(setLoading(false));
                return;
            }

            let newProjectData = {
                id: uuid(),
                title: title,
                percent: 0,
                completed: 0,
                desc: "",
                accent: accent
            }

            store.dispatch(addProject(newProjectData));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                store.dispatch(setLoading(false));
                resolve(newProjectData.id);
            }).catch((error) => {
                console.log(error);
                store.dispatch(setLoading(false));
                reject(error);
            });
        });
    },
    editProject: (id, newProject) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            if (store.getState().main.projects.some(e => {
                if (e.title === newProject.title && e.id !== id) {
                    return e;
                }

                return null;
            })) {
                reject("exists");
                store.dispatch(setLoading(false));
                return;
            }

            let project = store.getState().main.projects.find(e => e.id === id);

            let newProjectData = {
                ...project,
                ...newProject
            }

            store.dispatch(editProject(newProjectData));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                store.dispatch(setLoading(false));

                DATA.setCurrent({
                    ...newProjectData,
                    total: store.getState().main.projects.length
                })

                resolve();
            }).catch((error) => {
                console.log(error);
                store.dispatch(setLoading(false));
                reject(error);
            });
        });
    },
    removeProject: (id) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            store.dispatch(removeProject(id));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                store.dispatch(setLoading(false));

                DATA.updateCurrent(id);

                DATA.removeProjectTasks(id);

                resolve();
            }).catch((error) => {
                console.log(error);
                store.dispatch(setLoading(false));
                reject(error);
            });
        });
    },
    getProjects: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem('projects').then((value) => {
                if (value === null) {
                    localForage.setItem('projects', []).then(() => {
                        resolve();
                    }).catch((error) => {
                        console.log(error);

                        reject(error);
                    });
                } else {
                    store.dispatch(setProjects(value));

                    resolve();
                }
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        });
    },
    getProject: (id) => {
        return new Promise((resolve, reject) => {
            let project = store.getState().main.projects.find(e => e.id === id);

            resolve(project);
        })
    },
    // Task
    addTask: (projectId, currentId, name, desc) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let newTaskData = {
                projectId: projectId,
                parentId: currentId,
                id: uuid(),
                name: name,
                desc: desc,
                percent: 0,
                completed: 0
            }

            store.dispatch(addTask(newTaskData));

            localForage.setItem("tasks", store.getState().main.tasks).then(() => {
                store.dispatch(setLoading(false));

                resolve();

                DATA.updateCurrent(projectId, true);
            }).catch((error) => {
                store.dispatch(setLoading(false));
                console.log(error);
                reject(error);
            });
        });
    },
    editTask: (taskId, editedTask) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let task = store.getState().main.tasks.find(e => e.id === taskId);

            store.dispatch(editTask({ ...task, ...editedTask }));

            localForage.setItem('tasks', store.getState().main.tasks).then(() => {
                store.dispatch(setLoading(false));

                resolve();
            }).catch((error) => {
                console.log(error);
                store.dispatch(setLoading(false));
                reject(error);
            });
        });
    },
    removeTask: (projectId, taskId) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let idsOfChildrenToRemove = getIdsOfChildrenToRemove(store.getState().main.tasks, taskId, []);

            console.log(idsOfChildrenToRemove);

            store.dispatch(setLoading(false));

            /* store.dispatch(removeTask(taskId));
 
             localForage.setItem('tasks', store.getState().main.tasks).then(() => {
                 store.dispatch(setLoading(false));
 
                 DATA.updateCurrent(projectId, true);
                 DATA.updatePercent(projectId);
 
                 resolve();
             }).catch((error) => {
                 store.dispatch(setLoading(false));
 
                 console.log(error);
 
                 reject(error);
             });*/
        });
    },
    removeProjectTasks: (projectId) => {
        let tasks = store.getState().main.tasks.filter(e => e.projectId !== projectId);

        store.dispatch(setTasks(tasks));

        localForage.setItem('tasks', store.getState().main.tasks).catch((error) => {
            console.log(error);
        });
    },
    getTasks: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem("tasks").then((value) => {
                if (value === null) {
                    localForage.setItem("tasks", []).then(() => {
                        resolve();
                    }).catch((error) => {
                        console.log(error);

                        reject(error);
                    });
                } else {
                    store.dispatch(setTasks(value));

                    resolve();
                }
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        });
    },
    setTasks: (projectId) => {
        return new Promise((resolve, reject) => {
            let tasks = store.getState().main.tasks.filter(e => e.parentId === projectId);

            store.dispatch(setCurrentTasks(tasks));

            resolve();
        })
    },
    getTask: (taskId) => {
        return new Promise((resolve, reject) => {
            let task = store.getState().main.tasks.find(e => e.id === taskId);

            resolve(task);
        })
    },
    toggleTask: (projectId, currentId, toggleId) => {
        return new Promise((resolve, reject) => {
            let project = store.getState().main.projects.find(e => e.id === projectId);

            let newTasks = [];

            if (currentId === "") {
                let isCompleted = false;

                newTasks = project.tasks.map(task => {
                    if (task.id === toggleId) {
                        isCompleted = !task.completed;

                        return {
                            ...task,
                            completed: isCompleted
                        };
                    }

                    return task;
                });

                DATA.editProject(projectId, {
                    tasks: newTasks,
                    completed: isCompleted ? project.completed + 1 : project.completed - 1
                });
            } else {
                newTasks = checkToggledFromTask(project.tasks, currentId, toggleId);

                DATA.editProject(projectId, { tasks: newTasks });
            }

            DATA.updatePercentages(projectId);
        });
    },
    // Other
    updatePercentages: (projectId) => {
        let project = store.getState().main.projects.find(e => e.id === projectId);

        let newProject = updatePercentages(project);

        DATA.editProject(projectId, newProject);
    },
    setTaskPercent: (projectId, id, newPercent) => {
        return new Promise((resolve, reject) => {
            // let project = store.getState().main.projects.find(e => e.id === projectId);
            //let task = project.tasks.find(e => e.id === id);

            /* let newTask = {
                 ...task,
                 percent: newPercent,
                 completed: 0
             }*/

            //    store.dispatch(editTask({ projectId: projectId, id: id, newTask: newTask }));

            DATA.updatePercent(projectId);
        });
    },
    // Current
    setCurrent: (current) => {
        localForage.setItem('current', current).then(() => {
            store.dispatch(setCurrent(current));
        }).catch((error) => {
            console.log(error);
        });
    },
    getCurrent: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem('current').then((value) => {
                if (value !== null) {
                    store.dispatch(setCurrent(value));
                }
                resolve();
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    },
    updateCurrent: (id, alt) => {
        if (alt) {
            let project = store.getState().main.projects.find(e => e.id === id);

            DATA.setCurrent({
                ...project
            });

            /* DATA.setCurrent({
                 ...project,
                 total: project.tasks.length
             });*/
        } else {
            if (id === store.getState().main.current.id) {
                if (store.getState().main.projects.length > 0) {
                    let project = store.getState().main.projects[0];

                    const { tasks, ...filteredProject } = project;

                    DATA.setCurrent({
                        ...filteredProject,
                        total: project.tasks.length
                    });
                } else {
                    DATA.setCurrent({
                        id: "",
                        title: "",
                        accent: "",
                        desc: "",
                        percent: 0,
                        completed: 0,
                        total: 0,
                    });
                }
            }
        }
    },
    // Other
    updatePercent: (id) => {
        /*let project = store.getState().main.projects.find(e => e.id === id);

        let completedAmount = 0;

        for (let i = 0; i < project.tasks.length; i++) {
            if (project.tasks[i].completed) {
                completedAmount++;
            }
        }

        let newProject = {
            ...project,
            completed: completedAmount,
            percent: round(completedAmount === 0 ? 0 : (100 / project.tasks.length) * completedAmount)
        }

        DATA.editProject(id, newProject);*/
    },
    mainLoaded: () => {
        store.dispatch(setLoading(false));
    }
};

export default DATA;