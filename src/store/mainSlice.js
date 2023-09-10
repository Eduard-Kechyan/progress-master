import { createSlice } from '@reduxjs/toolkit'

export const mainSlice = createSlice({
    name: 'projects',
    initialState: {
        loading: true,
        projects: [],
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
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        addProject: (state, action) => {
            state.projects.push(action.payload);
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(e => e.id !== action.payload)
        },
        setProjects: (state, action) => {
            state.projects = action.payload;
        },
        setCurrent: (state, action) => {
            state.current = action.payload;
        },
    },
})

export const { setLoading, addProject, removeProject, setProjects, setCurrent } = mainSlice.actions;

export default mainSlice.reducer;