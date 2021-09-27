import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Organization } from "js/types";

export const organizationSlice = createSlice({
  name: "organization",
  initialState: {
    organizations: [] as Organization[],
  },
  reducers: {
    add_organization: (_state, _action: PayloadAction<Organization>) => {
      // Triggers corresponding epic
    },

    delete_organization: (
      _state,
      _action: PayloadAction<number | number[]>
    ) => {
      // Triggers corresponding epic
    },

    fetch_organization: () => {
      // Triggers corresponding epic
    },

    update_organization: (state, action: PayloadAction<Organization[]>) => {
      state.organizations = action.payload;
    },

    edit_organization: (_state, _action: PayloadAction<Organization>) => {
      // Triggers corresponding epic
    },
  },
});

export const {
  add_organization,
  delete_organization,
  fetch_organization,
  update_organization,
  edit_organization,
} = organizationSlice.actions;

export default organizationSlice.reducer;
