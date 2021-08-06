//Importing from other files in the project
import type {
    BaseMetadata,
    BaseMetadataType,
    BaseContent
} from "solarspell-react-lib"

import type { AuthGroup, Status } from './enums';

type MetadataType = {

} & BaseMetadataType

type Metadata = {

} & BaseMetadata<MetadataType>

type Content = {
    copyrighter?: string
    copyrightSite?: string
    copyrightApproved: boolean
    creator: string
    createdDate: string
    reviewer?: string
    reviewedDate?: string
    file?: File
    fileURL?: string
    originalSource?: string
    notes?: string
    filesize?: number
    status: Status
} & BaseContent<Metadata>

type Range<T> = {
    from?: T
    to?: T
}

type Query = Partial<{
    title: string
    file_name: string
    published_date: Range<number>
    filesize: Range<number>
    reviewed_on: Range<string>
    status: Status
    created_by: string
    metadata: Record<number,Metadata[]>
}>

type Toast = {
    key: number
    severity: "success" | "warning" | "error"
    message: string
}

type User = {
    username: string
    email: string
    token: string
    user_id: number
    groups: AuthGroup[]
    profile?: Profile
    permissions: Permissions
}

type Profile = {
    num_content: number
}

type CRUD = {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
}

type SpecialPermissions = {
    admin: boolean
    export: boolean
    review: boolean
}

type Permissions = {
    content: CRUD
    metadata: CRUD
    special: SpecialPermissions
}
