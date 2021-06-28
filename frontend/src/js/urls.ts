//All hardcoded end-points live in this file
const APP_URLS = {
    METADATA: (id: number) => `/api/metadata/${id}/`,
    //api endpoint `/api/metadata_types/{type_id}/metadata/ ` returns all 
    // metadata of that type
    //to make it easier to support pagination later down the road
    METADATA_BY_TYPE: (id: number) => `/api/metadata_types/${id}/metadata/`,
    METADATA_LIST: `/api/metadata/`,
    METADATA_TYPES: `/api/metadata_types/`,
    METADATA_TYPE: (id: number) => `/api/metadata_types/${id}/`,
    USER_INFO: `/api/get_user/`,
}

export default APP_URLS
