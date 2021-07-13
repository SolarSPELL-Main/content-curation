import axios from 'axios'
import { Content } from 'js/types';


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
    // TODO: Currently cannot delete all metadata tags on a piece of content.
    // This is because when there is no metadata on a piece of content,
    // the PATCH request sends nothing in the 'metadata' field. The backend
    // therefore does not update the metadata field to be empty, since it
    // assumes no modifications are to be made. Find a way to explicitly
    // specify that the metadata array should be empty.
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
    // TODO: published_date should no longer be required on
    // the backend. Until then, a very improbable date will be
    // assigned as a placeholder (0001-01-01).
    data.append('published_date', content.datePublished ? 
        `${content.datePublished.padStart(4, '0')}-01-01`
        :
        '0001-01-01'
    );

    // Unused fields
    // data.append('active', 'true');
    // data.append('created_by', content.creator ?? 'admin');
    // data.append('created_on', format(Date.now(), 'yyyy-MM-dd'));
    // data.append('reviewed_by', '');
    // data.append('copyright_by', '');
    // data.append('published_year', content.datePublished ?? '');

    return data;
}

export const api = axios.create({
    headers: { 'X-CSRFToken': getCookie("csrftoken") }
})

