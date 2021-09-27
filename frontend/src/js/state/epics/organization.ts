import { filter, map, mergeMap } from "rxjs/operators";
import { from } from "rxjs";

import { fromWrapper } from "./epicUtils";
import type { MyEpic } from "./types";
import {
  add_organization,
  delete_organization,
  fetch_organization,
  update_organization,
  edit_organization,
} from "../organization";
import { show_toast } from "../global";

const addOrganizationEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(add_organization.match),
    mergeMap(action => {
      const organization = action.payload;
      const req = api.post("/api/organization/", organization);
      return fromWrapper(
        from(req).pipe(map(_ => fetch_organization())),
        show_toast({
          message: "Added organization",
          key: Math.random(),
          severity: "success",
        })
      );
    })
  );

const deleteOrganizationEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(delete_organization.match),
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
            payload.map(id => api.delete(`/api/organization/${id}/`))
          )
        ).pipe(map(_res => fetch_organization())),
        show_toast({
          message: "Deleted organization",
          key: Math.random(),
          severity: "success",
        })
      );
    })
  );

//Fetch organizations stored in the current application state so it can shown on the screen
const fetchOrganizationEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(fetch_organization.match),
    mergeMap(_ =>
      fromWrapper(
        from(api.get("/api/organization/")).pipe(
          map(({ data }) => update_organization(data.data.items))
        )
      )
    )
  );

// Epic to edit an organization in the application state
const editOrganizationEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(edit_organization.match),
    mergeMap(action =>
      fromWrapper(
        from(
          api.patch(`/api/organization/${action.payload.id}/`, {
            id: action.payload.id,
            name: action.payload.name,
            email: action.payload.email,
            website: action.payload.website,
          })
        ).pipe(map(_res => fetch_organization())),
        show_toast({
          message: "Edited organization",
          key: Math.random(),
          severity: "success",
        })
      )
    )
  );

export {
  addOrganizationEpic,
  deleteOrganizationEpic,
  fetchOrganizationEpic,
  editOrganizationEpic,
};
