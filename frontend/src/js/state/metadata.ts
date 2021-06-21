import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Metadata } from "../types"


type MetadataByType = Record<string, Metadata[]>

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        metadata_types: [] as string[],
        metadata: {} as MetadataByType,
        //btc: {} as any,
    },
    reducers: {
        /*Example code for reference
        add_metadata: (state, action: PayloadAction<string>) => {
            state.metadata_types.push(action.payload)
        },
    
        remove_metadata: (state) => {
            state.metadata_types.pop()
        },
        fetch_btc: () => {},
        update_btc: (state, action: PayloadAction<any>) => {
            state.btc = action.payload
        },
        */
        fetch_metadata: (_state, _action?: PayloadAction<{metadata_type?: string | undefined, string_filter?: number|undefined}>) => {},
        delete_metadata: (_state, _action:PayloadAction<{type_id: number}>) => {
        },
        update_metadata: (state, action: PayloadAction<MetadataByType>) => {
            state.metadata = action.payload
        },
        add_metadata: (_state, _action:PayloadAction<{name: string, type_id:number}>) => {
        },
        edit_metadata: (_state, _action:PayloadAction<{name: string, type_id: number}>) =>{
        },
        fetch_metadatatype: () => {},
        delete_metadatatype: (_state: any, _action:PayloadAction<{type_id: number}>) => {
        },
        update_metadatatype: (state, action: PayloadAction<MetadataByType>) => {
            state.metadata = action.payload
        },
        add_metadatatype: (_state, _action:PayloadAction<{name: string, type_id:number}>) => {
        },
        edit_metadatatype: (_state, _action:PayloadAction<{name: string, type_id: number}>) =>{
        }
        
    },
})


export const {
    delete_metadata, add_metadata, fetch_metadata, update_metadata, edit_metadata, delete_metadatatype, add_metadatatype, fetch_metadatatype, update_metadatatype, edit_metadatatype
} = metadataSlice.actions
export default metadataSlice.reducer
