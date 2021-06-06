import { configureStore, getDefaultMiddleware, AnyAction, combineReducers } from '@reduxjs/toolkit'
import metadataReducer from './metadata'
import { metadataSlice } from './metadata'

import { createEpicMiddleware, Epic } from 'redux-observable'
import { from } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'
import { api } from '../utils'

const reducer = combineReducers({
    metadata: metadataReducer
});

export type MyState = ReturnType<typeof reducer>
export type MyEpic = Epic<AnyAction, AnyAction, MyState>

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, MyState>();

const metadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(metadataSlice.actions.fetch_metadata.match),
        mergeMap(_ =>
            from(api.get("https://api.coindesk.com/v1/bpi/currentprice.json"))
                .pipe(map(res => metadataSlice.actions.update_btc(res.data))),
        ),
    )

const store = configureStore({
    reducer,
    middleware: [
        ...getDefaultMiddleware({ thunk: false }),
        epicMiddleware,
    ],
})

epicMiddleware.run(metadataEpic)

export default store
export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
