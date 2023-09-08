import { Actions } from "./actionHandlers";

const initialState = {
    loading: {
        user: true
    },
    user: {},
    settings: {},
    error: {
        source: '',
        message: ''
    },
    milestone: {
        name: '',
        desc: ''
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        //Data
        case Actions.SET_DATA:
            return {
                ...state,
                [action.property]: action.data,
            };

        //Settings
        case Actions.SET_SETTINGS:
            return {
                ...state,
                settings: { ...action.settings },
            };

        //Loading
        case Actions.START_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.property]: true,
                },
            };
        case Actions.STOP_LOADING:
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.property]: false,
                },
            };

        //Error
        case Actions.SET_ERROR:
            return {
                ...state,
                error: {
                    source: action.source,
                    message: action.message,
                },
            };
        case Actions.CLEAR_ERROR:
            return {
                ...state,
                error: {
                    source: "",
                    message: "",
                },
            };

        //Milestone
        case Actions.SET_MILESTONE:
            return {
                ...state,
                milestone: {
                    name: action.name,
                    desc: action.desc,
                },
            };
        case Actions.CLEAR_MILESTONE:
            return {
                ...state,
                milestone: {
                    name: '',
                    desc: ''
                },
            };

        default:
            return state;
    }
};

export default reducer;
