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
    creator: string
} & BaseMetadata<MetadataType>

type Content = {
    active: boolean
    copyrighter?: string
    copyrightSite?: string
    copyrightApproved: boolean
    creator: string
    createdDate: string
    reviewed: boolean
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
    fileName: string
    copyright: string
    years: Range<number>
    filesize: Range<number>
    reviewed: Range<string>
    active: 'all' | 'active' | 'inactive'
    duplicatable: 'all' | 'duplicatable' | 'nonduplicatable'
    metadata: Record<number,Metadata[]>
    status: string
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
    groups: AuthGroup[]
    permissions: Permissions
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
