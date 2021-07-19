// TODO: Remove 'Metadata Specialist' / 'Content Specialist'
// Replace with 'Student'
export enum AuthGroup {
    ADMIN='Admin',
    LIB_SPECIALIST='Library Specialist',
    STUDENT1='Content Specialist',
    STUDENT2='Metadata Specialist',
}

export enum Stage {
    ACTIVE='Active',
    ARCHIVE='Archive',
    DEACCESSION='Deaccession',
    REVIEW='Review',
}

export enum Tabs {
    HOME='home',
    METADATA='metadata',
    CONTENT='content',
    PROFILE='profile',
}
