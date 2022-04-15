/* eslint-disable @typescript-eslint/no-explicit-any */
import { from, merge, of } from 'rxjs';
import { filter, map, mergeMap, mapTo, debounceTime } from 'rxjs/operators';

import {
  fetch_content,
  update_content,
  add_content,
  delete_content,
  edit_content,
  update_filters,
  bulk_edit,
} from '../content';
import {
  show_toast,
} from '../global';
import { fromWrapper } from './epicUtils';
import APP_URLS from '../../urls';
import { Status } from '../../enums';
import { contentToFormData, getContentQueryString } from '../../utils/content';
import type { Content, Metadata } from 'js/types';
import type { MyEpic } from './types';

const fetchContentEpic: MyEpic = (action$, state$, { api }) =>
  action$.pipe(
    filter(fetch_content.match),
    filter(() => state$.value.global.user.user_id !== 0),
    // Reduces lag from constant search bar requests
    debounceTime(100),
    mergeMap(_ => {
      const timestamp = Date.now();

      return fromWrapper(from(api.get(
        APP_URLS.CONTENT_LIST(
          getContentQueryString(
            state$.value.content.filters,
            state$.value.content.pageSize,
            // Backend pagination starts at 1, not 0
            state$.value.content.page + 1,
            state$.value.content.sortModel,
            state$.value.global.user.user_id === 0 ?
              undefined :
              state$.value.global.user.user_id + '',
          ),
        ),
      )).pipe(
        map(({ data }) => 
          update_content(
            // Maps API response to Content array
            {
              content: data.data.items.map(
                (val: any) => <Content>({
                  id: Number(val.id),
                  notes: val.additional_notes,
                  fileURL: val.content_file,
                  originalSource: val.original_source,
                  copyrighter: val.copyright_by,
                  copyrightSite: val.copyright_site,
                  copyright_notes: val.copyright_notes,
                  display_title: val.display_title,
                  copyright: val.copyright,
                  copyrightApproved: val.copyright_approved,
                  creator: val.created_by_name,
                  createdDate: val.created_on,
                  // If status is REVIEW, content still needs
                  // to be reviewed, hence below two fields
                  // should be displayed as null.
                  reviewer: val.status === Status.REVIEW ?
                    null
                    :
                    val.reviewed_by_name,
                  reviewedDate: val.status === Status.REVIEW ?
                    null
                    :
                    val.reviewed_on,
                  description: val.description,
                  fileName: val.file_name,
                  datePublished: val.published_year,
                  filesize: val.filesize,
                  status: val.status,
                  title: val.title,
                  // Turns API Metadata array into Record
                  metadata: val.metadata_info.reduce(
                    (
                      accum: Record<number,Metadata[]>,
                      m: any,
                    ) => {
                      const key: number = m.type;
                      const metadata: Metadata = {
                        id: m.id,
                        name: m.name,
                        metadataType: {
                          name: m.type_name,
                          id: key,
                        },
                      };
                      return {
                        ...accum,
                        [key]: key in accum ?
                          accum[key].concat(metadata)
                          : [metadata],
                      };
                    },
                                        {} as Record<number,Metadata[]>,
                  ),
                }),
              ),
              total: data.data.total,
              timestamp: timestamp,
            },
          ),
        ),
      ));
    }),
  );

const addContentEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(add_content.match),
    mergeMap(action => {
      const content = action.payload;
      const data = contentToFormData(content);
      const req = api.post(APP_URLS.CONTENT_LIST(), data);
      return fromWrapper(from(req).pipe(
        map(_ => fetch_content())
      ), show_toast({
        message: `Added content "${action.payload.title}"`,
        key: Math.random(),
        severity: 'success',
      }));
    }
    ),
  );

const deleteContentEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(delete_content.match),
    mergeMap(action => {
      let payload = action.payload;

      // If not array, convert single content ID to array
      if (!Array.isArray(payload)) {
        payload = [payload];
      }

      // Construct promises for all IDs in payload
      return fromWrapper(from(
        Promise.all(
          payload.map(p => api.delete(APP_URLS.CONTENT(p)))
        )
      ).pipe(
        map(_res => fetch_content())
      ), show_toast({
        message: `Deleted ${payload.length} item` + (
          payload.length === 1 ? '' : 's'
        ),
        key: Math.random(),
        severity: 'success',
      }));
    },
    ),
  );

const editContentEpic: MyEpic = (action$, _, { api }) =>
  action$.pipe(
    filter(edit_content.match),
    mergeMap(action => {
      const content = action.payload;
      const data = contentToFormData(content);
      const req = api.patch(APP_URLS.CONTENT(content.id), data);

      const metadataLength = Object.values(content.metadata).reduce(
        (accum, val) => accum + val.length,
        0,
      );

      // Check if metadata is empty
      // If not, make single request
      // If it is, wait until first request finishes,
      // then make a second request for empty metadata.
      if (metadataLength) {
        return fromWrapper(from(req).pipe(
          map(_ => fetch_content()),
        ), show_toast({
          message: `Edited content "${content.title}"`,
          key: Math.random(),
          severity: 'success',
        }));
      } else {
        return fromWrapper(from(req).pipe(
          mergeMap(_ => {
            // Second request
            // Explicitly empty metadata in JSON
            const reqEmpty = api.patch(
              APP_URLS.CONTENT(content.id),
              {
                metadata: [],
              }
            );

            return from(reqEmpty).pipe(
              map(_ => fetch_content()),
            );
          }),
        ), show_toast({
          message: `Edited content "${content.title}"`,
          key: Math.random(),
          severity: 'success',
        }));
      }
    },
    ),
  );

const updateFiltersEpic: MyEpic = action$ =>
  action$.pipe(
    filter(update_filters.match),
    mapTo(fetch_content())
  );

const bulk_edit_epic: MyEpic = (action$, state$, { api }) =>
    action$.pipe(
        filter(bulk_edit.match),
        mergeMap(({ payload }) => 
            fromWrapper(from(api.post(APP_URLS.BULK_EDIT, {
                to_edit: state$.value.content.selected,
                to_add: payload.to_add.map(meta => meta.id),
                to_remove: payload.to_remove.map(meta => meta.id)
            })).pipe(
                mapTo(fetch_content())
            ),
            show_toast({
                message: `Successfully edited content.`,
                severity: "success",
                key: Math.random(),
            })),
        )
    )


export {
  fetchContentEpic,
  addContentEpic,
  deleteContentEpic,
  editContentEpic,
  updateFiltersEpic,
  bulk_edit_epic,
};
