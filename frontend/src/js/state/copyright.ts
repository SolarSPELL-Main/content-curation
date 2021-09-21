import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ContentPermissions } from "js/types";

export const copyrightSlice = createSlice({
  name: "copyright",
  initialState: {
    copyright: [] as ContentPermissions[],
  },
  reducers: {
    add_copyright: (_state, _action: PayloadAction<ContentPermissions>) => {
      // Triggers corresponding epic
    },

    delete_copyright: (_state, _action: PayloadAction<number | number[]>) => {
      // Triggers corresponding epic
    },

    fetch_copyright: () => {
      // Triggers corresponding epic
    },

    update_copyright: (state, action: PayloadAction<ContentPermissions[]>) => {
      state.copyright = action.payload;
    },

    edit_copyright: (_state, _action: PayloadAction<ContentPermissions>) => {
      // Triggers corresponding epic
    },
  },
});

export const {
  add_copyright,
  delete_copyright,
  fetch_copyright,
  update_copyright,
  edit_copyright,
} = copyrightSlice.actions;

export default copyrightSlice.reducer;
