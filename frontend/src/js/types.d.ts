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
    groups: string[]
}
