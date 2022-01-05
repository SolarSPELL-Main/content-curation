import React, { useState, useEffect } from "react"
import {Button, Typography} from "@material-ui/core"
import {
    BaseMetadata, BaseMetadataType, ContentTagger, GenericDialog
} from "solarspell-react-lib"
import {useCCDispatch, useCCSelector} from "../../hooks"

import {useImmer} from "use-immer"
import {bulk_edit} from "../../state/content"

export default () => {
    const [open, setOpen] = useState(false)

    const content_selected = useCCSelector(state => state.content.selected);
    const types = useCCSelector(state => state.metadata.metadata_types);
    const metadata = useCCSelector(state => state.metadata.metadata);
    const [to_edit, update_edit] = useImmer<Record<number, BaseMetadata[]>>({})
    const [to_remove, update_remove] = useImmer<Record<number, BaseMetadata[]>>({})
    const dispatch = useCCDispatch()

    return <>
        <Button onClick={_ => setOpen(true)}>Bulk Edit</Button>
        <GenericDialog
            open={open}
            title={`Bulk Edit ${content_selected.length} Items`}
            onClose={_ => setOpen(false)}
            actions={<>
                <Button color="secondary" onClick={() => setOpen(false)}>Cancel</Button>
                <Button
                    onClick={() => {
                        setOpen(false)
                        dispatch(bulk_edit({
                            to_add: Object.values(to_edit).reduce((acc, current) =>
                                acc.concat(current), []
                            ),
                            to_remove: Object.values(to_remove)
                                .reduce((acc, current) =>
                                acc.concat(current), []
                            )
                        }))
                    }}
                >
                    Edit
                </Button>
            </>}
        >
            <Typography style={{minWidth: "400px"}}>Metadata to Add</Typography>
            {types.map((type, idx) => <ContentTagger
                key={idx}
                creatable={false}
                metadataType={type}
                selected={type.id in to_edit ?
                    to_edit[type.id] :
                    []}
                options={metadata[type.id]}
                label={type.name}
                onSelect={(_, tags) => update_edit(draft => {
                    draft[type.id] = tags
                })}
            />)}
            <Typography style={{marginTop: "2em"}}>Metadata to Remove</Typography>
            {types.map((type, idx) => <ContentTagger
                key={idx}
                creatable={false}
                metadataType={type}
                selected={type.id in to_remove ?
                    to_remove[type.id] :
                    []}
                options={metadata[type.id]}
                label={type.name}
                onSelect={(_, tags) => update_remove(draft => {
                    draft[type.id] = tags
                })}
            />)}
        </GenericDialog>
    </>
}

