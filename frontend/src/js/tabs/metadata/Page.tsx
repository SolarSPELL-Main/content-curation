import React from 'react';
import Modal from './Modal';
import * as Actions from '../../state/metadata';
import { useCCDispatch, useCCSelector } from '../../hooks';

// import { MetadataType, Metadata } from '../../types';

// const mockMetadataTypes: MetadataType[] = [
//     {
//         name: 'Language',
//         id: 0,
//     },
//     {
//         name: 'Subject',
//         id: 1,
//     },
//     {
//         name: 'Audience',
//         id: 2,
//     },
// ];

// const mockMetadata: Record<number, Metadata[]> = {
//     0: [
//         {
//             creator: 'jz',
//             name: 'English',
//             id: 0,
//             metadataType: mockMetadataTypes[0],
//         },
//         {
//             creator: 'jz',
//             name: 'French',
//             id: 1,
//             metadataType: mockMetadataTypes[0],
//         },
//         {
//             creator: 'jz',
//             name: 'Spanish',
//             id: 2,
//             metadataType: mockMetadataTypes[0],
//         },
//     ],
//     1: [
//         {
//             creator: 'jz',
//             name: 'Computer Science',
//             id: 3,
//             metadataType: mockMetadataTypes[1],
//         },
//         {
//             creator: 'jz',
//             name: 'Mathematics',
//             id: 4,
//             metadataType: mockMetadataTypes[1],
//         },
//         {
//             creator: 'jz',
//             name: 'Politics',
//             id: 5,
//             metadataType: mockMetadataTypes[1],
//         },
//     ],
//     2: [

//     ],
// }

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

    return (
        <Modal
            metadata={metadata}
            metadataTypes={metadataTypes.map((name, idx) => {
                // TODO:
                // This is just a temporary fix for converting strings to metadata types
                // Need to determine whether in the end, the application will use metadata types or strings in its state
                return {
                    name: name,
                    id: idx,
                };
            })}
            actions={{
                KebabMenu: {
                    onAdd: (metadataType, name) => dispatch(Actions.add_metadata({ name: name, type_id: metadataType.id })),
                    onEditType: (metadataType, name) => dispatch(Actions.edit_metadatatype({ name: name, type_id: metadataType.id })),
                    onDeleteType: (metadataType) => dispatch(Actions.delete_metadatatype({ type_id: metadataType.id })),
                },
                ActionPanel: {
                    onEdit: (metadata, name) => dispatch(Actions.edit_metadata({ name: name, type_id: metadata.metadataType.id })),
                    onDelete: (metadata) => dispatch(Actions.delete_metadata({ type_id: metadata.metadataType.id })),
                },
                AddType: {
                    onAddType: (name) => dispatch(Actions.add_metadatatype({ name: name, type_id: -1 })),
                },
            }}
        />
    );
}

export default Page;
