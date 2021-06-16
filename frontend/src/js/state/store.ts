import { configureStore, getDefaultMiddleware, AnyAction, combineReducers } from '@reduxjs/toolkit'
import metadataReducer from './metadata'

import { createEpicMiddleware, Epic } from 'redux-observable'

import { api } from '../utils'
import { fetch_metadata, update_metadata, add_metadata, delete_metadata, edit_metadata } from './metadata'
import { combineEpics } from "redux-observable"

import { from } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'

import APP_URLS from '../urls'
const reducer = combineReducers({
    metadata: metadataReducer
});

export type MyState = ReturnType<typeof reducer>
export type MyEpic = Epic<AnyAction, AnyAction, MyState>

export const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, MyState>();

const addMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadata.match),
        mergeMap(action =>
            from(api.post(`/api/metadata/`,{
                name: action.payload.name,
                type_id : action.payload.type_id
            })).pipe(
                map(_res => fetch_metadata())
            ),
        ),
    )

const editMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadata.match),
        mergeMap(action =>
            from(api.post(`/api/metadata/${action.payload.type_id}/`,{
                name: action.payload.name,
                type_id : action.payload.type_id
            })).pipe(
                map(_res => fetch_metadata())
            ),
        ),
    )

const deleteMetaEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadata.match),
        mergeMap(action =>
            from(api.delete(`/api/metadata/${action.payload.type_id}/`)).pipe(
                map(_res => fetch_metadata())
            ),
        ),
    )

    /*Example code for reference
    const btcEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_btc.match),
        mergeMap(_ =>
            from(api.get("https://api.coindesk.com/v1/bpi/currentprice.json")).pipe(
                map(res => update_btc(res.data))
            ),
        ),
    )
    */

const metadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadata.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.METADATA_BY_TYPE)).pipe(
                map(res => update_metadata(res.data))
            )
        ),
    )

const epics = combineEpics(
    addMetaEpic,
    metadataEpic,
    editMetaEpic,
    deleteMetaEpic
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
