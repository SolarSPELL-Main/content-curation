import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        current_tab: 'home',
    },
    reducers: {
        update_current_tab: (state, action: PayloadAction<string>) => {
            state.current_tab = action.payload;
        },
    },
})

export const {
    update_current_tab,
} = globalSlice.actions
export default globalSlice.reducer
