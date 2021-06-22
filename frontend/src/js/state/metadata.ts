import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Metadata, MetadataType } from "../types"


type MetadataByType = Record<number, Metadata[]>

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        metadata_types: [] as MetadataType[],
        metadata: {} as MetadataByType,
    },
    reducers: {
        fetch_metadata: (_state, _action?: PayloadAction<{
            type_id: number
            string_filter?: number
        }>) => {},
        preload_all_metadata: (_state, _action?: PayloadAction) => {},
        delete_metadata: (_state, _action: PayloadAction<{
            type_id: number
        }>) => {},
        update_metadata: (state, action: PayloadAction<MetadataByType>) => {
            Object.assign(state.metadata, action.payload)
        },
        add_metadata: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {},
        edit_metadata: (_state, _action: PayloadAction<{
            name?: string
            type_id: number
            new_type_id?: number
        }>) => {},
        fetch_metadatatype: () => {},
        delete_metadatatype: (_state: any, _action: PayloadAction<{
            type_id: number
        }>) => {},
        update_metadatatype: (state, action: PayloadAction<Metadata[]>) => {
            state.metadata_types = action.payload
        },
        add_metadatatype: (_state, _action: PayloadAction<{
            name: string,
            type_id: number
        }>) => {},
        edit_metadatatype: (_state, _action: PayloadAction<{
            name: string
            type_id: number
        }>) => {}
    },
})


export const {
    delete_metadata, add_metadata, fetch_metadata, update_metadata,
    edit_metadata, delete_metadatatype, add_metadatatype, fetch_metadatatype,
    update_metadatatype, edit_metadatatype, preload_all_metadata
} = metadataSlice.actions
export default metadataSlice.reducer
