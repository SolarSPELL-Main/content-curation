import React from 'react';

import { useCCSelector } from '../hooks';
import { hasPermission } from '../utils';
import { Permissions, CRUD } from 'js/types';

type ShowForPermissionProps = {
    slice: keyof Permissions
    permission: keyof CRUD|string[]
    mode?: 'some'|'every'
}

/**
 * Shows a component only if the user has permission for it.
 * @param props The permissions to check for.
 * @returns The component or null.
 */
function ShowForPermission({
    slice,
    permission,
    mode='every',
    children,
}: React.PropsWithChildren<ShowForPermissionProps>): React.ReactElement {
    const permissions = useCCSelector(state => state.global.user.permissions);
    const canShow = hasPermission(
        permissions,
        slice,
        permission,
        mode,
    );

    return (
        <>
            {canShow && children}
        </>
    );
}

export default ShowForPermission;
