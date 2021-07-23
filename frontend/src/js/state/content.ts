//Importing from outside the project
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

//Importing from other files in the project
import { Content, Query } from "../types"

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        content: [] as Content[],
        selected: [] as number[],
        selectionModel: [] as number[],
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

        // For persisting selection
        update_selected: (state, action: PayloadAction<number[]>) => {
            const ids = action.payload;
            const pageIDs = state.content.map(c => c.id);

            // Find which IDs were implicitly deselected
            const exclude = pageIDs.filter(id => !ids.includes(id));
            
            // Find which IDs are not yet selected
            const unselected = pageIDs.filter(id => !state.selected.includes(id));
            
            const selectionDraft = state.selected.concat(unselected)
                .filter(id => !exclude.includes(id));
            
            state.selectionModel = ids;
            state.selected = selectionDraft;
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
        delete_content: (state, action: PayloadAction<number|number[]>) => {
            // Should remove deleted content ID(s) from selected
            const payload = action.payload;

            if (Array.isArray(payload)) {
                state.selected = state.selected.filter(id => !payload.includes(id));
            } else {
                state.selected = state.selected.filter(id => id !== payload);
            }
        },

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
    update_selected,
    start_loading,
    stop_loading,
} = contentSlice.actions;

export default contentSlice.reducer;
