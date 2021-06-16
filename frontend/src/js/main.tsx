import React from "react";
import { useCCSelector, useCCDispatch } from './hooks';
import { add_metadata } from "./state/metadata";
import Button from "@material-ui/core/Button";
import { Switch, Route } from 'react-router-dom';
import { Modal as ContentModal } from './tabs/content';
import { Modal as MetadataModal } from './tabs/metadata';
import { NavBar } from "./tabs";

import { Metadata, MetadataType } from "./types";

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

/*
 * Component to test adding metadata to the global store
 */
export default () => {
    const metadata_types = useCCSelector(state => state.metadata.metadata_types)
    // const metadata_by_type = useCCSelector(state => state.metadata.metadata_types)
    const dispatch = useCCDispatch()
    const [myState, setState] = React.useState(0)

    return <>
        <NavBar />
        <h1>{myState}</h1>
        <Button onClick={() => setState(1)} />
        <h1>{metadata_types.join(", ")}</h1>
        <Button onClick={() => dispatch(add_metadata({name: "Sample_Metadata", type_id: 0}))}>Add</Button>
        <Switch>
            <Route path={'/content'}>
                <ContentModal
                    metadata={mockMetadata}
                    metadataTypes={mockMetadataTypes}
                    onClick={(v) => console.log(v)}
                />
            </Route>
            <Route path={'/metadata'}>
                <MetadataModal
                    metadata={mockMetadata}
                    metadataTypes={mockMetadataTypes}
                    onAddType={(name) => console.log(name)}
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
                    }}
                />
            </Route>
        </Switch>
    </>
}
