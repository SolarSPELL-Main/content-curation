import React from 'react';
import Modal from './Modal';

import { MetadataType, Metadata } from '../../types';

const mockMetadataTypes: MetadataType[] = [
    {
        name: 'Language',
        id: 0,
    },
    {
        name: 'Subject',
        id: 1,
    },
    {
        name: 'Audience',
        id: 2,
    },
];

const mockMetadata: Record<number, Metadata[]> = {
    0: [
        {
            creator: 'jz',
            name: 'English',
            id: 0,
            metadataType: mockMetadataTypes[0],
        },
        {
            creator: 'jz',
            name: 'French',
            id: 1,
            metadataType: mockMetadataTypes[0],
        },
        {
            creator: 'jz',
            name: 'Spanish',
            id: 2,
            metadataType: mockMetadataTypes[0],
        },
    ],
    1: [
        {
            creator: 'jz',
            name: 'Computer Science',
            id: 3,
            metadataType: mockMetadataTypes[1],
        },
        {
            creator: 'jz',
            name: 'Mathematics',
            id: 4,
            metadataType: mockMetadataTypes[1],
        },
        {
            creator: 'jz',
            name: 'Politics',
            id: 5,
            metadataType: mockMetadataTypes[1],
        },
    ],
    2: [

    ],
}

type PageProps = {

}

/**
 * The full page body for the metadata tab.
 * @param _ Unused for now
 * @returns The full page.
 */
function Page(_: PageProps): React.ReactElement {
    return (
        <Modal
            metadata={mockMetadata}
            metadataTypes={mockMetadataTypes}
            actions={{
                KebabMenu: {
                    onAdd: (metadataType, name) => console.log(`${name} added to ${metadataType}`),
                    onEditType: (metadataType, name) => console.log(`${metadataType} named to ${name}`),
                    onDeleteType: (metadataType) => console.log(`${metadataType} deleted`),
                },
                ActionPanel: {
                    onEdit: (metadata, name) => console.log(`${metadata} named to ${name}`),
                    onDelete: (metadata) => console.log(`${metadata} deleted`),
                },
                AddType: {
                    onAddType: (name) => console.log(name),
                },
            }}
        />
    );
}

export default Page;
