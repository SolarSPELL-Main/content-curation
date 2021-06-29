import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type { User } from "js/types"


export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        current_tab: 'home',
        snackbar_open: false,
        snackbar_message: '',
        user: {
            username: "",
            email: "",
            token: "",
            groups: [],
        } as User
    },
    reducers: {
        update_current_tab: (state, action: PayloadAction<string>) => {
            state.current_tab = action.payload;
        },
        fetch_user: () => {},
        update_user: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        }
    },
})

export const {
    update_current_tab, fetch_user, update_user
} = globalSlice.actions
export default globalSlice.reducer
