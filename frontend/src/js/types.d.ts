//Importing from other files in the project
import type {
    BaseMetadata,
    BaseMetadataType,
    BaseContent
} from "solarspell-react-lib"

type MetadataType = {

} & BaseMetadataType

type Metadata = {
    creator: string
} & BaseMetadata<MetadataType>

type Content = {
    active: boolean
    copyrighter?: string
    copyrightApproved: boolean
    creator: string
    createdDate: string
    reviewer?: string
    file?: File
    fileURL?: string
    notes?: string
} & BaseContent<Metadata>

interface User {
    username: string
    email: string
    token: string
    groups: AuthGroup[]
}

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
}>

type Toast = {
    key: number
    severity: "success" | "warning" | "error"
    message: string
}

type AuthGroup = 
    'Admin' |
    'Library Specialist' |
    'Metadata Specialist' |
    'Content Specialist'
