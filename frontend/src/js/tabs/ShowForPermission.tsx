import React from 'react';

import { useCCSelector } from '../hooks';
import { hasPermission } from '../utils';
import { Permissions, CRUD } from 'js/types';

type ShowForPermissionProps = {
    slice: keyof Permissions
    permission: keyof CRUD|string[]
}

/**
 * Shows a component only if the user has permission for it.
 * @param props The permissions to check for.
 * @returns The component or null.
 */
function ShowForPermission({
    slice,
    permission,
    children,
}: React.PropsWithChildren<ShowForPermissionProps>): React.ReactElement {
    const permissions = useCCSelector(state => state.global.user.permissions);
    const canShow = hasPermission(
        permissions,
        slice,
        permission,
    );

    return (
        <>
            {canShow && children}
        </>
    );
}

export default ShowForPermission;
