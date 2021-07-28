import { from } from 'rxjs'
import { filter, map, mergeMap, mapTo } from 'rxjs/operators'

import {
    fetch_content,
    update_content,
    add_content,
    delete_content,
    edit_content,
    update_filters,
} from '../content';

import {
    show_toast,
} from '../global';

import { fromWrapper } from './util';
import APP_URLS from '../../urls';
import { api, contentToFormData } from '../../utils';
import { Status } from '../../enums';

import type { Content, Metadata } from '../../types';
import type { MyEpic } from './types';

const fetchContentEpic: MyEpic = (action$, state$) =>
    action$.pipe(
        filter(fetch_content.match),
        mergeMap(_ =>
            fromWrapper(from(api.get(
                APP_URLS.CONTENT_LIST(
                    state$.value.content.filters,
                    state$.value.content.pageSize,
                    // Backend pagination starts at 1, not 0
                    state$.value.content.page + 1,
                    state$.value.content.sortModel,
                    state$.value.global.user.username,
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
                                    active: val.active,
                                    fileURL: val.content_file,
                                    originalSource: val.original_source,
                                    copyrighter: val.copyright_by,
                                    copyrightSite: val.copyright_site,
                                    copyright: val.copyright_notes,
                                    copyrightApproved: val.copyright_approved,
                                    creator: val.created_by,
                                    createdDate: val.created_on,
                                    reviewer: val.reviewed_by,
                                    // If status is REVIEW, content still needs
                                    // to be reviewed, hence reviewedDate should
                                    // be displayed as null.
                                    reviewedDate: val.status === Status.REVIEW ?
                                        null
                                        :
                                        val.reviewed_on,
                                    description: val.description,
                                    fileName: val.file_name,
                                    datePublished: val.published_year,
                                    rightsStatement: val.rights_statement,
                                    filesize: val.filesize,
                                    status: val.status,
                                    title: val.title,
                                    // Turns API Metadata array into Record
                                    metadata: val.metadata_info.reduce(
                                        (
                                            accum: Record<number,Metadata[]>,
                                            val: any,
                                        ) => {
                                            const key: number = val.type;
                                            const metadata: Metadata = {
                                                id: val.id,
                                                name: val.name,
                                                metadataType: {
                                                    name: val.type_name,
                                                    id: key,
                                                },
                                            };
                                            return {
                                                ...accum,
                                                [key]: key in accum ?
                                                    accum[key].concat(metadata)
                                                    : [metadata]
                                            };
                                        },
                                        {} as Record<number,Metadata[]>,
                                    ),
                                }),
                            ),
                            total: data.data.total,
                        },
                    ),
                ),
            )),
        ),
    )

const addContentEpic: MyEpic = action$ =>
    action$.pipe(
        filter(add_content.match),
        mergeMap(action =>
            {
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
    )

const deleteContentEpic: MyEpic = action$ =>
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
    )

const editContentEpic: MyEpic = action$ =>
    action$.pipe(
        filter(edit_content.match),
        mergeMap(action =>
            {
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
                            const req = api.patch(
                                APP_URLS.CONTENT(content.id),
                                {
                                    metadata: [],
                                }
                            );

                            return from(req).pipe(
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
    )

const updateFiltersEpic: MyEpic = action$ =>
    action$.pipe(
        filter(update_filters.match),
        mapTo(fetch_content())
    )


export {
    fetchContentEpic,
    addContentEpic,
    deleteContentEpic,
    editContentEpic,
    updateFiltersEpic,
}
