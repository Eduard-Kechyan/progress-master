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
    setTasks,
    setCurrentTasks,
    // Other
    setLoading,
    setCurrent
} from '../store/mainSlice';
import store from '../store/store';
import { v4 as uuid } from "uuid";

import UTIL from './utilities';

const getIdsOfChildrenToRemove = (tasks, newTaskId) => {
    let foundTasks = [];

    function findTasks(taskId) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].parentId === taskId) {
                foundTasks.push({
                    id: tasks[i].id,
                    checked: false
                });
            }
        }
    }

    findTasks(newTaskId);

    for (let i = 0; i < foundTasks.length; i++) {
        // eslint-disable-next-line
        if (!foundTasks[i].checked && tasks.some(task => task.parentId === foundTasks[i].id)) {
            // eslint-disable-next-line
            foundTasks = foundTasks.map(task => {
                if (task.id === foundTasks[i].id) {
                    return {
                        id: task.id,
                        checked: true
                    }
                }

                return task;
            });

            findTasks(foundTasks[i].id);
        }
    }

    return foundTasks.map(task => {
        return task.id
    });
}

const DATA = {
    // Project
    addProject: (name, accent) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            if (store.getState().main.projects.some(e => e.name === name)) {
                reject("exists");
                store.dispatch(setLoading(false));
                return;
            }

            let newProjectData = {
                id: uuid(),
                name: name,
                percent: 0,
                completed: 0,
                children: [],
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
    editProject: (projectId, newProject) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            if (store.getState().main.projects.some(e => {
                if (e.name === newProject.name && e.id !== projectId) {
                    return e;
                }

                return null;
            })) {
                reject("exists");
                store.dispatch(setLoading(false));
                return;
            }

            let project = store.getState().main.projects.find(e => e.id === projectId);

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
    removeProject: (projectId) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            store.dispatch(removeProject(projectId));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                store.dispatch(setLoading(false));

                DATA.updateCurrent(projectId);

                DATA.removeProjectTasks(projectId);

                resolve();
            }).catch((error) => {
                console.log(error);
                store.dispatch(setLoading(false));
                reject(error);
            });
        });
    },
    updateProjectData: (projectId) => {
        //  let project = store.getState().main.projects.find(e => e.id === projectId);
        // let tasks = store.getState().main.tasks.find(e => e.projectId === projectId);












        /* let project = store.getState().main.projects.find(e => e.id === projectId);
 
         let newProject = updatePercentages(project);
 
         DATA.editProject(projectId, newProject);*/

        // DATA.updateCurrent(projectId, true);

        //task.count




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
    getProjectOrder: (projectId, currentId) => {
        let tasks = store.getState().main.tasks.filter(e => e.projectId === projectId && e.parentId === currentId).length;

        return tasks;
    },
    getProject: (projectId) => {
        return new Promise((resolve, reject) => {
            let project = store.getState().main.projects.find(e => e.id === projectId);

            resolve(project);
        })
    },
    getProjects: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem('projects').then((value) => {
                if (value === null) {
                    localForage.setItem('projects', []).then(() => {
                        resolve([]);
                    }).catch((error) => {
                        console.log(error);

                        reject(error);
                    });
                } else {
                    store.dispatch(setProjects(value));

                    resolve(value);
                }
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        });
    },

    // Task
    addTask: (projectId, currentId, name, desc, isProject) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let newTaskData = {
                projectId: projectId,
                parentId: currentId,
                id: uuid(),
                name: name,
                desc: desc,
                order: DATA.getProjectOrder(projectId, currentId),
                children: [],
                percent: 0,
                completed: 0
            }

            if (isProject) {
                let project = store.getState().main.projects.find(e => e.id === projectId);

                DATA.editProject(projectId, { children: [...project.children, newTaskData.id] });
            } else {
                let task = store.getState().main.tasks.find(e => e.id === currentId);

                DATA.editTask(currentId, { children: [...task.children, newTaskData.id] });
            }

            store.dispatch(addTask(newTaskData));

            localForage.setItem("tasks", store.getState().main.tasks).then(() => {
                store.dispatch(setLoading(false));

                resolve();

                DATA.updateProjectData(projectId);
            }).catch((error) => {
                store.dispatch(setLoading(false));
                console.log(error);
                reject(error);
            });
        });
    },
    editTask: (taskId, editedTask) => {
        // TODO - This function doesn't remove the removed task id from it's parent's children array
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let task = store.getState().main.tasks.find(e => e.id === taskId);

            let newTask = { ...task, ...editedTask };

            store.dispatch(editTask(newTask));

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
    removeTask: (projectId, currentId, taskId, isProject) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let idsOfChildrenToRemove = getIdsOfChildrenToRemove(store.getState().main.tasks, taskId);

            idsOfChildrenToRemove.push(taskId);

            let tasks = store.getState().main.tasks.filter((el) => !idsOfChildrenToRemove.includes(el.id));

            if (isProject) {
                let project = store.getState().main.projects.find(e => e.id === projectId);

                let newChildren = project.children.filter(task => task !== taskId);

                DATA.editProject(projectId, { children: newChildren });
            } else {
                let task = store.getState().main.tasks.find(e => e.id === currentId);

                let newChildren = task.children.filter(task => task !== taskId);

                DATA.editTask(currentId, { children: newChildren });
            }

            store.dispatch(setTasks(tasks));

            localForage.setItem('tasks', store.getState().main.tasks).then(() => {
                store.dispatch(setLoading(false));

                DATA.setTasksOrder(projectId);

                DATA.updateProjectData(projectId);

                resolve();
            }).catch((error) => {
                store.dispatch(setLoading(false));

                console.log(error);

                reject(error);
            });
        });
    },
    removeProjectTasks: (projectId) => {
        let tasks = store.getState().main.tasks.filter(e => e.projectId !== projectId);

        store.dispatch(setTasks(tasks));

        localForage.setItem('tasks', store.getState().main.tasks).catch((error) => {
            console.log(error);
        });
    },
    toggleTask: (projectId, taskId) => {
        let task = store.getState().main.currentTasks.find(e => e.id === taskId);

        let newTasks = {
            ...task,
            completed: !task.completed,
            percent: task.completed ? 0 : 100
        };

        DATA.editTask(taskId, newTasks);

        DATA.updateProjectData(projectId);
    },
    setTaskPercent: (projectId, taskId, newPercent) => {
        let task = store.getState().main.tasks.find(e => e.id === taskId);

        let roundedPercent = Math.floor(newPercent);

        let newTasks = {
            ...task,
            completed: roundedPercent === 0 ? false : roundedPercent === 100 ? true : task.completed,
            percent: roundedPercent
        };

        DATA.editTask(taskId, newTasks);

        DATA.updateProjectData(projectId);
    },
    setTasksOrder: (projectId) => {
        let chosenTasks = store.getState().main.tasks.filter(e => e.projectId === projectId);
        let otherTasks = store.getState().main.tasks.filter(e => e.projectId !== projectId);

        let newChosenTasks = UTIL.sortByOrder(chosenTasks);

        for (let i = 0; i < newChosenTasks.length; i++) {
            otherTasks.push({
                ...newChosenTasks[i],
                order: i
            });
        }

        store.dispatch(setTasks(otherTasks));

        localForage.setItem("tasks", store.getState().main.tasks).catch((error) => {
            console.log(error);
        });
    },
    orderTasks: (currentId, newTasks) => {
        let otherTasks = store.getState().main.tasks.filter(e => e.parentId !== currentId);

        for (let i = 0; i < newTasks.length; i++) {
            otherTasks.push(newTasks[i]);
        }

        store.dispatch(setTasks(otherTasks));

        store.dispatch(setCurrentTasks(newTasks));

        localForage.setItem("tasks", store.getState().main.tasks).then(value => {
            store.dispatch(setTasks(value));
        }).catch((error) => {
            console.log(error);
        });
    },
    getTask: (taskId) => {
        return new Promise((resolve, reject) => {
            let task = store.getState().main.tasks.find(e => e.id === taskId);

            resolve(task);
        })
    },
    getTasks: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem("tasks").then((value) => {
                if (value === null) {
                    localForage.setItem("tasks", []).then(() => {
                        resolve([]);
                    }).catch((error) => {
                        console.log(error);

                        reject(error);
                    });
                } else {
                    store.dispatch(setTasks(value));

                    resolve(value);
                }
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        });
    },
    setTasks: (currentId) => {
        return new Promise((resolve, reject) => {
            let tasks = UTIL.sortByOrder(store.getState().main.tasks.filter(e => e.parentId === currentId));

            store.dispatch(setCurrentTasks(tasks));

            resolve();
        })
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
    updateCurrent: (id, alt, total) => {
        if (alt) {
            let project = store.getState().main.projects.find(e => e.id === id);

            DATA.setCurrent({
                ...project
            });

            DATA.setCurrent({
                ...project,
                total: total
            });
        } else {
            if (id === store.getState().main.current.id && store.getState().main.projects.length > 0) {
                let project = store.getState().main.projects[0];

                const { tasks, ...filteredProject } = project;

                DATA.setCurrent({
                    ...filteredProject,
                    total: total
                });
            } else {
                DATA.setCurrent({
                    id: "",
                    name: "",
                    accent: "",
                    desc: "",
                    percent: 0,
                    completed: 0,
                    total: 0,
                });
            }
        }
    },

    // Settings
    importProjects: (importData) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setProjects(importData));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                resolve();
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        })
    },
    importTasks: (importData) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setTasks(importData));

            localForage.setItem('tasks', store.getState().main.tasks).then(() => {
                resolve();
            }).catch((error) => {
                console.log(error);

                reject(error);
            });
        })
    },
    clearData: () => {
        return new Promise((resolve, reject) => {
            localForage.clear().then(() => {
                DATA.getProjects();
                DATA.getTasks();
                DATA.updateCurrent("", false);

                resolve();
            }).catch((error) => {
                console.log(error);

                reject();
            });
        })
    },

    // Other
    mainLoaded: () => {
        store.dispatch(setLoading(false));
    },
    toggleLoading: (value) => {
        if (value === undefined || value === null) {
            let loading = store.getState().main.loading;

            store.dispatch(setLoading(!loading));
        } else {
            store.dispatch(setLoading(value));
        }
    },
};

export default DATA;