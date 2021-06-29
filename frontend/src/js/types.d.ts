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
    notes: string
    active: boolean
    creator: string
    file?: File
    fileURL?: string
} & BaseContent<Metadata>

interface User {
    username: string
    email: string
    token: string
    groups: string[]
}
