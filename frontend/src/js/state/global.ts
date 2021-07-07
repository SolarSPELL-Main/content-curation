//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
//import { delay } from 'rxjs/operators'

//Importing from other files in the project
import type { User } from "js/types"

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        current_tab: 'home',
        toast_open: false,
        toast_message: '',
        toast_severity: '',
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
        },
        logout: () => {},
        show_toast: (state, action:PayloadAction<{
            message: string,
            severity: 'error'|'warning'|'info'|'success',
        }>) => {
            state.toast_open = true
            state.toast_message = action.payload.message
            state.toast_severity = action.payload.severity
        },
        close_toast: (state) => {
            state.toast_open = false
        }
    },
})

export const {
    update_current_tab, fetch_user, update_user, show_toast, close_toast,
    logout
} = globalSlice.actions
export default globalSlice.reducer
