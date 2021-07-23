import { from } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators'

import {
    fetch_metadata,
    update_metadata,
    add_metadata,
    delete_metadata, 
    edit_metadata,
    fetch_metadatatype,
    update_metadatatype,
    add_metadatatype,
    delete_metadatatype,
    edit_metadatatype,
    preload_all_metadata,
} from '../metadata'

import { fromWrapper } from './util';
import APP_URLS from '../../urls';
import { api } from '../../utils';

import type { MyEpic } from './types';

//what the preload metadata epic does is take each metadata type stored in the 
//state and updates the MetadataByType with metadata of that type
const preloadMetadataEpic: MyEpic = (action$, state$) => action$.pipe(
    filter(preload_all_metadata.match),
    mergeMap(_ =>
        fromWrapper(from(state$.value.metadata.metadata_types).pipe(
            mergeMap(type => from(api.get(APP_URLS.METADATA_BY_TYPE(type.id))).pipe(
                map(({ data }) => update_metadata({ [type.id]: data.data }))
            ))
        ))
    )
)

//Epic to add metadata to the application state
const addMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadata.match),
        mergeMap(action =>
            fromWrapper(from(api.post(APP_URLS.METADATA_LIST, {
                name: action.payload.name,
                type: action.payload.type_id
            })).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            )),
        ),
    )

//Epic to edit metadata of the application state
const editMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadata.match),
        mergeMap(action =>
            fromWrapper(from(api.patch(APP_URLS.METADATA(action.payload.id), {
                name: action.payload.name,
                type: action.payload.new_type_id
            })).pipe(
                map(({data}) => fetch_metadata({ type_id: data.metadataType.id}))
            )),
        ),
    )

//Epic to delete a metadata from the application state
const deleteMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadata.match),
        mergeMap(action =>
            fromWrapper(from(api.delete(APP_URLS.METADATA(action.payload.id))).pipe(
                map(_res => fetch_metadata({ type_id: action.payload.type_id }))
            )),
        ),
    )

//Fetch metadata stored in the current application state so it can shown on the 
//screen
const fetchMetadataEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadata.match),
        mergeMap(action =>
            fromWrapper(from(api.get(APP_URLS.METADATA_BY_TYPE(action.payload.type_id))).pipe(
                map(({ data }) => update_metadata({
                    [action.payload.type_id]: data.data
                }))
            ))
        ),
    )

//add a metadata to the application state
const addMetadataTypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_metadatatype.match),
        mergeMap(action =>
            fromWrapper(from(api.post(APP_URLS.METADATA_TYPES,{
                name: action.payload.name,
            })).pipe(
                map(_res => fetch_metadatatype())
            )),
        ),
    )

//Epic to edit a metadata type in the application state
const editMetadataTypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_metadatatype.match),
        mergeMap(action =>
            fromWrapper(from(api.patch(APP_URLS.METADATA_TYPE(action.payload.type_id), {
                name: action.payload.name,
            })).pipe(
                map(_res => fetch_metadatatype())
            )),
        )
    )

//Epic to delete a metadata type in the application state
const deleteMetadataTypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(delete_metadatatype.match),
        mergeMap(action =>
            fromWrapper(from(api.delete(APP_URLS.METADATA_TYPE(action.payload.type_id))).pipe(
                map(_res => fetch_metadatatype())
            )),
        ),
    )

//Epic to fetch metadata type from the application state so it can be displayed
//on the screen
const fetchMetadataTypesEpic: MyEpic = action$ =>
    action$.pipe(
        filter(fetch_metadatatype.match),
        mergeMap(_ =>
            fromWrapper(from(api.get(APP_URLS.METADATA_TYPES)).pipe(
                map(({ data }) => update_metadatatype(data.data.items))
            ))
        ),
    )

//Epic to update a metadata type in application state
const updateMetadataTypeEpic: MyEpic = action$ =>
    action$.pipe(
        filter(update_metadatatype.match),
        map(_ => preload_all_metadata())
    )

export {
    preloadMetadataEpic,
    addMetadataEpic,
    editMetadataEpic,
    deleteMetadataEpic,
    fetchMetadataEpic,
    addMetadataTypeEpic,
    editMetadataTypeEpic,
    deleteMetadataTypeEpic,
    fetchMetadataTypesEpic,
    updateMetadataTypeEpic,
}
