import type { BaseMetadata, BaseMetadataType } from "solarspell-react-lib"

type MetadataType = {

} & BaseMetadataType

type Metadata = {
    creator: string
} & BaseMetadata<MetadataType>

interface User {
    username: string
    email: string
    token: string
    groups: string[]
}
