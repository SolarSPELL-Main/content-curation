import React from 'react';
import { format } from 'date-fns';

import {
    ContentSearch,
    ContentMetadataDisplay,
} from 'solarspell-react-lib';
import * as Actions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Status } from '../../enums';
import { Metadata, MetadataType, Query } from 'js/types';

/**
 * Boilerplate implementation of search bar for content.
 * @returns A search bar for content.
 */
function SearchBar(): React.ReactElement {
    const dispatch = useCCDispatch();
    const metadata = useCCSelector(state => state.metadata.metadata);
    const metadataTypes = useCCSelector(state => state.metadata.metadata_types);

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
                    field: 'file_name',
                    title: 'Filename',
                    type: 'string',
                    width: 4,
                },
                {
                    field: 'published_date',
                    title: 'Years',
                    type: 'numeric',
                    width: 2,
                    min: 0,
                    formatter: (val, field) => {
                        // Years < 2 throw an error on backend
                        // Greater than 9999 also means > 4 digits, which is bad
                        if (val < 2 || val > 9999) {
                            return '';
                        }

                        let suffix: string = '';

                        // If 'from', start date should be January 1st
                        if (field === 'from') {
                            suffix = '-01-01';
                        // If 'to', end date should be December 31st
                        } else {
                            suffix = '-12-31';
                        }

                        return val.toString().padStart(4, '0') + suffix;
                    }
                },
                {
                    field: 'filesize',
                    title: 'Filesize',
                    type: 'numeric',
                    unit: 'MB',
                    width: 2,
                    min: 0,
                    // Convert megabytes to bytes
                    formatter: val => val * 1024 * 1024,
                },
                {
                    field: 'reviewed_on',
                    title: 'Reviewed',
                    type: 'date',
                    width: 2,
                    formatter: date => format(date, 'yyyy-MM-dd'),
                },
                {
                    field: 'status',
                    title: 'Status',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        ...Object.values(Status).map(v => ({
                            value: v,
                            title: v,
                        })),
                    ],
                    initialValue: 'all',
                },
                {
                    field: 'created_by',
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
                    initialValue: 'true',
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
                        width: 6,
                        spacing: 2,
                        mb: 0,
                    }),
                  },
            ]}
            onQueryChange={query => {
                // Reset page back to start to avoid out-of-range errors
                dispatch(Actions.update_pagination({
                    page: 0,
                }));
                
                dispatch(Actions.update_filters(query as Query));
            }}
        />
    );
}

export default SearchBar;
