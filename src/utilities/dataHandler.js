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
    setCurrent,
    setBreadcrumbs,
    setSettings,
} from '../store/mainSlice';
import store from '../store/store';
import { v4 as uuid } from "uuid";

import UTIL from './utilities';

/*const updateProjectPercent = (oldChildren, oldTasks) => {
    const setPercent = (children, tasks) => {
        let currentPercentages = [];

        for (let i = 0; i < children.length; i++) {
            console.log(children[i]);
            let tempTasks = tasks.find(task => task.id === children[i]);

            if (tempTasks.children.length > 0) {
                currentPercentages = [...currentPercentages, ...setPercent(tempTasks.children, oldTasks)];
            } else {
                currentPercentages.push({
                    id: tempTasks.id,
                    percent: tempTasks.percent
                });
            }
        }

        return currentPercentages;
    }

    let newTasks = setPercent(oldChildren, oldTasks);

    return newTasks;
};*/

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
                isCompleted: false,
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

                DATA.updateCurrent(projectId, true);

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
                //store.dispatch(setLoading(false));

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
    updateProjectData: (projectId, taskId, currentId = "") => {
        const updatePercent = (parentId) => {
            let tasks = store.getState().main.tasks.filter(e => e.projectId === projectId);
            let parentData = tasks.find(task => task.id === parentId);
            let percent = 0;
            let finalPercent = 0;

            if (parentData === undefined) {
                parentData = store.getState().main.projects.find(project => project.id === projectId);
            }

            for (let i = 0; i < parentData.children.length; i++) {
                percent += tasks.find(task => task.id === parentData.children[i]).percent;
            }

            if (parentData.children.length > 0) {
                finalPercent = UTIL.round((100 / (parentData.children.length * 100)) * percent);
            }

            let newData = {
                percent: finalPercent,
                isCompleted: finalPercent === 100 ? true : false
            };

            if (parentData.parentId === undefined) {
                DATA.editProject(projectId, newData);
            } else {
                DATA.editTask(parentData.id, newData);

                updatePercent(parentData.parentId);
            }
        };

        if (taskId !== undefined) {
            updatePercent(taskId);
        } else if (currentId !== "") {
            updatePercent(currentId);
        }
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
    addTask: (projectId, currentId, name, desc, tag, isProject) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setLoading(true));

            let newTaskData = {
                projectId: projectId,
                parentId: currentId,
                id: uuid(),
                name: name,
                tag: tag,
                desc: desc,
                order: DATA.getProjectOrder(projectId, currentId),
                children: [],
                percent: 0,
                isCompleted: false
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

                DATA.updateProjectData(projectId, newTaskData.id);

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

            let idsOfChildrenToRemove = DATA.getIdsOfChildrenToRemove(store.getState().main.tasks, taskId);

            idsOfChildrenToRemove.push(taskId);

            let tasks = store.getState().main.tasks.filter((el) => !idsOfChildrenToRemove.includes(el.id));

            if (isProject) {
                let project = store.getState().main.projects.find(e => e.id === projectId);

                let newChildren = project.children.filter(task => task !== taskId);

                DATA.editProject(projectId, { children: newChildren });
            } else {
                let task = store.getState().main.tasks.find(e => e.id === currentId);

                let newChildren = task.children.filter(task => task !== taskId);

                tasks = tasks.map(task => {
                    if (task.id === currentId) {
                        return {
                            ...task,
                            children: newChildren
                        }
                    } else {
                        return task;
                    }
                });
            }

            store.dispatch(setTasks(tasks));

            localForage.setItem('tasks', store.getState().main.tasks).then(() => {
                store.dispatch(setLoading(false));

                DATA.setTasksOrder(projectId);

                DATA.updateProjectData(projectId, {}, currentId);

                DATA.updateCurrent(projectId, true);

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

        let newTask = {
            ...task,
            isCompleted: !task.isCompleted,
            percent: task.isCompleted ? 0 : 100
        };

        DATA.editTask(taskId, newTask).then(() => {
            DATA.updateProjectData(projectId, newTask.parentId);

            DATA.updateCurrent(projectId, true);
        });
    },
    setTaskPercent: (projectId, taskId, newPercent) => {
        let task = store.getState().main.tasks.find(e => e.id === taskId);

        let roundedPercent = Math.floor(newPercent);

        let newTask = {
            ...task,
            isCompleted: roundedPercent === 100 ? true : false,
            percent: roundedPercent
        };

        DATA.editTask(taskId, newTask).then(() => {
            DATA.updateProjectData(projectId, newTask.parentId);

            DATA.updateCurrent(projectId, true);
        });
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
    CheckTaskCompletedCount: (projectId, taskId, isProject) => {
        let count = 0;

        let children;

        if (isProject) {
            children = store.getState().main.projects.find(e => e.id === projectId).children;
        } else {
            children = store.getState().main.tasks.find(e => e.id === taskId).children;
        }

        for (let i = 0; i < children.length; i++) {
            let task = store.getState().main.tasks.find(e => e.id === children[i]);

            if (task.isCompleted) {
                count++;
            }
        }

        return count;
    },

    // Current
    setCurrent: (currentProject) => {
        const { children, ...newProject } = currentProject;

        localForage.setItem('current', newProject).then(() => {
            let stats = DATA.getCurrentStats(newProject.id);

            store.dispatch(setCurrent({
                ...newProject,
                total: stats.total,
                isCompleted: stats.isCompleted,
            }));
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
    updateCurrent: (projectId, alt = false) => {
        if (alt) {
            if (projectId === store.getState().main.current.id) {
                let project = store.getState().main.projects.find(e => e.id === projectId);

                let stats = DATA.getCurrentStats(projectId);

                const { children, ...newProject } = project;

                DATA.setCurrent({
                    ...newProject,
                    total: stats.total,
                    isCompleted: stats.isCompleted,
                });
            }
        } else {
            if (projectId === store.getState().main.current.id && store.getState().main.projects.length > 0) {
                let project = store.getState().main.projects[0];

                const { children, ...filteredProject } = project;

                let stats = DATA.getCurrentStats(projectId);

                DATA.setCurrent({
                    ...filteredProject,
                    total: stats.total,
                    isCompleted: stats.isCompleted,
                });
            } else {
                DATA.setCurrent({
                    id: "",
                    name: "",
                    accent: "",
                    desc: "",
                    percent: 0,
                    isCompleted: 0,
                    total: 0,
                });
            }
        }
    },
    getCurrentStats: (projectId) => {
        let isCompleted = 0;

        let tasks = store.getState().main.tasks.filter(task => task.projectId === projectId);

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].isCompleted) {
                isCompleted++;
            }
        }

        return {
            total: tasks.length,
            isCompleted: isCompleted
        }
    },

    // Settings
    importProjects: (importData) => {
        return new Promise((resolve, reject) => {
            store.dispatch(setProjects(importData));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                if (importData.length === 1) {
                    DATA.updateCurrent(importData[0].id, true);
                }

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
                DATA.updateCurrent("");

                resolve();
            }).catch((error) => {
                console.log(error);

                reject();
            });
        })
    },

    // Other
    mainLoaded: () => {
        setTimeout(() => {
            store.dispatch(setLoading(false));
        }, 200);
    },
    toggleLoading: (value) => {
        return new Promise((resolve, reject) => {
            if (value === undefined || value === null) {
                let loading = store.getState().main.loading;

                store.dispatch(setLoading(!loading));
            } else {
                store.dispatch(setLoading(value));
            }

            resolve();
        })
    },
    getIdsOfChildrenToRemove: (tasks, newTaskId) => {
        let foundTasks = [];

        const findTasks = (taskId) => {
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
    },
    addCrumbs: (newCrumb) => {
        let breadcrumbs = store.getState().main.breadcrumbs;

        store.dispatch(setBreadcrumbs([...breadcrumbs, newCrumb]));
    },
    removeCrumbs: (crumbsIdsToRemove) => {
        let breadcrumbs = store.getState().main.breadcrumbs;
        let newBreadcrumbs = [];

        newBreadcrumbs = breadcrumbs.filter(crumb => !crumbsIdsToRemove.find(toRemove => (toRemove.id === crumb.id)))

        store.dispatch(setBreadcrumbs(newBreadcrumbs));
    },
    setCrumbs: (newCrumb) => {
        store.dispatch(setBreadcrumbs([newCrumb]));
    },
    getSettings: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem('settings').then((value) => {
                if (value !== null) {
                    store.dispatch(setSettings(value));
                }

                resolve();
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    },
    setSettings: (newSettings) => {
        return new Promise((resolve, reject) => {
            let settings = store.getState().main.settings;

            store.dispatch(setSettings({ ...settings, ...newSettings }));

            localForage.setItem('settings', store.getState().main.settings).then(() => {
                resolve();
            }).catch((error) => {
                console.log(error);
                reject(error);
            });
        });
    },
    getBg: () => {

    },
};

export default DATA;