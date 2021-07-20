import isString from "lodash/isString"
import type { Query, Metadata } from "js/types"
import {isArray, isNumber, isPlainObject} from "lodash"
//All hardcoded end-points live in this file
const APP_URLS = {
    LOGOUT: `/accounts/logout/`,
    METADATA: (id: number) => `/api/metadata/${id}/`,
    //api endpoint `/api/metadata_types/{type_id}/metadata/ ` returns all 
    // metadata of that type
    //to make it easier to support pagination later down the road
    METADATA_BY_TYPE: (id: number) => `/api/metadata_types/${id}/metadata/`,
    METADATA_LIST: `/api/metadata/`,
    METADATA_TYPES: `/api/metadata_types/`,
    METADATA_TYPE: (id: number) => `/api/metadata_types/${id}/`,
    METADATA_TYPE_EXPORT: (id: number) => `/api/metadata_types/${id}/downloadAsCSV`,
    CONTENT_LIST: (params?: Query) => {
        if (params === undefined) {
            return "/api/content/"
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

            if (isPlainObject(param)) {
                if ("from" in (param as Object)) {
                    const from = (param as { from: any }).from
                    if (from === null) return undefined
                    if (key === "years") {
                        return `${backend_key}_min=${
                            ("" + from).padStart(4, "0")
                        }-01-01`
                    }
                    return `${backend_key}_min=${from}`
                }
                if ("to" in (param as Object)) {
                    const to = (param as { to: any }).to
                    if (to === null) return undefined
                    if (key === "years") {
                        return `${backend_key}_max=${
                            ("" + to).padStart(4, "0")
                        }-12-31`
                    }

                    return `${backend_key}_max=${to}`
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
        }).filter(x => x !== undefined)
        return `/api/content/` + (query_params.length > 0 ?
            "?" + query_params.join("&") : "")
    },
    CONTENT: (id: number) => `/api/content/${id}/`,
    CHECK_DUPLICATE: (hash: string) => `/api/check_duplicate?hash=${hash}`,
    TOAST_MESSAGE: ``,
    USER_INFO: `/api/get_user/`,
}

export default APP_URLS
