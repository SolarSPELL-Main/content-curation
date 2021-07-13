//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import type { User, Toast } from "js/types"

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        current_tab: 'home',
        toasts: [] as Toast[],
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
        show_toast: (state, action: PayloadAction<Toast>) => {
            state.toasts.push(action.payload)
        },
        close_toast: (state, action: PayloadAction<number>) => {
            state.toasts = state.toasts.filter(n => n.key != action.payload)
        }
    },
})

export const {
    update_current_tab, fetch_user, update_user, show_toast, close_toast,
    logout
} = globalSlice.actions
export default globalSlice.reducer
