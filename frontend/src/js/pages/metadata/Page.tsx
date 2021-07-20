//Importing from outside the project
import React, { useEffect } from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as Actions from '../../state/metadata';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { update_current_tab } from '../../state/global';
import APP_URLS from '../../urls';
import { Tabs } from '../../enums';

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
        dispatch(update_current_tab(Tabs.METADATA));
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
                    onExport: (metadataType) =>
                        window.open(APP_URLS.METADATA_TYPE_EXPORT(metadataType.id)),
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
