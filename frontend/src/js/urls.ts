// All hardcoded end-points live in this file
export default {
  BUG_REPORT: 'https://docs.google.com/forms/d/e/'
        + '1FAIpQLScdPbE0AGVuNCvhy2gnTvmVNyQcQtd4vt6zBjjBgAwprb4VKg/viewform',
  BULK_EDIT: '/api/bulk_edit_content/',
  EXPORT: '/api/export/',
  LOGIN_GOOGLE: '/accounts/google/login/',
  LOGOUT: '/accounts/logout/',
  METADATA: (id: number): string => `/api/metadata/${id}/`,
  //api endpoint `/api/metadata_types/{type_id}/metadata/ ` returns all 
  // metadata of that type
  //to make it easier to support pagination later down the road
  METADATA_BY_TYPE: (id: number): string =>
    `/api/metadata_types/${id}/metadata/`,
  METADATA_LIST: '/api/metadata/',
  // To ensure relatively consistent ordering, sort query param included
  METADATA_TYPES: '/api/metadata_types/?sort_by=name',
  METADATA_TYPE: (id: number): string => `/api/metadata_types/${id}/`,
  METADATA_TYPE_EXPORT: (id: number): string =>
    `/api/metadata_types/${id}/downloadAsCSV/`,
  CONTENT_LIST: (queryString?: string): string => queryString ?
    '/api/content/?'.concat(queryString)
    :
    '/api/content/',
  CONTENT: (id: number): string => `/api/content/${id}/`,
  CHECK_DUPLICATE: (hash: string): string =>
    `/api/check_duplicate?hash=${hash}`,
  USER_INFO: '/api/get_user/',
};
