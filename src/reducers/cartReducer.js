// Initial State
const initialState = {
    supplyItems: {},
    warehouseItems: {},
    orderId: false,
};

// Reducers (Modifies The State And Returns A New State)
const cartReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SUPPLY_CART': {
            return {
                // State
                ...state,
                // Redux Store
                supplyItems: action.payload,
            }
        }
        case 'WAREHOUSE_CART': {
            return {
                // State
                ...state,
                // Redux Store
                warehouseItems: action.payload,
            }
        }
        case 'ORDER_ID': {
            return {
                // State
                ...state,
                // Redux Store
                orderId: action.payload,
            }
        }
        // Default
        default: {
            return state;
        }
    }
};

// Exports
export default cartReducer;
