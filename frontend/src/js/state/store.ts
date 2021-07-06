//Importing from outside the project
import {
    configureStore, getDefaultMiddleware, AnyAction, combineReducers
} from '@reduxjs/toolkit'
import { combineEpics, createEpicMiddleware, Epic } from "redux-observable"
import { from, /** EMPTY */ } from 'rxjs'
import {
    filter, map, mergeMap, mapTo, delay, /** catchError */
} from 'rxjs/operators'

//Importing from other files in the project
import globalReducer from './global'
import metadataReducer from './metadata'
import contentReducer from './content'
import {
    fetch_user, update_user, show_toast, close_toast, logout
} from './global'
import {
    fetch_metadata, update_metadata, add_metadata, delete_metadata, 
    edit_metadata, fetch_metadatatype, update_metadatatype, add_metadatatype,
    delete_metadatatype, edit_metadatatype, preload_all_metadata
} from './metadata'
import {
    fetch_content,
    update_content,
    add_content,
} from './content'
import { api } from '../utils'
import APP_URLS from '../urls'
import { Content, Metadata } from '../types'

const reducer = combineReducers({
    global: globalReducer,
    metadata: metadataReducer,
    content: contentReducer,
});

export type MyState = ReturnType<typeof reducer>
export type MyEpic = Epic<AnyAction, AnyAction, MyState>

export const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, MyState>();

/** GLOBAL EPICS */
const fetchUserEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_user.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.USER_INFO)).pipe(
                map(({ data }) => update_user(data.data))
            ),
        ),
        // catchError(
        //     _ => 
        //         of({
        //             type: show_toast.type,
        //             payload: 'Error fetching user'
        //         })
        // ),
    )

const logoutEpic: MyEpic = action$ =>
    action$.pipe(
        filter(logout.match),
        mergeMap(_ =>
            from(api.post(APP_URLS.LOGOUT)).pipe(
                mapTo(fetch_user())
            )
        )
    )

//Epic to show the toast message and then outout the close message action after a second of delay
const showToastEpic: MyEpic = action$ =>
    action$.pipe(
        filter(show_toast.match),
        delay(6000),
        map(_ => close_toast()),
        map(_res=> {console.log("toast closed")
        return _res}
        ),
    )

/** METADATA EPICS */
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

/** CONTENT EPICS */
const fetchContentEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_content.match),
        mergeMap(_ =>
            from(api.get(APP_URLS.CONTENT_LIST)).pipe(
                map(({ data }) => 
                    update_content(
                        // Maps API response to Content array
                        data.data.map(
                            (val: any) => <Content>({
                                id: Number(val.id),
                                notes: val.additional_notes,
                                active: val.active,
                                fileURL: val.content_file,
                                copyrighter: val.copyright_by,
                                copyright: val.copyright_notes,
                                copyrightApproved: val.copyright_approved,
                                creator: val.created_by,
                                createdDate: val.created_on,
                                reviewer: val.reviewed_by,
                                description: val.description,
                                fileName: val.file_name,
                                datePublished: val.published_year,
                                rightsStatement: val.rights_statement,
                                title: val.title,
                                // Turns API Metadata array into Record
                                metadata: val.metadata_info.reduce(
                                    (
                                        accum: Record<number,Metadata[]>,
                                        val: any,
                                    ) => {
                                        const key: number = val.type;
                                        const metadata: Metadata = {
                                            id: val.id,
                                            name: val.name,
                                            creator: '',
                                            metadataType: {
                                                name: val.type_name,
                                                id: key,
                                            },
                                        };
                                        return {
                                            ...accum,
                                            [key]: key in accum ?
                                                accum[key].concat(metadata)
                                                : [metadata]
                                        };
                                    },
                                    {} as Record<number,Metadata[]>,
                                ),
                            }),
                        ),
                    ),
                ),
            ),
        ),
    )

const addContentEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_content.match),
        mergeMap(action =>
            {
                const content = action.payload;
                const data = new FormData();
                data.append('file_name', content.fileName);
                data.append('title', content.title);
                // This action should only be called on adding content
                // Hence the file should not be null
                // If it is, an error will be thrown here, anyway
                data.append('content_file', content.file!);
                data.append('description', content.description ?? '');
                // For many-to-many fields
                // Django expects FormData with repeated fields
                Object.values(content.metadata ?? []).forEach(
                    val => val.forEach(metadata => {
                        data.append('metadata', metadata.id.toString());
                    })
                );
                data.append('copyright_notes', content.copyright ?? '');
                data.append('rights_statement', content.rightsStatement ?? '');
                data.append('additional_notes', content.notes ?? '');
                // Same format as DLMS, default to Jan. 1st
                // TODO: published_date should no longer be required on
                // the backend. Until then, a very improbable date will be
                // assigned as a placeholder.
                data.append('published_date', content.datePublished ? 
                    `${content.datePublished.padStart(4, '0')}-01-01`
                    :
                    '0001-01-01'
                );

                // Unused fields
                // data.append('active', 'true');
                // data.append('created_by', content.creator ?? 'admin');
                // data.append('created_on', format(Date.now(), 'yyyy-MM-dd'));
                // data.append('reviewed_by', '');
                // data.append('copyright_approved', 'false');
                // data.append('copyright_by', '');
                // data.append('published_year', content.datePublished ?? '');

                const req = api.post(APP_URLS.CONTENT_LIST, data);
                return from(req).pipe(
                    map(_ => fetch_content())
                );
            }
        ),
    )

// const catchErrorEpic: MyEpic = action$ =>
//     action$.pipe(
//         catchError(err => {
//             console.error(err)
//             return EMPTY
//         }),
//     )

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
    updateMetadataTypeEpic,
    fetchUserEpic,
    fetchContentEpic,
    addContentEpic,
    logoutEpic,
    showToastEpic,
    // catchErrorEpic // Make sure this epic is last
)

const store = configureStore({
    reducer,
    middleware: [
        ...getDefaultMiddleware({
            thunk: false,
            serializableCheck: {
                // File required for upload,
                // hence serialization check
                // should be ignored
                ignoredActions: [add_content.type],
            },
        }),
        epicMiddleware,
    ],
})

epicMiddleware.run(epics)

export default store
export type RootState = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch
