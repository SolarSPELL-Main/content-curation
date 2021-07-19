//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import { createCRUDPermissions, updateCRUDPermissions } from '../utils';
import { AuthGroup, Tabs } from '../enums';
import type { User, Toast } from "js/types"

export const globalSlice = createSlice({
    name: 'global',
    initialState: {
        current_tab: Tabs.HOME,
        toasts: [] as Toast[],
        user: {
            username: "",
            email: "",
            token: "",
            groups: [],
            permissions: {
                content: createCRUDPermissions(),
                metadata: createCRUDPermissions(),
                special: {
                    admin: false,
                    export: false,
                    review: false,
                },
            },
        } as User
    },
    reducers: {
        update_current_tab: (state, action: PayloadAction<Tabs>) => {
            state.current_tab = action.payload;
        },
        fetch_user: () => {},
        update_user: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            const groups = state.user.groups;
            const permissions = {
                content: createCRUDPermissions(),
                metadata: createCRUDPermissions(),
                special: {
                    admin: false,
                    export: false,
                    review: false,
                }
            };
            
            // Assign permissions for all groups
            // TODO: Remove these two groups, combine into 'Student'
            if (groups.includes(AuthGroup.STUDENT1)
                || groups.includes(AuthGroup.STUDENT2)) {
                permissions.content = updateCRUDPermissions(
                    permissions.content,
                    'CRUD',
                );
                permissions.metadata = updateCRUDPermissions(
                    permissions.metadata,
                    'CRUD',
                );
            }

            if (groups.includes(AuthGroup.LIB_SPECIALIST)) {
                permissions.content = updateCRUDPermissions(
                    permissions.content,
                    'CRUD',
                );
                permissions.metadata = updateCRUDPermissions(
                    permissions.metadata,
                    'CRUD',
                );
                permissions.special.export = true;
                permissions.special.review = true;
            }

            if (groups.includes(AuthGroup.ADMIN)) {
                permissions.content = updateCRUDPermissions(
                    permissions.content,
                    'CRUD',
                );
                permissions.metadata = updateCRUDPermissions(
                    permissions.metadata,
                    'CRUD',
                );
                permissions.special.admin = true;
                permissions.special.export = true;
                permissions.special.review = true;
            }

            state.user.permissions = permissions;
        },
        logout: () => {},
        show_toast: (state, action: PayloadAction<Toast>) => {
            state.toasts.push(action.payload)
        },
        close_toast: (state, action: PayloadAction<number>) => {
            state.toasts = state.toasts.filter(n => n.key != action.payload)
        },

        start_loader: () => {
            console.log('Started loading!');
        },
        stop_loader: () => {
            console.log('Finished loading!');
        },
    },
})

export const {
    update_current_tab,
    fetch_user,
    update_user,
    show_toast,
    close_toast,
    logout,
    start_loader,
    stop_loader,
} = globalSlice.actions
export default globalSlice.reducer
