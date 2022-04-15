import type { GridSortModel } from '@material-ui/data-grid';
import { isPlainObject, isString } from 'lodash';

import { Status } from '../enums';
import type {
  Content,
  Metadata,
  Query,
  Range,
  ContentPermissions,
} from 'js/types';

/**
 * Maps frontend content field names to backend content field names
 */
export const CONTENT_FIELDS: Record<string,string> = {
  id: 'id',
  notes: 'additional_notes',
  active: 'active',
  fileURL: 'content_file',
  originalSource: 'original_source',
  copyrighter: 'copyright_by',
  copyrightSite: 'copyright_site',
  copyright_notes: 'copyright_notes',
  copyright: 'copyright',
  copyrightApproved: 'copyright_approved',
  creator: 'created_by',
  createdDate: 'created_on',
  reviewer: 'reviewed_by',
  reviewedDate: 'reviewed_on',
  description: 'description',
  fileName: 'file_name',
  datePublished: 'published_date',
  filesize: 'filesize',
  status: 'status',
  title: 'title',
  metadata: 'metadata',
};

/**
 * Converts Content to a FormData object for adding or editing content.
 * @param content Content to convert to FormData.
 * @returns FormData representing the Content.
 */
export const contentToFormData = (content: Content): FormData => {
  const data = new FormData();
  data.append('file_name', content.fileName);
  data.append('title', content.title);
  data.append('display_title', content.display_title ?? '');

  if (content.file) {
    // Note: If content_file not present in post request, error will be thrown
    data.append('content_file', content.file);
  }

  data.append('description', content.description ?? '');

  // For many-to-many fields
  // Django expects FormData with repeated fields
  Object.values(content.metadata ?? {}).forEach(
    val => val.forEach(metadata => {
      data.append('metadata', metadata.id.toString());
    })
  );

  if ((content.copyright_permissions?.id ?? 0) !== 0) {
      data.append('copyright', content.copyright_permissions?.id.toString() ?? "")
  }
  data.append('copyright_notes', content.copyright ?? '');
  data.append('additional_notes', content.notes ?? '');

  // Same format as DLMS, default to Jan. 1st
  data.append('published_date', content.datePublished ? 
    `${content.datePublished.padStart(4, '0')}-01-01`
    :
    ''
  );
    
  // Append reviewed_on if content status is not REVIEW
  if (content.status !== Status.REVIEW && content.reviewedDate) {
    data.append('reviewed_on', content.reviewedDate);
  }

  data.append('original_source', content.originalSource ?? '');
  data.append('status', content.status);

  return data;
};

/**
 * Converts a Range object into a query-compatible format.
 * @param range The Range object to convert
 * @returns The Range object with its values converted to strings
 */
const rangeToQuery = (range: Range<number|string>): {
  from: string,
  to: string,
} => {
  const finalRange = {
    from: '',
    to: '',
  };

  // null/undefined casts to 'null' and 'undefined' as string, hence must
  // add explicit empty string.
  finalRange.from = range.from?.toString() ?? '';
  finalRange.to = range.to?.toString() ?? '';
  
  return finalRange;
};

/**
* Utility type for specifying reducers in reduceQuery.
* Function should return whether to stop evaluation of future reducers or not.
*/
type QueryReducer =
  (key: keyof Query, val: Query[keyof Query], params: string[]) => boolean

/**
* Reduces a Query into array of strings according to reducer functions.
* @param query The Query object to reduce
* @param reducers The array of reducer functions.
*                 Reducers are evaluated from first to last
* @returns An array of strings, derived from the Query
*/
const reduceQuery = (query: Query, reducers: QueryReducer[]): string[] => {
  const params: string[] = [];

  Object.entries(query).forEach(([key_, val]) => {
    const key = key_ as keyof Query;

    if (val == null) {
      return;
    }

    // Relies on the fact .some short-circuits on first true value
    reducers.some(reducer => reducer(key,val,params));
  });

  return params;
};

/**
* Constructs an array of query parameters from a Query object.
* @param query The Query object.
* @param creator The current logged-in user (used for Created By Me).
* @returns The query parameters in an array or null (if query is null).
*/
const queryToParams = (
  query?: Query,
  creator?: string,
): string[]|undefined => {
  if (!query) {
    return;
  }

  const reducers: QueryReducer[] = [
    (key, val, params) => {
      if (key !== 'metadata') {
        return false;
      }

      // Special case, metadata must be converted to array of numbers
      // then repeatedly included in query parameters.
      const metadataRecord = val as Record<number,Metadata[]>;
      Object.values(metadataRecord).reduce<number[]>(
        (accum, metadata) => accum.concat(metadata.map(m => m.id)),
        [],
      ).forEach(v => params.push(`${key}=${v}`));

      return true;
    },
    (key, val) => {
      // Special case, 'all' must be treated as null for query
      // If this is true, reducer short-circuits evaluation and implicitly
      // excludes val
      // Otherwise, val is included into query params under 'status'
      return key === 'status' && val === 'all';
    },
    (key, val, params) => {
      if (key !== 'created_by') {
        return false;
      }

      // Special case, defaults to created_by logged in user
      // unless otherwise specified
      if (creator != null && val !== 'false') {
        params.push(`${key}=${creator}`);
      }

      return true;
    },
    (key, val, params) => {
      if (key !== 'copyright') {
        return false;
      }
      params.push(`${key}=${(val as ContentPermissions).id}`);
      return true;
    },
    (key, val, params) => {
      // Simplest case, search value is a string
      // Excludes empty string by checking val is truthy
      if (isString(val) && val) {
        params.push(`${key}=${val}`);
      // Assumes that if the Query value is an object, it represents a
      // Range object. Hence, ${key}_min and ${key}_max should exist in
      // the query parameters.
      } else if (isPlainObject(val)) {
        const finalRange = rangeToQuery(val as Range<number|string>);
        params.push(`${key}_min=${finalRange.from}`);
        params.push(`${key}_max=${finalRange.to}`);
      }

      return true;
    },
  ];

  return reduceQuery(query, reducers);
};

/**
 * Fully constructs the query string for the content list endpoint
 * @param query The Query object specifying the filters to use
 * @param pageSize The size of pages used during pagination
 * @param page The specific page to fetch
 * @param sortModel How content should be sorted
 * @param creator The user to use for the created_by filter
 * @returns The full query string for the content list endpoint
 */
export const getContentQueryString = (
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

  return query_params.join('&');
};
