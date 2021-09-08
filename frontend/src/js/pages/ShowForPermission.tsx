import React from 'react';

import { useCCSelector } from '../hooks';
import { hasPermission } from '../utils/permissions';
import type { Permissions, CRUD, SpecialPermissions } from 'js/types';

/** Arguments passed to hasPermission */
type CheckedPermissions = {
    /** Which slice of permissions to check */
    slice: keyof Permissions
    /** Which permission to check for */
    permission: keyof CRUD|keyof SpecialPermissions|string[]
    /** Whether to check for some or all permissions */
    mode?: 'some'|'every'
}

/** Main props type */
type ShowForPermissionProps = {
    /** Elements to conditionally show */
    children?: React.ReactElement | React.ReactElement[]
} & CheckedPermissions

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
}: ShowForPermissionProps): React.ReactElement {
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

const ForwardedShowForPermission = React.forwardRef(
  (props: ShowForPermissionProps, _ref) => (
    <ShowForPermission {...props} />
  ),
);

export type { CheckedPermissions };
export default ForwardedShowForPermission;
