// Initial State
const initialState = {
    workingOrder: false,
    warehouseProducts: [],
    supplyProducts: [],
};

// Reducers (Modifies The State And Returns A New State)
const mainReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'WORK_ORDER': {
            return {
                // State
                ...state,
                // Redux Store
                workingOrder: action.payload,
            }
        }
        case 'SET_WAREHOUSE_PRODUCTS': {
            return {
                // State
                ...state,
                // Redux Store
                warehouseProducts: action.payload,
            }
        }
        case 'SET_SUPPLY_PRODUCTS': {
            return {
                // State
                ...state,
                // Redux Store
                supplyProducts: action.payload,
            }
        }
        case 'SET_SUPPLY_PRODUCT' :{


            let product = action.payload;


            newProducts = state.supplyProducts.map((item)=>{
                if(item.product_id=== product.product_id){
                    item = product;
                }
                return item;
            });


            return {
                ...state,
                supplyProducts: newProducts
            };
        }
        case 'ADD_SUPPLY_PRODUCTS' :


            let product = action.payload;

            let newProducts = [];

            if(state.supplyProducts.find(x => x.product_id ===product.product_id)){
                newProducts = state.supplyProducts.map((item)=>{
                    if(item.product_id=== product.product_id){
                        item.quantity = parseInt(item.quantity)+parseInt(product.quantity);
                    }
                    return item;
                })
            }else{
                 newProducts = [...state.supplyProducts, product];
            }

            return {
                ...state,
                supplyProducts: newProducts
            };
        // Default
        default: {
            return state;
        }
    }
};

// Exports
export default mainReducer;
