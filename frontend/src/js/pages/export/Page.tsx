import React from 'react';
import { Redirect } from 'react-router-dom';

import { useCCDispatch, useCCSelector } from '../../hooks';
import * as GlobalActions from '../../state/global';
import { hasPermission } from '../../utils';
import { Tabs } from '../../enums';

type PageProps = {

}

function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const permissions = useCCSelector(state => state.global.user.permissions);

    const canExport = hasPermission(permissions, 'special', 'export');

    React.useEffect(
        () => {
            if (canExport) {
                dispatch(GlobalActions.update_current_tab(Tabs.EXPORT));
            }
        },
        [dispatch],
    );

    // If user does not have sufficient permissions, redirect to home
    return canExport ? (
        <>
            <h1>Welcome to the export page!</h1>
        </>
    ) : <Redirect to={{ pathname: '/home' }} />;
}

export default Page;
