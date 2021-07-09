//Importing from outside the project
import React, { useEffect } from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as Actions from '../../state/metadata';
import { useCCDispatch, useCCSelector } from '../../hooks';

type PageProps = {

}

/**
 * The full page body for the metadata tab.
 * @param _ Unused for now
 * @returns The full page.
 */
function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const metadata = useCCSelector(state => state.metadata.metadata);
    const metadataTypes = useCCSelector(state => state.metadata.metadata_types);

    useEffect(() => {
        dispatch(Actions.fetch_metadatatype());
    }, [dispatch]);

    return (
        <Modal
            metadata={metadata}
            metadataTypes={metadataTypes}
            actions={{
                KebabMenu: {
                    onAdd: (metadataType, name) => 
                        dispatch(Actions.add_metadata({ name: name, type_id: metadataType.id })),
                    onEditType: (metadataType, name) => 
                        dispatch(Actions.edit_metadatatype({ name: name, type_id: metadataType.id })),
                    onDeleteType: (metadataType) => 
                        dispatch(Actions.delete_metadatatype({ type_id: metadataType.id })),
                },
                ActionPanel: {
                    onEdit: (metadata, name) => 
                        dispatch(Actions.edit_metadata({ name: name, id: metadata.id })),
                    onDelete: (metadata) => 
                        dispatch(Actions.delete_metadata({ type_id: metadata.metadataType.id, id: metadata.id })),
                },
                AddType: {
                    onAddType: (name) => 
                        dispatch(Actions.add_metadatatype({ name: name, type_id: -1 })),
                },
            }}
        />
    );
}

export default Page;
