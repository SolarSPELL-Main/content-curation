import React, { useState } from "react"
import {Button, Typography} from "@material-ui/core"
import {BaseMetadata, BaseMetadataType, ContentTagger, GenericDialog} from "solarspell-react-lib"
import {useCCSelector} from "../../hooks"

export default () => {
    const [open, setOpen] = useState(false)
    const content_selected = useCCSelector(state => state.content.selected);
    const types = useCCSelector(state => state.metadata.metadata_types);
    const metadata = useCCSelector(state => state.metadata.metadata);

    return <>
        <Button onClick={_ => setOpen(true)}>Bulk Edit</Button>
        <GenericDialog
            open={open}
            title={`Bulk Edit ${content_selected.length} Items`}
            onClose={_ => setOpen(false)}
            actions={<></>}
        >
            <Typography>Add metadata</Typography>
            {types.map(type => <ContentTagger
                creatable={false}
                metadataType={type}
                selected={[]}
                options={metadata[type.id]}
                label={type.name}
            />)}
            <Typography>Remove metadata</Typography>
        </GenericDialog>
    </>
}

