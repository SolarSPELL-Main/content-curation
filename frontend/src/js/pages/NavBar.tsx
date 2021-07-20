//Importing from outside the project
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Tab from '@material-ui/core/Tab';

//Importing from other files in the project
import Tabs from './Tabs';
import { useCCSelector } from '../hooks';
import { hasPermission } from '../utils';
import type { Permissions, CRUD, SpecialPermissions } from 'js/types';

type TabProps = React.ComponentProps<typeof Tab> &
    React.ComponentProps<typeof RouterLink>

type SlicePermission = {
    slice?: never
    permission?: never
    mode?: never
} | {
    slice: 'special'
    permission: keyof SpecialPermissions|string[]
    mode?: 'some'|'every'
} | {
    slice: Exclude<keyof Permissions, 'special'>
    permission: keyof CRUD|string[]
    mode?: 'some'|'every'
}

type TabDescriptor = {
    props: TabProps
} & SlicePermission

type NavBarProps = {
    tabDescriptors: TabDescriptor[]
}

/**
 * This component is the full nav bar integrated with Redux global state.
 * @param props The properties of the nav bar.
 * @returns The nav bar.
 */
function NavBar({
    tabDescriptors,
}: NavBarProps): React.ReactElement {
    const stateTab = useCCSelector(state => state.global.current_tab);
    const permissions = useCCSelector(state => state.global.user.permissions);

    // Check user has permission specified in tab descriptor before showing it
    const filteredDescriptors = tabDescriptors.filter(tab => {
        return tab.slice ?
            hasPermission(permissions, tab.slice, tab.permission, tab.mode)
            :
            true
    });

    return (
        <Tabs
            tabs={filteredDescriptors.map(v => v.props)}
            currentTab={stateTab}
        />
    );
}

export type { TabDescriptor };
export default NavBar;
