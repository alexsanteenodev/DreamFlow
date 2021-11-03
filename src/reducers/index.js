
// Imports: Dependencies
import { combineReducers } from 'redux';

// Imports: Reducers
import authReducer from './authReducer';
import mainReducer from './mainReducer';
import cartReducer from './cartReducer';

// Redux: Root Reducer
const rootReducer = combineReducers({
    authReducer: authReducer,
    cartReducer: cartReducer,
    mainReducer: mainReducer,
});

// Exports
export default rootReducer;
