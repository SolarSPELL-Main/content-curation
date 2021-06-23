//All hardcoded end-points live in this file
const APP_URLS = {
    METADATA_BY_TYPE: `/api/metadata/`,
    METADATA_TYPES: `/api/metadata_types/`,
    //api endpoint `/api/metadata_types/{type_id}/metadata/ ` returns all metadata of that type
    //to make it easier to support pagination later down the road
    METADATA_LIST: (id: number) => `/api/metadata_types/${id}/metadata/`
}

export default APP_URLS
