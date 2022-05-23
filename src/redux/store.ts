import { createStore, applyMiddleware } from "redux";
import Thunk from "redux-thunk";
import storage from 'redux-persist/lib/storage'
import { persistStore, persistReducer } from 'redux-persist';

import { rootReducers } from "./rootReducers";

const persistConfig = {
    key: 'root',
    storage: storage,
    whitelist: ['intl', 'auth', 'utilityReducer']
}

const persistedReducer = persistReducer(persistConfig, rootReducers)

let store = createStore(persistedReducer, applyMiddleware(Thunk))
let persistor = persistStore(store)
export { store, persistor };