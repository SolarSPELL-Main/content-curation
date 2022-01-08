import { from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

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
  update_newly_added,
  edit_metadatatype,
  preload_all_metadata,
} from '../metadata';

import {
  show_toast,
} from '../global';

import { fromWrapper } from './epicUtils';
import APP_URLS from '../../urls';

import type { MyEpic } from './types';

//what the preload metadata epic does is take each metadata type stored in the 
//state and updates the MetadataByType with metadata of that type
const preloadMetadataEpic: MyEpic = (action$, state$, { api }) => action$.pipe(
  filter(preload_all_metadata.match),
  mergeMap(_ =>
    fromWrapper(from(state$.value.metadata.metadata_types).pipe(
      mergeMap(type => from(api.get(APP_URLS.METADATA_BY_TYPE(type.id,
         state$.value.metadata.metadata_page[type.id] + 1,
         state$.value.metadata.metadata_pagesize[type.id]))).pipe(
        map(({ data }) => update_metadata({
          metadata: { [type.id]: data.data.items },
          page: { [type.id]: 0 },
          pageSize: { [type.id]: 5 },
          total: { [type.id]: data.data.total },
        }))
      ))
    ))
  )
);

//Epic to add metadata to the application state
const addMetadataEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(add_metadata.match),
    mergeMap(action =>
      fromWrapper(from(api.post(APP_URLS.METADATA_LIST, {
        name: action.payload.name,
        type: action.payload.type_id,
      })).pipe(
        mergeMap(res => [
          // Only 1 metadata created at a time (currently), hence to
          // convert to array simply wrap response data into an array
          update_newly_added([res.data]),
          fetch_metadata({ type_id: action.payload.type_id }),
        ]),
      ), show_toast({
        message: `Added metadata "${action.payload.name}"`,
        key: Math.random(),
        severity: 'success',
      })),
    ),
  );

//Epic to edit metadata of the application state
const editMetadataEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(edit_metadata.match),
    mergeMap(action =>
      fromWrapper(from(api.patch(APP_URLS.METADATA(action.payload.id), {
        name: action.payload.name,
        type: action.payload.new_type_id,
      })).pipe(
        map(({data}) => fetch_metadata({ type_id: data.metadataType.id}))
      ), show_toast({
        message: `Renamed metadata to "${action.payload.name}"`,
        key: Math.random(),
        severity: 'success',
      })),
    ),
  );

//Epic to delete a metadata from the application state
const deleteMetadataEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(delete_metadata.match),
    mergeMap(action =>
      fromWrapper(from(api.delete(APP_URLS.METADATA(action.payload.id))).pipe(
        map(_res => fetch_metadata({ type_id: action.payload.type_id }))
      ), show_toast({
        message: `Deleted metadata "${action.payload.name}"`,
        key: Math.random(),
        severity: 'success',
      })),
    ),
  );

//Fetch metadata stored in the current application state so it can shown on the 
//screen
const fetchMetadataEpic: MyEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(fetch_metadata.match),
    mergeMap(action =>
      fromWrapper(
        from(api.get(APP_URLS.METADATA_BY_TYPE(action.payload.type_id, state$.value.metadata.metadata_page[action.payload.type_id] + 1, state$.value.metadata.metadata_pagesize[action.payload.type_id]))).pipe(
          map(({ data }) => update_metadata({
            metadata: { [action.payload.type_id]: data.data.items },
            page: { [action.payload.type_id] : state$.value.metadata.metadata_page[action.payload.type_id]} ,
            pageSize: { [action.payload.type_id]: state$.value.metadata.metadata_pagesize[action.payload.type_id] },
            total: { [action.payload.type_id]: data.data.total },
          }))
        )
      )
    ),
  );

//add a metadata to the application state
const addMetadataTypeEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(add_metadatatype.match),
    mergeMap(action =>
      fromWrapper(from(api.post(APP_URLS.METADATA_TYPES,{
        name: action.payload.name,
      })).pipe(
        map(_res => fetch_metadatatype())
      ), show_toast({
        message: `Added metadata type "${action.payload.name}"`,
        key: Math.random(),
        severity: 'success',
      })),
    ),
  );

//Epic to edit a metadata type in the application state
const editMetadataTypeEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(edit_metadatatype.match),
    mergeMap(action =>
      fromWrapper(
        from(api.patch(APP_URLS.METADATA_TYPE(action.payload.type_id), {
          name: action.payload.name,
        })).pipe(
          map(_res => fetch_metadatatype())
        ),
        show_toast({
          message: `Renamed metadata type to "${action.payload.name}"`,
          key: Math.random(),
          severity: 'success',
        }),
      ),
    )
  );

//Epic to delete a metadata type in the application state
const deleteMetadataTypeEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(delete_metadatatype.match),
    mergeMap(action =>
      fromWrapper(
        from(api.delete(APP_URLS.METADATA_TYPE(action.payload.type_id))).pipe(
          map(_res => fetch_metadatatype())
        ),
        show_toast({
          message: `Deleted metadata type "${action.payload.name}"`,
          key: Math.random(),
          severity: 'success',
        }),
      ),
    ),
  );

//Epic to fetch metadata type from the application state so it can be displayed
//on the screen
const fetchMetadataTypesEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(fetch_metadatatype.match),
    mergeMap(_ =>
      fromWrapper(from(api.get(APP_URLS.METADATA_TYPES)).pipe(
        map(({ data }) => update_metadatatype(data.data.items))
      ))
    ),
  );

//Epic to fetch actual metadata items of metadata types
const updateMetadataTypeEpic: MyEpic = action$ =>
  action$.pipe(
    filter(update_metadatatype.match),
    map(_ => preload_all_metadata())
  );

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
};
