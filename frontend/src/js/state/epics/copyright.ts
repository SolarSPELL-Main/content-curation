import { filter, map, mergeMap } from "rxjs/operators";
import { from } from "rxjs";

import { fromWrapper } from "./epicUtils";
import type { MyEpic } from "./types";
import {
  add_copyright,
  delete_copyright,
  fetch_copyright,
  update_copyright,
  edit_copyright,
} from "../copyright";
import { show_toast } from "../global";
import APP_URLS from "../../urls"

const addCopyrightEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(add_copyright.match),
    mergeMap((action) => {
      const copyright = action.payload;
      console.log('addCopyrightEPIC')
      const req = api.post(APP_URLS.COPYRIGHT_LIST, copyright);
      return fromWrapper(
        from(req).pipe(
            map(_ => fetch_copyright())
        ),
        show_toast({
          message: "Added copyright",
          key: Math.random(),
          severity: "success",
        })
      );
    })
  );

const deleteCopyrightEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(delete_copyright.match),
    mergeMap(action => {
      let payload = action.payload;

      // If not array, convert single content ID to array
      if (!Array.isArray(payload)) {
        payload = [payload];
      }

      // Construct promises for all IDs in payload
      return fromWrapper(
        from(
          Promise.all(
            payload.map(id => api.delete(APP_URLS.COPYRIGHT(id)))
          )
        ).pipe(
            map(_res => fetch_copyright())
        ),
        show_toast({
          message: "Deleted copyright",
          key: Math.random(),
          severity: "success",
        })
      );
    })
  );

//Fetch copyrights stored in the current application state so it can shown on the screen
const fetchCopyrightEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(fetch_copyright.match),
    mergeMap(_ =>
      fromWrapper(
        from(api.get(APP_URLS.COPYRIGHT_LIST)).pipe(
          map(({ data }) => update_copyright(data.data.items))
        )
      )
    )
  );

// Epic to edit a copyright in the application state
const editCopyrightEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(edit_copyright.match),
    mergeMap(action =>
      fromWrapper(
        from(
          api.patch(APP_URLS.COPYRIGHT(action.payload.id), {
            description: action.payload.description,
            organization: action.payload.organization,
            date_contacted: action.payload.date_contacted,
            date_of_response: action.payload.date_of_response,
            granted: action.payload.granted,
            user: action.payload.user,
          })
        ).pipe(
            map(_res => fetch_copyright())
        ),
        show_toast({
          message: "Edited copyright",
          key: Math.random(),
          severity: "success",
        })
      )
    )
  );

export {
  addCopyrightEpic,
  deleteCopyrightEpic,
  fetchCopyrightEpic,
  editCopyrightEpic,
};
