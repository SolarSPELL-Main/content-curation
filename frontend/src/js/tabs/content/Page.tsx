//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as MetadataActions from '../../state/metadata';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';
import { Content, Query } from 'js/types';

type PageProps = {

}

/**
 * The full page body for the content tab.
 * @param _ Unused for now
 * @returns The full page.
 */
function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const metadata = useCCSelector(state => state.metadata.metadata);
    const metadataTypes = useCCSelector(state => state.metadata.metadata_types);
    const content = useCCSelector(state => state.content.content);

    React.useEffect(() => {
        dispatch(MetadataActions.fetch_metadatatype());
        dispatch(ContentActions.fetch_content());
    }, [dispatch]);

    const onEdit_ = React.useCallback(
        (content: Content, vals: Partial<Content>) => {
            console.log(content, vals);
        },
        [],
    );

    const onDelete_ = React.useCallback(
        (content: Content) => {
            dispatch(ContentActions.delete_content(content.id));
        },
        [dispatch],
    );

    const onSelectedDelete_ = React.useCallback(
        (content: Content[]) => {
            console.log(content);
        },
        [],
    );

    const onView_ = React.useCallback(
        (content: Content) => {
            console.log(`Viewing ${content.title}`);
        },
        [],
    );

    const onAdd_ = React.useCallback(
        (content?: Content) => {
            if (content) {
                dispatch(ContentActions.add_content(content));
            }
        },
        [dispatch],
    );

    const onQueryChange_ = React.useCallback(
        (query: Query) => {
            console.log(query);
        },
        [],
    );

    return (
        <Modal
            metadata={metadata}
            metadataTypes={metadataTypes}
            content={content}
            actions={{
                Display: {
                    onEdit: onEdit_,
                    onDelete: onDelete_,
                    onSelectedDelete: onSelectedDelete_,
                    onView: onView_,
                },
                Toolbar: {
                    onAdd: onAdd_,
                },
                Search: {
                    onQueryChange: onQueryChange_,
                }
            }}
        />
    );
}

export default Page;
