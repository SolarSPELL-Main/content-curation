import type { GridSortModel } from '@material-ui/data-grid';

import type { Query } from 'js/types';

import { CONTENT_FIELDS, queryToParams } from './utils';

// All hardcoded end-points live in this file
export default {
  BUG_REPORT: 'https://docs.google.com/forms/d/e/'
        + '1FAIpQLScdPbE0AGVuNCvhy2gnTvmVNyQcQtd4vt6zBjjBgAwprb4VKg/viewform',
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
  CONTENT_LIST: (
    query?: Query,
    pageSize?: number,
    page?: number,
    sortModel?: GridSortModel,
    creator?: string,
  ): string => {
    let extra_params: string[] = [];

    // Pagination query params
    if (pageSize != null && page != null) {
      extra_params = extra_params.concat(
        [`page_size=${pageSize}`, `page=${page}`]
      );
    }

    // Sorting query params
    if (sortModel) {
      extra_params = extra_params.concat(
        sortModel.map(field => field.sort === 'asc' ?
          `sort_by=${CONTENT_FIELDS[field.field]}`
          :
          `sort_by=-${CONTENT_FIELDS[field.field]}`
        ),
      );
    }

    // By default, include ASC sort by title
    if (!sortModel || !sortModel.some(field => field.field === 'title')) {
      extra_params = extra_params.concat('sort_by=title');
    }

    // Filtering query params
    const query_params = extra_params.concat(
      queryToParams(query, creator) ?? [],
    );

    if (query_params.length === 0) {
      return '/api/content/';
    } else {
      return '/api/content/?' + query_params.join('&');
    }
  },
  CONTENT: (id: number, pageSize?: number, page?: number): string => {
    if (pageSize == null) {
      return `/api/content/${id}/`;
    } else {
      return `/api/content/${id}/?page_size=${pageSize}&page=${page}`;
    }
  },
  CHECK_DUPLICATE: (hash: string): string =>
    `/api/check_duplicate?hash=${hash}`,
  USER_INFO: '/api/get_user/',
};
