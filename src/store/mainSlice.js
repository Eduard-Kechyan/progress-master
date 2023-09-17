import { createSlice } from '@reduxjs/toolkit';

export const mainSlice = createSlice({
    name: 'projects',
    initialState: {
        loading: true,
        projects: [],
        tasks: [],
        currentTasks: [],
        current: {
            id: "",
            title: "",
            accent: "",
            desc: "",
            percent: 0,
            completed: 0,
            total: 0,
        }
    },
    reducers: {
        // Projects
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        editProject: (state, action) => {
            state.projects = state.projects.map(e => {
                if (e.id === action.payload.id) {
                    return action.payload;
                } else {
                    return e;
                }
            })
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(e => e.id !== action.payload)
            state.currentTasks = [];
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },

        // Tasks
        addTask: (state, action) => {
            state.tasks.push(action.payload);
            state.currentTasks.push(action.payload);
        },
        editTask: (state, action) => {
            let newTasks = state.tasks.map(e => {
                if (e.id === action.payload.id) {
                    return action.payload;
                } else {
                    return e;
                }
            })

            state.tasks = newTasks;
            state.currentTasks = newTasks;
        },
        removeTask: (state, action) => {
            let newTasks = state.tasks.filter(e => e.id !== action.payload);

            state.tasks = newTasks;
            state.currentTasks = newTasks;
        },
        setTasks: (state, action) => {
            state.tasks = action.payload;
        },
        setCurrentTasks: (state, action) => {
            state.currentTasks = action.payload;
        },

        // Other  
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setCurrent: (state, action) => {
            state.current = action.payload;
        }
    },
})

export const {
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
} = mainSlice.actions;

export default mainSlice.reducer;