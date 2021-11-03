import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';

// Imports: Redux
import rootReducer from '../reducers/index';

// Middleware: Redux Thunk (Async/Await)
const middleware = [thunk];



// Middleware: Redux Persist Config
const persistConfig = {
    // Root?
    key: 'root',
    // Storage Method (React Native)
    storage: AsyncStorage,
    // Whitelist (Save Specific Reducers)
    whitelist: [
        'authReducer',
    ],
    // Blacklist (Don't Save Specific Reducers)
    blacklist: [
        'counterReducer',
    ],
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux: Store
const store = createStore(
    persistedReducer,
    applyMiddleware(...middleware),
);

// Middleware: Redux Persist Persister
let persistor = persistStore(store);

// Exports
export {
    store,
    persistor,
};
