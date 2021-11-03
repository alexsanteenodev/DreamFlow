

export const setUserData = (payload) =>(
    {
        type: 'SET_USER_DATA',
        payload: payload,
    }
);

export const setToken = (payload) =>(
    {
        type: 'AUTH_TOKEN',
        payload: payload,
    }
);
export const setPermissions = (payload) =>(
    {
        type: 'AUTH_PERMISSIONS',
        payload: payload,
    }
);
