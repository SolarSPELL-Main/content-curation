import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Content } from "../types"

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        content: [] as Content[],
    },
    reducers: {
        // Currently the bare minimum needed to add content

        // Fetches list of content from backend
        fetch_content: () => {},

        // Updates content in state
        update_content: (state, action: PayloadAction<Content[]>) => {
            state.content = action.payload;
        },
        
        // Posts content to backend
        add_content: (_state, _action: PayloadAction<Content>) => {},
    },
});

export const {
    fetch_content,
    update_content,
    add_content,
} = contentSlice.actions;

export default contentSlice.reducer;
