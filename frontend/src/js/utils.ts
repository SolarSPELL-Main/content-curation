import axios from 'axios';
import Cookies from 'js-cookie';
import { isPlainObject, isString, isNumber } from 'lodash';
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

/*
 * Taken from Django documentation https://docs.djangoproject.com/en/3.2/ref/csrf/
 * Takes the name of a cookie and returns its value
 */
export const getCookie = (name: string): string | null => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const api = axios.create({
    headers: { 'X-CSRFToken': Cookies.get("csrftoken") }
})

api.interceptors.response.use(r => r, err => {
    const code = err?.response?.status
    if (code === 403) {
        window.location.href = "/accounts/google/login/"
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
    // data.append('active', 'true');
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
 * Constructs an array of query parameters from a Query object.
 * @param query The Query object.
 * @param creator The current logged-in user (used for Created By Me).
 * @returns The query parameters in an array or undefined (if query is null).
 */
export const queryToParams = (
    query?: Query,
    creator?: string,
): string[]|undefined => {
    if (!query) {
        return;
    }

    const queryParams: string[] = [];

    // Loop over each key in the query
    Object.entries(query).forEach(([key_, val]) => {
        const key = key_ as keyof Query;

        if (val == null) {
            return;
        }

        if (key === 'metadata') {
            // Special case, metadata must be converted to array of numbers
            // then repeatedly included in query parameters.
            const metadata = val as Record<number,Metadata[]>;
            Object.values(metadata).reduce<number[]>(
                (accum, val) => accum.concat(val.map(m => m.id)),
                [],
            ).forEach(v => queryParams.push(`metadata=${v}`));
        } else if (key === 'created_by') {
            // Special case, true/false should map to including username or not
            if (val === 'true') {
                queryParams.push(`${key}=${creator ?? ''}`)
            }
        } else if (key === 'status') {
            // Special case, 'all' must be treated as null for query
            if (val !== 'all') {
                queryParams.push(`${key}=${val}`);
            }
        } else {
            // Simplest case, search value is a string
            if (isString(val)) {
                queryParams.push(`${key}=${val}`)
            // Assumes that if the Query value is an object, it represents a
            // Range object. Hence, ${key}_min and ${key}_max should exist in
            // the query parameters.
            } else if (isPlainObject(val)) {
                const range = val as Range<number|string>;
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
