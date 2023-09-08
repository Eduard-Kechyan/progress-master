import { Actions } from "./actionHandlers";

//Data

export const setData = (property, data, fun) => {
    return (dispatch) => {
        dispatch({
            type: Actions.SET_DATA,
            property: property,
            data: data,
        });

        if (fun !== undefined) {
            fun();
        }
    };
};

//Settings
export const setSettings = (settings, fun) => {
    return (dispatch) => {
        dispatch({
            type: Actions.SET_SETTINGS,
            settings: settings,
        });

        if (fun !== undefined) {
            fun();
        }
    };
};

//Loading
export const startLoading = (property, fun, delay) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: Actions.START_LOADING,
                property: property,
            });

            if (fun !== undefined) {
                fun();
            }
        }, delay === undefined ? 0 : delay);
    };
};

export const stopLoading = (property, fun, delay) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch({
                type: Actions.STOP_LOADING,
                property: property,
            });

            if (fun !== undefined) {
                fun();
            }
        }, delay === undefined ? 0 : delay);
    };
};

//Error
const handleErorCodes = (message, status) => {
    switch (message) {
        case "ERR_NETWORK": {
            return "Couldn't connect to the server!";
        }
        case "ERR_BAD_REQUEST": {
            return status.message + " - [" + status.code + "]";
        }
        default: {
            return "Unknown Error! Check console!"
        }
    }
}

export const setError = (source, message, status) => {
    let newMessage = '';

    if (status !== undefined) {
        newMessage = handleErorCodes(message, status);
    } else {
        newMessage = message;
    }

    return (dispatch) => {
        dispatch({
            type: Actions.SET_ERROR,
            source: source,
            message: newMessage,
        });
    };
};

export const clearError = () => {
    return (dispatch) => {
        dispatch({
            type: Actions.CLEAR_ERROR,
        });
    };
};

//Milstone
export const setMilstone = (name, desc) => {
    return (dispatch) => {
        dispatch({
            type: Actions.SET_MILESTONE,
            name: name,
            desc: desc,
        });
    };
};

export const clearMilstone = () => {
    return (dispatch) => {
        dispatch({
            type: Actions.CLEAR_MILESTONE,
        });
    };
};