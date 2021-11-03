

export const setWorkingOrder = (payload) =>(
    {
        type: 'WORK_ORDER',
        payload: payload,
    }
);
export const setWarehouseProducts = (payload) =>(
    {
        type: 'SET_WAREHOUSE_PRODUCTS',
        payload: payload,
    }
);
export const addSupplyProducts = (payload) =>(
    {
        type: 'ADD_SUPPLY_PRODUCTS',
        payload: payload,
    }
);
export const setSupplyProducts = (payload) =>(
    {
        type: 'SET_SUPPLY_PRODUCTS',
        payload: payload,
    }
);
export const setSupplyProduct = (payload) =>(
    {
        type: 'SET_SUPPLY_PRODUCT',
        payload: payload,
    }
);
