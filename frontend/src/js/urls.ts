import isString from "lodash/isString"
import type { Query } from "js/types"
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
    CONTENT_LIST: (params?: Query) => {
        if (params === undefined) {
            return "/api/content/"
        }
        const query_params = Object.keys(params).map(_key => {
            const key = _key as keyof Query
            const param = params[key]
            if (isString(param) && param != "") {
                return `${key}=${param}`
            }
            return undefined
        }).filter(x => x !== undefined)
        return `/api/content/` + (query_params.length > 0 ?
            "?" + query_params.join(",") : "")
    },
    CONTENT: (id: number) => `/api/content/${id}/`,
    TOAST_MESSAGE: ``,
    USER_INFO: `/api/get_user/`,
}

export default APP_URLS
