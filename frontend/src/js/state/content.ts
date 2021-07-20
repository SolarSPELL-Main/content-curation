//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import { Content, Query } from "../types"

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        content: [] as Content[],
        total: 0,
        loading: false,
        pageSize: 5,
        page: 0,
        filters: {} as Query,
    },
    reducers: {
        // Fetches list of content from backend
        fetch_content: () => {},

        // Updates content in state
        update_content: (state, action: PayloadAction<{
            content: Content[]
            total: number
        }>) => {
            state.content = action.payload.content;
            state.total = action.payload.total;
        },

        // For pagination
        update_pagination: (state, action: PayloadAction<{
            pageSize?: number
            page?: number
        }>) => {
            if (action.payload.pageSize != null) {
                state.pageSize = action.payload.pageSize;
            }
            if (action.payload.page != null) {
                state.page = action.payload.page;
            }
        },

        start_loading: (state) => {
            state.loading = true;
        },

        stop_loading: (state) => {
            state.loading = false;
        },
        
        // Posts content to backend
        add_content: (_state, _action: PayloadAction<Content>) => {},

        // Deletes content, payload should be content ID(s)
        delete_content: (_state, _action: PayloadAction<number|number[]>) => {},

        // Puts content to backend
        edit_content: (_state, _action: PayloadAction<Content>) => {},

        update_filters: (
            state, action: PayloadAction<Query>
        ) => {
            state.filters = action.payload
        }
    },
});

export const {
    fetch_content,
    update_content,
    add_content,
    delete_content,
    edit_content,
    update_filters,
    update_pagination,
    start_loading,
    stop_loading,
} = contentSlice.actions;

export default contentSlice.reducer;
