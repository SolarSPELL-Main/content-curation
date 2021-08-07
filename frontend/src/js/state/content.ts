import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import type {
    GridSortModel,
} from '@material-ui/data-grid';

import { Content, Query } from "../types"

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        /**
         * All Content objects currently displayed in the Content tab
         */
        content: [] as Content[],
        /**
         * Timestamp for when last request to update Content was made
         */
        timestamp: -1,
        /**
         * All selected Content IDs. Stored in Redux state to allow selection
         * to persist between pages
         */
        selected: [] as number[],
        /**
         * The selected Content IDs on the current page in the Content tab
         * table. Used to check whether the user's selection has changed while
         * taking into account pagination
         */
        selectionModel: [] as number[],
        /**
         * The total number of content items on the backend
         */
        total: 0,
        /**
         * The number of rows to display on a single page
         */
        pageSize: 10,
        /**
         * The current page (index starting from 0)
         */
        page: 0,
        /**
         * The filter parameters used to filter content fetched from the backend
         */
        filters: {} as Query,
        /**
         * The model used to sort content fetched from the backend.
         * By default, sorts by title ascending
         */
        sortModel: [{
            field: 'title',
            sort: 'asc',
        }] as GridSortModel,
    },
    reducers: {
        /**
         * Triggers Epic to fetch content from backend
         */
        fetch_content: () => {
            // Triggers corresponding epic
        },

        /**
         * Updates content in current state
         * @param state The current state
         * @param action.payload The new content to display, number of items,
         *                       and timestamp for when the request was made.
         */
        update_content: (state, action: PayloadAction<{
            content: Content[]
            total: number
            timestamp: number
        }>) => {
            // If request was made earlier than when the current content's
            // request was made, then ignore
            if (action.payload.timestamp > state.timestamp) {
                state.content = action.payload.content;
                state.total = action.payload.total;
                state.timestamp = action.payload.timestamp;
            }
        },

        /**
         * Updates selected items in current state with action payload
         * @param state The current state
         * @param action.payload The new selected items on the current page
         */
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

        /**
         * Either removes IDs from selection or completely clears selection
         * @param state The current state
         * @param action.payload The IDs to remove, or undefined
         */
        clear_selected: (state, action: PayloadAction<number[]|undefined>) => {
            const ids = action.payload;

            if (ids) {
                state.selected = state.selected.filter(id => !ids.includes(id));
            } else {
                state.selected = [];
            }
        },

        /**
         * Updates pagination in current state
         * @param state The current state
         * @param action.payload The new page size or new page for display
         */
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
        
        /**
         * POSTs content to backend
         * @param _state The current state
         * @param _action.payload The content to post
         */
        add_content: (_state, _action: PayloadAction<Content>) => {
            // Triggers corresponding epic
        },

        /**
         * DELETEs content from backend
         * @param state The current state
         * @param action.payload The ID or IDs of content to delete
         */
        delete_content: (state, action: PayloadAction<number|number[]>) => {
            // Must also remove deleted content ID(s) from selected
            const payload = action.payload;

            if (Array.isArray(payload)) {
                state.selected = state.selected.filter(id => !payload.includes(id));
            } else {
                state.selected = state.selected.filter(id => id !== payload);
            }
        },

        /**
         * PATCHes content to backend
         * @param _state The current state
         * @param _action.payload The new piece of content (with valid ID)
         */
        edit_content: (_state, _action: PayloadAction<Content>) => {
            // Triggers corresponding epic
        },

        /**
         * Updates the filter in current state
         * @param state The current state
         * @param action The new filters to use
         */
        update_filters: (
            state,
            action: PayloadAction<Query>,
        ) => {
            state.filters = action.payload
        },

        /**
         * Updates the sort model in current state
         * @param state The current state
         * @param action The new sort model to use
         */
        update_sortmodel: (state, action: PayloadAction<GridSortModel>) => {
            state.sortModel = action.payload;
        },
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
    update_sortmodel,
    update_selected,
    clear_selected,
} = contentSlice.actions;

export default contentSlice.reducer;
