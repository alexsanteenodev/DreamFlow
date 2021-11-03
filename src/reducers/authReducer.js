// Initial State
const initialState = {
    authToken: false,
    permissions: false,
    userData: false,
};

// Reducers (Modifies The State And Returns A New State)
const authReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'AUTH_TOKEN': {
            return {
                // State
                ...state,
                // Redux Store
                authToken: action.payload,
            }
        }
        case 'AUTH_PERMISSIONS': {
            return {
                // State
                ...state,
                // Redux Store
                permissions: action.payload,
            }
        }
        case 'SET_USER_DATA': {
            return {
                // State
                ...state,
                // Redux Store
                userData: action.payload,
            }
        }
        // Default
        default: {
            return state;
        }
    }
};

// Exports
export default authReducer;
