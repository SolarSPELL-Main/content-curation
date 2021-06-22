import {
    configureStore, getDefaultMiddleware, AnyAction, combineReducers
} from '@reduxjs/toolkit'
import { combineEpics, createEpicMiddleware, Epic } from "redux-observable"
import { from } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'

import globalReducer from './global'
import metadataReducer from './metadata'

import {
    fetch_metadata, update_metadata, add_metadata, delete_metadata, edit_metadata,
    fetch_metadatatype, update_metadatatype, add_metadatatype,
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

const addMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadata.match),
        mergeMap(action =>
            from(api.post(`/api/metadata/`, {
                name: action.payload.name,
                type: action.payload.type_id
            })).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            ),
        ),
    )

const editMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadata.match),
        mergeMap(action =>
            from(api.patch(`/api/metadata/${action.payload.type_id}/`, {
                name: action.payload.name,
                type: action.payload.new_type_id
            })).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id}))
            ),
        ),
    )

const preloadMetadataEpic: MyEpic = (action$, state$) => action$.pipe(
        filter(preload_all_metadata.match),
        mergeMap(_ =>
            from(state$.value.metadata.metadata_types).pipe(
                mergeMap(type => from(api.get(`/api/metadata_types/${type.id}/metadata/`)).pipe(
                    map(({ data }) => update_metadata({ [type.id]: data.data }))
                ))
            )
        )
    )

const deleteMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadata.match),
        mergeMap(action =>
            from(api.delete(`/api/metadata/${action.payload.type_id}/`)).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            ),
        ),
    )

const fetchMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadata.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.METADATA_BY_TYPE)).pipe(
                map(({ data }) => update_metadata( data.data))
            )
        ),
    )

const addMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadatatype.match),
        mergeMap(action =>
            from(api.post(`/api/metadata_types/`,{
                name: action.payload.name,
            })).pipe(
                map(_res => fetch_metadatatype())
            ),
        ),
    )

const editMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadatatype.match),
        mergeMap(action =>
            from(api.post(`/api/metadata/${action.payload.type_id}/`, {
                name: action.payload.name,
                type_id: action.payload.type_id
            })).pipe(
                map(_res => fetch_metadatatype())
            ),
        )
    )

const deleteMetatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadatatype.match),
        mergeMap(action =>
            from(api.delete(`/api/metadata/${action.payload.type_id}/`)).pipe(
                map(_res => fetch_metadatatype())
            ),
        ),
    )

const metadatatypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadatatype.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.METADATA_TYPES)).pipe(
                map(({ data }) => update_metadatatype(data.data))
            )
        ),
    )

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
