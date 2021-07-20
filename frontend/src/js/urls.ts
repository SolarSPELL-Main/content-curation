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
    METADATA_TYPE_EXPORT: (id: number) => `/api/metadata_types/${id}/downloadAsCSV/`,
    CONTENT_LIST: (params?: Query, pageSize?: number, page?: number) => {
        let page_params: string[] = [];

        if (pageSize != null && page != null) {
            page_params = [`page_size=${pageSize}`, `page=${page}`]
        }

        if (params == null) {
            if (page_params.length === 0) {
                return "/api/content/"
            } else {
                return "/api/content/?" + page_params.join("&")
            }
        }

        const query_params = Object.keys(params).map(_key => {
            const key = _key as keyof Query
            const param = params[key]
            if (isString(param) && param != "") {
                return `${key}=${param}`
            }
            return undefined
        }).filter(x => x !== undefined).concat(page_params);
        const filterUrl = `/api/content/` + (query_params.length > 0 ?
            "?" + query_params.join("&") : "")
        
        return filterUrl
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
