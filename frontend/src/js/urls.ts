const APP_URLS = {
    METADATA_BY_TYPE: `/api/metadata/`,
    METADATA_TYPES: `/api/metadata_types/`,
    METADATA_LIST: (id: number) => `/api/metadata_types/${id}/metadata/`
}

export default APP_URLS
