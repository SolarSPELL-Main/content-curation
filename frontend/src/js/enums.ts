/**
 * Authorization groups associated with a user
 * Edits on the backend are NOT reflected unless manually done
 */
export enum AuthGroup {
    ADMIN='Admin',
    LIB_SPECIALIST='Library Specialist',
    STUDENT='Student',
}

/**
 * Status of a piece of content
 * Should match the STATUS enum on the backend as well
 */
export enum Status {
    REVIEW='Review',
    ACTIVE='Active',
    ARCHIVE='Archive',
    DEACCESSION='Deaccession',
}

/**
 * Possible tabs the user can be on in the application
 */
export enum Tabs {
    HOME='home',
    METADATA='metadata',
    CONTENT='content',
    PROFILE='profile',
    COPYRIGHT='copyright',
    ORGANIZATIONS='organizations',
}

