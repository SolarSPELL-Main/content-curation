import React from 'react';
import Modal from './Modal';
import * as MetadataActions from '../../state/metadata';
import * as ContentActions from '../../state/content';
import { useCCDispatch, useCCSelector } from '../../hooks';

import { Content } from 'js/types';

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
    // Can be changed to email, token, etc.
    const user = useCCSelector(state => state.global.user.username);

    React.useEffect(() => {
        dispatch(MetadataActions.fetch_metadatatype());
        dispatch(ContentActions.fetch_content()); // Will be needed at some point
    }, []);

    const onAdd_ = React.useCallback(
        (content?: Content) => {
            if (content) {
                content.creator = user;
                dispatch(ContentActions.add_content(content));
            }
        },
        [user],
    );

    const onEdit_ = React.useCallback(
        (content: Content, vals: Partial<Content>) => {
            console.log(content, vals);
        },
        [],
    );

    const onToggleActive_ = React.useCallback(
        (content: Content, active: boolean) => {
            console.log(`Toggled ${content.title} active to ${active}`);
        },
        [],
    );

    const onView_ = React.useCallback(
        (content: Content) => {
            console.log(`Viewing ${content.title}`);
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
                    onToggleActive: onToggleActive_,
                    onView: onView_,
                },
                Toolbar: {
                    onAdd: onAdd_,
                },
            }}
        />
    );
}

export default Page;
