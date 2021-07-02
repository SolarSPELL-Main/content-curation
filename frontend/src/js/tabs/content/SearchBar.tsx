import React from 'react';

import { ContentSearch } from 'solarspell-react-lib';

type SearchBarProps = {
    onQueryChange: (vals: any) => void
}

/**
 * Boilerplate implementation of search bar for content.
 * @param props Callback for query changes.
 * @returns A search bar for content.
 */
function SearchBar({
    onQueryChange,
}: SearchBarProps): React.ReactElement {
    return (
        <ContentSearch
            fields={[
                {
                    label: 'title',
                    title: 'Title',
                    type: 'string',
                    width: 4,
                },
                {
                    label: 'fileName',
                    title: 'Filename',
                    type: 'string',
                    width: 4,
                },
                {
                    label: 'copyright',
                    title: 'Copyright Notes',
                    type: 'string',
                    width: 4,
                },
                {
                    label: 'years',
                    title: 'Years',
                    type: 'numeric',
                    width: 2,
                    min: 0,
                },
                {
                    label: 'filesize',
                    title: 'Filesize',
                    type: 'numeric',
                    unit: 'MB',
                    width: 2,
                    min: 0,
                },
                {
                    label: 'reviewed',
                    title: 'Reviewed',
                    type: 'date',
                    width: 2,
                },
                {
                    label: 'active',
                    title: 'Active',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        {
                            value: 'active',
                            title: 'Active',
                        },
                        {
                            value: 'inactive',
                            title: 'Inactive',
                        },
                    ],
                    initialValue: 'all',
                },
                {
                    label: 'duplicatable',
                    title: 'Duplicatable',
                    type: 'enum',
                    width: 2,
                    options: [
                        {
                            value: 'all',
                            title: 'All',
                        },
                        {
                            value: 'duplicatable',
                            title: 'Duplicatable',
                        },
                        {
                            value: 'nonduplicatable',
                            title: 'Non-Duplicatable',
                        },
                    ],
                    initialValue: 'all',
                },
            ]}
            onQueryChange={onQueryChange}
        />
    );
}

export default SearchBar;
