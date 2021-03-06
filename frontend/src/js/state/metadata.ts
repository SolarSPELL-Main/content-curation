//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import { Metadata, MetadataType } from "../types"

type MetadataByType = Record<number, Metadata[]>

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        metadata_types: [] as MetadataType[],
        metadata: {} as MetadataByType,
    },
    reducers: {
        
        //fetch the metadata already stored in the state
        fetch_metadata: (_state, _action: PayloadAction<{
            type_id: number
            string_filter?: number
        }>) => {},

        //preload_all_metadata takes each metadata type stored in the state and 
        //updates the MetadataByType with metadata of that type
        preload_all_metadata: (_state, _action: PayloadAction) => {},
        delete_metadata: (_state, _action: PayloadAction<{
            id: number
            type_id: number
        }>) => {},
        //What `update_metadata` does is instead of completely replacing the 
        //metadata dict it just updates it with the latest it receives from that
        // endpoint
        update_metadata: (state, action: PayloadAction<MetadataByType>) => {
            Object.assign(state.metadata, action.payload)
        },
        //add metadata in the application state
        add_metadata: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {},

        //edit metadata in the application state
        edit_metadata: (_state, _action: PayloadAction<{
            id: number
            name?: string
            new_type_id?: number
        }>) => {},

        //fetch metadata type from the application state
        fetch_metadatatype: () => {},

        //delete a metadata type from application state
        delete_metadatatype: (_state: any, _action: PayloadAction<{
            type_id: number
        }>) => {},

        //update metadata type in the application state, instead of completely 
        //replacing it
        update_metadatatype: (state, action: PayloadAction<Metadata[]>) => {
            state.metadata_types = action.payload
        },

        //add a metadata type to the application state
        add_metadatatype: (_state, _action: PayloadAction<{
            name: string,
            type_id: number
        }>) => {},

        //edit a metadata type from the application state
        edit_metadatatype: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {}
    },
})

//export these variables as consts so it can be used in the file store.ts
export const {
    delete_metadata, add_metadata, fetch_metadata, update_metadata,
    edit_metadata, delete_metadatatype, add_metadatatype, fetch_metadatatype,
    update_metadatatype, edit_metadatatype, preload_all_metadata
} = metadataSlice.actions
export default metadataSlice.reducer
