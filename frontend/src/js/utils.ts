import axios from 'axios';
import Cookies from 'js-cookie';
import { isPlainObject, isString } from 'lodash';
import { Status } from './enums';
import type {
    Content,
    Metadata,
    CRUD,
    Permissions,
    Query,
    SpecialPermissions,
    Range,
} from 'js/types';
import APP_URLS from './urls';

/*
 * Custom axios object with headers set to the csrftoken
 */
export const api = axios.create({
    headers: { 'X-CSRFToken': Cookies.get("csrftoken") }
})

//If axios sees a 403 it will redirect the browser to the login page
api.interceptors.response.use(r => r, err => {
    const code = err?.response?.status
    if (code === 403) {
        window.location.href = APP_URLS.LOGIN_GOOGLE
    }
    throw err
})

/**
 * Converts Content to a FormData object for adding or editing content.
 * @param content Content to convert to FormData.
 * @returns FormData representing the Content.
 */
 export const contentToFormData = (content: Content): FormData => {
    const data = new FormData();
    data.append('file_name', content.fileName);
    data.append('title', content.title);

    if (content.file) {
        // Note: If not present in post request, error will be thrown
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
    
    data.append('copyright_notes', content.copyright ?? '');
    data.append('copyright_approved', content.copyrightApproved.toString());
    data.append('rights_statement', content.rightsStatement ?? '');
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
    data.append('copyright_site', content.copyrightSite ?? '');
    data.append('status', content.status);

    // Unused fields
    // These should be filled in by the backend
    // data.append('created_by', content.creator ?? 'admin');
    // data.append('created_on', format(Date.now(), 'yyyy-MM-dd'));
    // data.append('reviewed_by', '');
    // data.append('copyright_by', '');
    // data.append('published_year', content.datePublished ?? '');

    return data;
}


/**
 * Updates a CREATE/READ/UPDATE/DELETE permissions object.
 * Updates only if the field would become true, otherwise leaves it as is.
 * @param crud The CRUD permissions object to update.
 * @param permissions Should be some subset of 'C', 'R', 'U', and 'D'.
 * @returns A CRUD object.
 */
export const updateCRUDPermissions = (
    crud: CRUD,
    permissions: string,
): CRUD => {
    const newCrud = Object.assign({}, crud);

    if (permissions.includes('C')) {
        newCrud.create = true;
    }
    if (permissions.includes('R')) {
        newCrud.read = true;
    }
    if (permissions.includes('U')) {
        newCrud.update = true;
    }
    if (permissions.includes('D')) {
        newCrud.delete = true;
    }

    return newCrud;
}

/**
 * Creates a CREATE/READ/UPDATE/DELETE permissions object.
 * @param permissions Should be some subset of 'C', 'R', 'U', and 'D'.
 * @returns A CRUD object.
 */
export const createCRUDPermissions = (
    permissions?: string,
): CRUD => {
    const crud: CRUD = {
        create: false,
        read: false,
        update: false,
        delete: false,
    };

    if (permissions) {
        return updateCRUDPermissions(crud, permissions);
    } else {
        return crud;
    }
}

/**
 * Checks if permissions object includes this permission.
 * @param permissions The permissions object.
 * @param slice Which slice to check.
 * @param permission The specific CRUD permission.
 * @param mode If permission is an array, whether to check every single
 *             permission is present, or only if some are present.
 * @returns Whether the permissions object includes that permission.
 */
export const hasPermission = (
    permissions: Permissions,
    slice: keyof Permissions,
    permission: string|string[]=[],
    mode: 'every'|'some'='every',
): boolean => {
    if (slice !== 'special') {
        if (Array.isArray(permission)) {
            if (mode === 'every') {
                return permission.every(p => permissions[slice][p as keyof CRUD]);
            } else {
                return permission.some(p => permissions[slice][p as keyof CRUD]);
            }
        } else {
            return permissions[slice][permission as keyof CRUD];
        }
    } else {
        return permissions[slice][permission as keyof SpecialPermissions];
    }
}

// Maps frontend content field names to backend content field names
export const CONTENT_FIELDS: Record<string,string> = {
    id: 'id',
    notes: 'additional_notes',
    active: 'active',
    fileURL: 'content_file',
    originalSource: 'original_source',
    copyrighter: 'copyright_by',
    copyrightSite: 'copyright_site',
    copyright: 'copyright_notes',
    copyrightApproved: 'copyright_approved',
    creator: 'created_by',
    createdDate: 'created_on',
    reviewer: 'reviewed_by',
    reviewedDate: 'reviewed_on',
    description: 'description',
    fileName: 'file_name',
    datePublished: 'published_date',
    rightsStatement: 'rights_statement',
    filesize: 'filesize',
    status: 'status',
    title: 'title',
    metadata: 'metadata',
}

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

    finalRange.from = range.from != null ?
        range.from.toString()
        :
        // null/undefined casts to 'null'/'undefined' in string
        // conversion, hence must explicitly set query value
        // to empty string.
        '';
    
    finalRange.to = range.to != null ?
        range.to.toString()
        :
        '';
    
    return finalRange;
}

/**
 * Constructs an array of query parameters from a Query object.
 * @param query The Query object.
 * @param creator The current logged-in user (used for Created By Me).
 * @returns The query parameters in an array or null (if query is null or empty).
 */
export const queryToParams = (
    query?: Query,
    creator?: string,
): string[]|undefined => {
    if (!query) {
        return;
    }

    const queryParams: string[] = [];

    Object.entries(query).forEach(([key_, val]) => {
        const key = key_ as keyof Query;

        if (val == null) {
            return;
        }

        if (key === 'metadata') {
            // Special case, metadata must be converted to array of numbers
            // then repeatedly included in query parameters.
            const metadataRecord = val as Record<number,Metadata[]>;
            Object.values(metadataRecord).reduce<number[]>(
                (accum, metadata) => accum.concat(metadata.map(m => m.id)),
                [],
            ).forEach(v => queryParams.push(`metadata=${v}`));
        } else if (key === 'status') {
            // Special case, 'all' must be treated as null for query
            if (val !== 'all') {
                queryParams.push(`${key}=${val}`);
            }
        } else if (key === "created_by") {
            // Special case, defaults to created_by logged in user
            // unless otherwise specified
            if (creator != null && val !== 'false') {
                queryParams.push(`${key}=${creator ?? ''}`)
            }
        } else {
            // Simplest case, search value is a string
            if (isString(val)) {
                queryParams.push(`${key}=${val}`)
            // Assumes that if the Query value is an object, it represents a
            // Range object. Hence, ${key}_min and ${key}_max should exist in
            // the query parameters.
            } else if (isPlainObject(val)) {
                const finalRange = rangeToQuery(val as Range<number|string>)
                queryParams.push(`${key}_min=${finalRange.from}`);
                queryParams.push(`${key}_max=${finalRange.to}`);
            }
        }
    });

    if (queryParams.length > 0) {
        return queryParams;
    } else {
        return;
    }
}

/**
 * Triggers a download of a blob object with a given filename. Creates a
 * temporary hidden <a> tag that downloads the file and triggers a click event
 *
 * Credit to David Walsh at https://davidwalsh.name/javascript-download
 */
export const downloadFile = (file: Blob, fileName: string) => {
    // Create an invisible A element
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(
        file
    );

    // Use download attribute to set set desired file name
    a.setAttribute("download", fileName);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
}
