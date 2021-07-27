import axios from 'axios'
import Cookies from 'js-cookie';
import type { Content, CRUD, Permissions, SpecialPermissions } from 'js/types';

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
 * @param forceAll Whether to force all fields in Content to have a
 *                 corresponding field in the FormData, regardless of
 *                 if it is null/undefined.
 *                 Used for distinguishing patching / posting content.
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

    data.append('reviewed', content.reviewed?.toString() ?? 'false');
    
    if (content.reviewed && content.reviewedDate) {
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
    reviewed: 'reviewed',
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
