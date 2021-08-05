//Importing from outside the project
import {
    configureStore,
    getDefaultMiddleware,
    combineReducers,
    AnyAction,
} from '@reduxjs/toolkit'
import { createEpicMiddleware } from "redux-observable"

//Importing from other files in the project
import globalReducer from './global'
import metadataReducer from './metadata'
import contentReducer, {
    // Imported for exclusion from Redux serialization check
    add_content,
    edit_content,
} from './content'

import epics from './epics';

const reducer = combineReducers({
    global: globalReducer,
    metadata: metadataReducer,
    content: contentReducer,
});

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, MyState>();

const store = configureStore({
    reducer,
    middleware: [
        ...getDefaultMiddleware({
            thunk: false,
            serializableCheck: {
                // May include Files, hence serialization check
                // should be ignored for these actions
                ignoredActions: [
                    add_content.type,
                    edit_content.type,
                ],
            },
        }),
        epicMiddleware,
    ],
})

epicMiddleware.run(epics)

export default store
export type RootState = ReturnType<typeof store.getState>
export type MyState = ReturnType<typeof reducer>
export type Dispatch = typeof store.dispatch
