import {
    configureStore, getDefaultMiddleware, AnyAction, combineReducers
} from '@reduxjs/toolkit'
import { combineEpics, createEpicMiddleware, Epic } from "redux-observable"
import { from } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'

import globalReducer from './global'
import metadataReducer from './metadata'

//import these from './metadata' so they can be used in this file
import {
    fetch_metadata, update_metadata, add_metadata, delete_metadata, 
    edit_metadata, fetch_metadatatype, update_metadatatype, add_metadatatype,
    delete_metadatatype, edit_metadatatype, preload_all_metadata
} from './metadata'

import { api } from '../utils'

import APP_URLS from '../urls'
const reducer = combineReducers({
    metadata: metadataReducer,
    global: globalReducer,
});

export type MyState = ReturnType<typeof reducer>
export type MyEpic = Epic<AnyAction, AnyAction, MyState>

export const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, MyState>();

//Epic to add metadata to the application state
const addMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadata.match),
        mergeMap(action =>
            from(api.post(APP_URLS.METADATA_LIST, {
                name: action.payload.name,
                type: action.payload.type_id
            })).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            ),
        ),
    )

//Epic to edit metadata of the application state
const editMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadata.match),
        mergeMap(action =>
            from(api.patch(APP_URLS.METADATA(action.payload.id), {
                name: action.payload.name,
                type: action.payload.new_type_id
            })).pipe(
                map(({data}) => fetch_metadata({ type_id: data.metadataType.id}))
            ),
        ),
    )

//what the preload metadata epic does is take each metadata type stored in the 
//state and updates the MetadataByType with metadata of that type
const preloadMetadataEpic: MyEpic = (action$, state$) => action$.pipe(
        filter(preload_all_metadata.match),
        mergeMap(_ =>
            from(state$.value.metadata.metadata_types).pipe(
                mergeMap(type => from(api.get(APP_URLS.METADATA_BY_TYPE(type.id))).pipe(
                    map(({ data }) => update_metadata({ [type.id]: data.data }))
                ))
            )
        )
    )

//Epic to delete a metadata from the application state
const deleteMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadata.match),
        mergeMap(action =>
            from(api.delete(APP_URLS.METADATA(action.payload.id))).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            ),
        ),
    )

//Fetch metadata stored in the current application state so it can shown on the 
//screen
const fetchMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadata.match),
        mergeMap(action =>
            from(api.get(APP_URLS.METADATA_BY_TYPE(action.payload.type_id))).pipe(
                map(({ data }) => update_metadata({
                    [action.payload.type_id]: data.data
                }))
            )
        ),
    )

//add a metadata to the application state
const addMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadatatype.match),
        mergeMap(action =>
            from(api.post(APP_URLS.METADATA_TYPES,{
                name: action.payload.name,
            })).pipe(
                map(_res => fetch_metadatatype())
            ),
        ),
    )

//Epic to edit a metadata type in the application state
const editMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadatatype.match),
        mergeMap(action =>
            from(api.patch(APP_URLS.METADATA_TYPE(action.payload.type_id), {
                name: action.payload.name,
            })).pipe(
                map(_res => fetch_metadatatype())
            ),
        )
    )

//Epic to delete a metadata type in the application state
const deleteMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadatatype.match),
        mergeMap(action =>
            from(api.delete(APP_URLS.METADATA_TYPE(action.payload.type_id))).pipe(
                map(_res => fetch_metadatatype())
            ),
        ),
    )

//Epic to fetch metadata type from the application state so it can be displayed
//on the screen
const metadatatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadatatype.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.METADATA_TYPES)).pipe(
                map(({ data }) => update_metadatatype(data.data))
            )
        ),
    )

//Epic to update a metadata type in application state
const updateMetadataTypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(update_metadatatype.match),
        map(_ => preload_all_metadata())
    )

const epics = combineEpics(
    addMetaEpic,
    fetchMetadataEpic,
    editMetaEpic,
    deleteMetaEpic,
    addMetatypeEpic,
    metadatatypeEpic,
    editMetatypeEpic,
    deleteMetatypeEpic,
    preloadMetadataEpic,
    updateMetadataTypeEpic
)

const store = configureStore({
    reducer,
    middleware: [
        ...getDefaultMiddleware({ thunk: false }),
        epicMiddleware,
    ],
})

epicMiddleware.run(epics)

export default store
export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
