import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const metadataSlice = createSlice({
    name: 'metadata',
    initialState: {
        metadata_types: [] as string[],
        metadata: {} as Record<string, { name: string }>,
        btc: {} as any,
    },
    reducers: {
        add_metadata: (state, action: PayloadAction<string>) => {
            state.metadata_types.push(action.payload)
        },
        remove_metadata: (state) => {
            state.metadata_types.pop()
        },
        fetch_metadata: () => {},
        update_btc: (state, action: PayloadAction<any>) => {
            state.btc = action.payload
        }
    },
})

export const { add_metadata, remove_metadata, fetch_metadata } = metadataSlice.actions
export default metadataSlice.reducer
