//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Modal from './Modal';
import * as GlobalActions from '../../state/global';
import * as MetadataActions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import { Tabs } from '../../enums';

/**
 * The full page body for the content tab.
 * @returns The full page.
 */
function Page(): React.ReactElement {
    const dispatch = useCCDispatch();

    React.useEffect(() => {
        // Avoids accidentally adding metadata added from metadata tab
        dispatch(MetadataActions.update_newly_added([]));
        dispatch(GlobalActions.update_current_tab(Tabs.CONTENT));
        dispatch(MetadataActions.fetch_metadatatype());
    }, [dispatch]);

    return (
        <Modal />
    );
}

export default Page;
