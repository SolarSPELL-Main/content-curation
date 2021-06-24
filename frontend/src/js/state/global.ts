import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing these to enable use of snackbar(toasts) 
//(https://material-ui.com/components/snackbars/)
import _React from 'react'
import _Button from '@material-ui/core/Button'
import _Snackbar from '@material-ui/core/Snackbar'

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