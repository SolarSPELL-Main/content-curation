import type { GridSortModel } from '@material-ui/data-grid';
import type { Query, Metadata } from "js/types"
import {isArray, isNumber, isPlainObject, isString } from "lodash"

import { CONTENT_FIELDS } from './utils';

//All hardcoded end-points live in this file
const APP_URLS = {
    BUG_REPORT: "https://docs.google.com/forms/d/e/"
        + "1FAIpQLScdPbE0AGVuNCvhy2gnTvmVNyQcQtd4vt6zBjjBgAwprb4VKg/viewform",
    EXPORT: (id: number) => `/api/content/${id}/zipdownloadcsv/`,
    LOGOUT: `/accounts/logout/`,
    METADATA: (id: number) => `/api/metadata/${id}/`,
    //api endpoint `/api/metadata_types/{type_id}/metadata/ ` returns all 
    // metadata of that type
    //to make it easier to support pagination later down the road
    METADATA_BY_TYPE: (id: number) => `/api/metadata_types/${id}/metadata/`,
    METADATA_LIST: `/api/metadata/`,
    // To ensure relatively consistent ordering, sort query param included
    METADATA_TYPES: `/api/metadata_types/?sort_by=name`,
    METADATA_TYPE: (id: number) => `/api/metadata_types/${id}/`,
    METADATA_TYPE_EXPORT: (id: number) => `/api/metadata_types/${id}/downloadAsCSV/`,
    CONTENT_LIST: (
        params?: Query,
        pageSize?: number,
        page?: number,
        sortModel?: GridSortModel,
    ) => {
        let extra_params: string[] = [];

        // Pagination query params
        if (pageSize != null && page != null) {
            extra_params = extra_params.concat(
                [`page_size=${pageSize}`, `page=${page}`]
            );
        }

        // Sorting query params
        if (sortModel != null) {
            extra_params = extra_params.concat(
                sortModel.map(field => field.sort === 'asc' ?
                    `sort_by=${CONTENT_FIELDS[field.field]}`
                    :
                    `sort_by=-${CONTENT_FIELDS[field.field]}`
                ),
            );
        }

        if (params == null) {
            if (extra_params.length === 0) {
                return "/api/content/"
            } else {
                return "/api/content/?" + extra_params.join("&")
            }
        }

        const query_params = Object.keys(params).map(_key => {
            const key = _key as keyof Query
            const param = params[key]
            if (
                param === undefined || param === null ||
                isNumber(param) || isArray(param)
            ) {
                return undefined
            }

            const backend_key = key === "fileName" ?  "file_name" :
                key === "years" ? "published_date" :
                key === "reviewed" ? "reviewed_on" :
                key

            if (key === "status" && param === "all") {
                return undefined
            }

            if (isPlainObject(param)) {
                let both = ""
                if ("from" in (param as Object)) {
                    const from = (param as { from: any }).from
                    if (from !== null) {
                        if (key === "years") {
                            both += `${backend_key}_min=${
                                ("" + from).padStart(4, "0")
                            }-01-01`
                        } else if (key === "filesize") {
                            both += `${backend_key}_min=${from*1000000}`
                        }

                    } else {
                        both += `${backend_key}_min=${from}` 
                    }
                    if (!("to" in (param as Object))) {
                        return both;
                    }
                }
                if (both.length > 0) {
                    both += "&"
                }

                if ("to" in (param as Object)) {
                    const to = (param as { to: any }).to
                    if (to !== null) {
                        if (key === "years") {
                            both += `${backend_key}_max=${
                                ("" + to).padStart(4, "0")
                            }-12-31`
                        } else if (key === "filesize") {
                            both += `${backend_key}_max=${to*1000000}`
                        }
                    } else {
                        both += `${backend_key}_max=${to}`
                    }

                    return both
                }
                const metadata = [].concat(...Object.values(param)) as Metadata[];
                return metadata.length > 0 ?
                    metadata.map(m => `metadata=${m.id}`).join("&") :
                    undefined
            }

            if (isString(param) && param !== "") {
                return `${backend_key}=${param}`
            }

            return undefined
        }).filter(x => x !== undefined).concat(extra_params);
        return `/api/content/` + (query_params.length > 0 ?
            "?" + query_params.join("&") : "")
        
    },
    CONTENT: (id: number, pageSize?: number, page?: number) => {
        if (pageSize == null) {
            return `/api/content/${id}/`;
        } else {
            return `/api/content/${id}/?page_size=${pageSize}&page=${page}`
        }
    },
    CHECK_DUPLICATE: (hash: string) => `/api/check_duplicate?hash=${hash}`,
    USER_INFO: `/api/get_user/`,
}

export default APP_URLS
