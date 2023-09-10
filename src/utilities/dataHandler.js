import localForage from "localforage";
import { setLoading, addProject, removeProject, setProjects, setCurrent } from '../store/mainSlice';
import store from '../store/store';
import { v4 as uuid } from "uuid";

const dispatchLoading = (value, quick) => {
    if (value) {
        store.dispatch(setLoading(true));
    } else {
        setTimeout(() => {
            store.dispatch(setLoading(false));
        }, quick ? 0 : 300);
    }
}

const DATA = {
    addProject: (title, accent) => {
        return new Promise((resolve, reject) => {
            dispatchLoading(true);

            if (store.getState().main.projects.some(e => e.title === title)) {
                reject("exists");
                return;
            }

            let newProject = {
                id: uuid(),
                title: title,
                percent: 0,
                completed: 0,
                total: 0,
                desc: "No description, add one by going into the project's page's options",
                accent: accent,
                content: []
            }

            store.dispatch(addProject(newProject));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                dispatchLoading(false);
                resolve(newProject.id);
            }).catch((error) => {
                console.log(error);
                dispatchLoading(false);
                reject(error);
            });
        });
    },
    removeProject: (id) => {
        return new Promise((resolve, reject) => {
            dispatchLoading(true);

            store.dispatch(removeProject(id));

            localForage.setItem('projects', store.getState().main.projects).then(() => {
                dispatchLoading(false);
                DATA.updateCurrent(id);
                resolve();
            }).catch((error) => {
                console.log(error);
                dispatchLoading(false);
                reject(error);
            });
        });
    },
    getProjects: () => {
        return new Promise((resolve, reject) => {
            localForage.getItem('projects').then((value) => {
                if (value === null) {
                    localForage.setItem('projects', []).then(() => {
                        dispatchLoading(false);
                        resolve();
                    }).catch((error) => {
                        console.log(error);
                        dispatchLoading(false);
                        reject(error);
                    });
                } else {
                    store.dispatch(setProjects(value));
                    dispatchLoading(false);
                    resolve();
                }
            }).catch((error) => {
                console.log(error);
                dispatchLoading(false);
                reject(error);
            });
        });
    },
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
    updateCurrent: (id) => {
        if (id === store.getState().main.current.id) {
            console.log("A");
            if (store.getState().main.projects.length > 0) {
                let project = store.getState().main.projects[0];
                console.log("B");

                DATA.setCurrent({
                    id: project.id,
                    title: project.title,
                    accent: project.accent,
                    desc: project.desc,
                    percent: project.percent
                });
            } else {
                console.log("C");
                DATA.setCurrent({
                    id: "",
                    title: "",
                    accent: "",
                    desc: "",
                    percent: 0
                });
            }
        }
    }
};

export default DATA;