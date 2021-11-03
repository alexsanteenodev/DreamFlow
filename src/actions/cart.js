




export const setCartWarehouse = (payload) =>(
    {
        type: 'WAREHOUSE_CART',
        payload: payload,
    }
);
export const setCartSupply = (payload) =>(
    {
        type: 'SUPPLY_CART',
        payload: payload,
    }
);
export const setOrderId = (payload) =>(
    {
        type: 'ORDER_ID',
        payload: payload,
    }
);
