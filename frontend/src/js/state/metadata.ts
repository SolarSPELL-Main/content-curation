import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Metadata, MetadataType } from 'js/types';

type MetadataByType = Record<number, Metadata[]>
type MetadataPage = Record<number, number>
type MetadataPageSize = Record<number, number>
type MetadataTotal = Record<number, number>

export const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    /**
         * Metadata types available for content tagging or for display on the
         * metadata tab
         */
    metadata_types: [] as MetadataType[],
    /**
         * Metadata associated with above metadata types
         */
    metadata: {} as MetadataByType,
    metadata_page: {} as MetadataPage,
    metadata_pagesize: {} as MetadataPageSize,
    metadata_total: {} as MetadataTotal,
    /**
         * The newest metadata added by the current user. Used for the metadata
         * creation in the metadata tagger of the content forms
         */
    newly_added: [] as Metadata[],
  },
  reducers: {
    /**
         * Fetches metadata of a particular type from the backend
         * @param _state The current state
         * @param _action The ID of the type to fetch and a (currently) unused
         *                filter option
         */
    fetch_metadata: (_state, _action: PayloadAction<{
            type_id: number
            string_filter?: number
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * Fetches metadata associated with all metadata types in current state
         * @param _state The current state
         * @param _action.payload Unused
         */
    preload_all_metadata: (_state, _action: PayloadAction) => {
      // Triggers corresponding epic
    },

    /**
         * DELETEs a metadata from the backend
         * @param _state The current state
         * @param _action.payload The ID of the metadata to delete,
         *                        its associated metadata type ID, and its name
         *                        (for display purposes)
         */
    delete_metadata: (_state, _action: PayloadAction<{
            id: number
            type_id: number
            name: string
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * Updates metadata in current state with new values while partially
         * retaining old ones
         * @param state The current state
         * @param action.payload Record mapping metadata types to replace to
         *                              their new metadata array values
         */
    update_metadata: (state, action: PayloadAction<{
        metadata: MetadataByType,
        page: MetadataPage,
        pageSize: MetadataPageSize,
        total: MetadataTotal,
      }>) => {
        state.metadata = Object.assign({}, state.metadata, action.payload.metadata);
        state.metadata_page = Object.assign({}, state.metadata_page, action.payload.page);
        state.metadata_pagesize = Object.assign({}, state.metadata_pagesize, action.payload.pageSize);
        state.metadata_total = Object.assign({}, state.metadata_total, action.payload.total);
    },

    /**
         * POSTs metadata to the backend
         * @param _state The current state
         * @param _action.payload The new name and associated metadata type
         */
    add_metadata: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * PATCHes metadata to the backend
         * @param _state The current state
         * @param _action.payload The associated ID, and optionally the new name
         *                        or the ID of its new associated metadata type
         */
    edit_metadata: (_state, _action: PayloadAction<{
            id: number
            name?: string
            new_type_id?: number
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * Fetches list of metadata types from the backend
         */
    fetch_metadatatype: () => {
      // Triggers corresponding epic
    },

    /**
         * DELETEs a metadata type from the backend
         * @param _state The current state
         * @param _action.payload The ID of the metadata type and its name
         *                        (for display purposes)
         */
    delete_metadatatype: (_state, _action: PayloadAction<{
            type_id: number
            name: string
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * Replace all metadata types in current state
         * @param state The current state
         * @param action.payload The new array of metadata types
         */
    update_metadatatype: (state, action: PayloadAction<MetadataType[]>) => {
      state.metadata_types = action.payload;
    },

    /**
         * POSTs a metadata type to the backend
         * @param _state The current state
         * @param _action.payload The name of the new metadata type
         */
    add_metadatatype: (_state, _action: PayloadAction<{
            name: string,
        }>) => {
      // Triggers corresponding epic
    },

    /**
         * Replace value of newly_added in current state
         * @param state The current state
         * @param action.payload The new array of newly added metadata
         */
    update_newly_added: (state, action: PayloadAction<Metadata[]>) => {
      state.newly_added = action.payload;
    },

    /**
         * PATCHes a metadata type to the backend
         * @param _state The current state
         * @param _action The new name of the metadata type and its ID
         */
    edit_metadatatype: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {
      // Triggers corresponding epic
    },
    /**
         * Updates pagination in current state
         * @param state The current state
         * @param action.payload The new page size or new page for display
         */
     update_pagination: (state, action: PayloadAction<{
            id: number
            pageSize?: number
            page?: number
        }>) => {
      if (action.payload.pageSize != null) {
        state.metadata_pagesize[action.payload.id] = action.payload.pageSize;
      }

      if (action.payload.page != null) {
        state.metadata_page[action.payload.id] = action.payload.page;
        }
      },
  },
});

export const {
  delete_metadata,
  add_metadata,
  fetch_metadata,
  update_metadata,
  edit_metadata,
  delete_metadatatype,
  add_metadatatype,
  fetch_metadatatype,
  update_metadatatype,
  update_newly_added,
  edit_metadatatype,
  preload_all_metadata,
  update_pagination,
} = metadataSlice.actions;
export default metadataSlice.reducer;
