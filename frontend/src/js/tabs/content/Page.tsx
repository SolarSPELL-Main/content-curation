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
    // Can be changed to email, token, etc.
    const user = useCCSelector(state => state.global.user.username);

    React.useEffect(() => {
        dispatch(MetadataActions.fetch_metadatatype());
        dispatch(ContentActions.fetch_content()); // Will be needed at some point
    }, []);

    const onSubmit_ = React.useCallback(
        (content?: Content) => {
            if (content) {
                dispatch(ContentActions.add_content(content));
            }
        },
        [user],
    );

    return (
        <Modal
            metadata={metadata}
            metadataTypes={metadataTypes}
            onSubmit={onSubmit_}
        />
    );
}

export default Page;
