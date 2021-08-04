//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import { Metadata, MetadataType } from "../types"

type MetadataByType = Record<number, Metadata[]>

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
        }>) => {},

        /**
         * Fetches metadata associated with all metadata types in current state
         * @param _state The current state
         * @param _action.payload Unused
         */
        preload_all_metadata: (_state, _action: PayloadAction) => {},

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
        }>) => {},

        /**
         * Updates metadata in current state with new values while partially
         * retaining old ones
         * @param state The current state
         * @param action.payload Record mapping metadata types to replace to
         *                              their new metadata array values
         */
        update_metadata: (state, action: PayloadAction<MetadataByType>) => {
            state.metadata = Object.assign({}, state.metadata, action.payload);
        },

        /**
         * POSTs metadata to the backend
         * @param _state The current state
         * @param _action.payload The new name and associated metadata type
         */
        add_metadata: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {},

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
        }>) => {},

        /**
         * Fetches list of metadata types from the backend
         */
        fetch_metadatatype: () => {},

        /**
         * DELETEs a metadata type from the backend
         * @param _state The current state
         * @param _action.payload The ID of the metadata type and its name
         *                        (for display purposes)
         */
        delete_metadatatype: (_state: any, _action: PayloadAction<{
            type_id: number
            name: string
        }>) => {},

        /**
         * Replace all metadata types in current state
         * @param state The current state
         * @param action.payload The new array of metadata types
         */
        update_metadatatype: (state, action: PayloadAction<MetadataType[]>) => {
            state.metadata_types = action.payload
        },

        /**
         * POSTs a metadata type to the backend
         * @param _state The current state
         * @param _action.payload The name of the new metadata type
         */
        add_metadatatype: (_state, _action: PayloadAction<{
            name: string,
        }>) => {},

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
        }>) => {}
    },
})

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
} = metadataSlice.actions
export default metadataSlice.reducer
