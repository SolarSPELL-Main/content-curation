import React from 'react';
import { format, parseISO } from 'date-fns';

import {
    ContentSearch,
    ContentMetadataDisplay,
} from 'solarspell-react-lib';

import { Stage } from '../../enums';
import { Metadata, MetadataType, Query } from 'js/types';

type SearchBarProps = {
    metadata: Record<number,Metadata[]>
    metadataTypes: MetadataType[]
    onQueryChange: (vals: Query) => void
}

/**
 * Boilerplate implementation of search bar for content.
 * @param props Callback for query changes.
 * @returns A search bar for content.
 */
function SearchBar({
    metadata,
    metadataTypes,
    onQueryChange,
}: SearchBarProps): React.ReactElement {
    return (
        <ContentSearch
            fields={[
                {
                    field: 'title',
                    title: 'Title',
                    type: 'string',
                    width: 4,
                },
                {
                    field: 'fileName',
                    title: 'Filename',
                    type: 'string',
                    width: 4,
                },
                {
                    field: 'copyright',
                    title: 'Copyright Notes',
                    type: 'string',
                    width: 4,
                },
                {
                    field: 'years',
                    title: 'Years',
                    type: 'numeric',
                    width: 2,
                    min: 0,
                },
                {
                    field: 'filesize',
                    title: 'Filesize',
                    type: 'numeric',
                    unit: 'MB',
                    width: 2,
                    min: 0,
                },
                {
                    field: 'reviewed',
                    title: 'Reviewed',
                    type: 'date',
                    width: 2,
                    stringifier: date => format(date, 'yyyy-MM-dd'),
                    parser: val => parseISO(val),
                },
                {
                    field: 'active',
                    title: 'Active',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        {
                            value: 'true',
                            title: 'Active',
                        },
                        {
                            value: 'false',
                            title: 'Inactive',
                        },
                    ],
                    initialValue: 'all',
                },
                {
                    field: 'stage',
                    title: 'Stage',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        ...Object.values(Stage).map(v => ({
                            value: v,
                            title: v,
                        })),
                    ],
                    initialValue: 'all',
                },
                {
                    field: 'createdBy',
                    title: 'Created By',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'false',
                            title: 'All Content',
                        },
                        {
                            value: 'true',
                            title: 'Created by Me',
                        },
                    ],
                    initialValue: 'false',
                },
                {
                    field: 'metadata',
                    title: 'Metadata',
                    type: 'custom',
                    width: 12,
                    component: ContentMetadataDisplay,
                    propFactory: (setter, state) => ({
                        metadataTypes: metadataTypes,
                        metadata: state['metadata'] ?? {},
                        options: metadata,
                        actions: {
                            onSelect: (
                                metadataType: MetadataType,
                                tags: Metadata[],
                            ) => setter(
                                (oldState: any) => ({
                                    ...oldState,
                                    [metadataType.id]: tags,
                                })
                            ),
                        },
                    }),
                  },
            ]}
            onQueryChange={onQueryChange}
        />
    );
}

export default SearchBar;
