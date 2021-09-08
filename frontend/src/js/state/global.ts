import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  createCRUDPermissions,
  updateCRUDPermissions,
} from '../utils/permissions';
import { AuthGroup, Tabs } from '../enums';
import type { User, Toast } from 'js/types';

export const globalSlice = createSlice({
  name: 'global',
  initialState: {
    /**
         * The tab the user is on
         */
    current_tab: Tabs.HOME,
    /**
         * Displayed toasts
         */
    toasts: [] as Toast[],
    /**
         * The (un)authenticated user
         */
    user: {
      /**
             * Displayed username
             */
      username: '',
      /**
             * Associated email
             */
      email: '',
      /**
             * Currently unused
             */
      token: '',
      /**
             * Permission groups associated with the user
             */
      groups: [],
      /**
             * User unique ID
             */
      user_id: 0,
      /**
             * Permissions allowed for the user. Only affects UI, permissions
             * should still be enforced on the backend
             */
      permissions: {
        /**
                 * CRUD permissions for content
                 */
        content: createCRUDPermissions(),
        /**
                 * CRUD permissions for metadata
                 */
        metadata: createCRUDPermissions(),
        /**
                 * Any additional permissions
                 */
        special: {
          admin: false,
          export: false,
          review: false,
        },
      },
    } as User,
    /**
         * Keys of unresolved API requests. Used for displaying the loader
         */
    outstandingRequests: [] as number[],
  },
  reducers: {
    /**
         * Updates tab in current state
         * @param state The current state
         * @param action.payload The new tab
         */
    update_current_tab: (state, action: PayloadAction<Tabs>) => {
      state.current_tab = action.payload;
    },

    /**
         * Fetches the user's information from the backend
         */
    fetch_user: () => {
      // Triggers corresponding epic
    },

    /**
         * Updates the value of user in current state
         * @param state The current state
         * @param action.payload The new user value
         */
    update_user: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      // Create all permissions associated with the user's groups
      const groups = state.user.groups;
      const permissions = {
        content: createCRUDPermissions(),
        metadata: createCRUDPermissions(),
        special: {
          admin: false,
          export: false,
          review: false,
        },
      };
            
      if (groups.includes(AuthGroup.STUDENT)) {
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

    /**
         * Logs user out on backend
         */
    logout: () => {
      // Triggers corresponding epic
    },

    /**
         * Updates toasts in current state and subsequently shows the toast
         * in the bottom right of the screen (implemented in main.tsx)
         * @param state The current state
         * @param action.payload The Toast to add
         */
    show_toast: (state, action: PayloadAction<Toast>) => {
      state.toasts = state.toasts.concat(action.payload);
    },

    /**
         * Removes a toast from current state and subsequently removes the toast
         * from the bottom right of the screen (implemented in main.tsx)
         * @param state The current state
         * @param action.payload The key of the toast to remove
         */
    close_toast: (state, action: PayloadAction<number>) => {
      state.toasts = state.toasts.filter(n => n.key !== action.payload);
    },

    /**
         * Updates outstandingRequests in current state and subsequently
         * triggers the loader (implemented in Loader.tsx)
         * @param state The current state
         * @param action.payload The key of a new unresolved request
         */
    start_loader: (state, action: PayloadAction<number>) => {
      state.outstandingRequests = state.outstandingRequests.concat(
        action.payload,
      );
    },

    /**
         * Removes a key from outstandingRequests in current state and
         * eventually stops the loader (implemented in Loader.tsx)
         * @param state The current state
         * @param action.payload The key of an unresolved request
         */
    stop_loader: (state, action: PayloadAction<number>) => {
      state.outstandingRequests = state.outstandingRequests.filter(
        id => id !== action.payload,
      );
    },

    /**
         * Fully clears all outstandingRequests in current state and
         * subsequently forces the loader to stop (implemented in Loader.tsx)
         * @param state The current state
         */
    clear_loaders: (state) => {
      state.outstandingRequests = [];
    },
  },
});

export const {
  update_current_tab,
  fetch_user,
  update_user,
  show_toast,
  close_toast,
  logout,
  start_loader,
  stop_loader,
  clear_loaders,
} = globalSlice.actions;
export default globalSlice.reducer;
