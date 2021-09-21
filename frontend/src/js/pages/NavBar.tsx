import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

import Tab from '@material-ui/core/Tab';

import CCTabs from './Tabs';
import { useCCSelector } from '../hooks';
import { hasPermission } from '../utils/permissions';
import type { CheckedPermissions } from './ShowForPermission';
import { Tabs } from '../enums';
import { OCEAN_BLUE } from '../theme';
import Logo from '../../assets/logo.png';

/** Permissions associated with each tab */
type SlicePermission = {
    /** Provides option to have no permissions associated with a tab */
    [k in keyof CheckedPermissions]?: never
} | CheckedPermissions

/** Contains information about each tab in the navbar */
type TabDescriptor = {
    /** 
     * Properties passed to the underlying Tab component.
     * To work with react-dom, Tab must use RouterLink
     */
    props: React.ComponentProps<typeof Tab> &
        React.ComponentProps<typeof RouterLink>
} & SlicePermission

// Style for the logo itself
const logoStyle: React.CSSProperties = {
  maxHeight: '75px',
  margin: '10px',
};

// Style for the tab associated with the logo
const logoTabStyle: React.CSSProperties = {
  maxWidth: '350px',
  backgroundColor: OCEAN_BLUE,
};

// Add tab props here for it to show up on the NavBar
const tabDescriptors: TabDescriptor[] = [
  {
    props: {
      component: RouterLink,
      to: '/home',
      style: logoTabStyle,
      label: (
        <img src={Logo} style={logoStyle} />
      ),
      value: Tabs.HOME,
    },
  },
  {
    props: {
      component: RouterLink,
      to: '/metadata',
      label: 'Metadata',
      value: Tabs.METADATA,
    },
  },
  {
    props: {
      component: RouterLink,
      to: '/content',
      label: 'Content',
      value: Tabs.CONTENT,
    },
  },
    {
        props: {
            component: RouterLink,
            to: '/copyright',
            label: 'Copyright',
            value: Tabs.COPYRIGHT,
        }
    },
  {
    props: {
      component: RouterLink,
      to: '/profile',
      label: 'Profile',
      value: Tabs.PROFILE,
    },
  },
];

/**
 * This component is the full nav bar integrated with Redux global state.
 * It provides support for showing/hiding tabs based on user permissions.
 * @param props The properties of the nav bar.
 * @returns The nav bar.
 */
function NavBar(): React.ReactElement {
  const stateTab = useCCSelector(state => state.global.current_tab);
  const permissions = useCCSelector(state => state.global.user.permissions);

  // Check user has permission specified in tab descriptor before showing it
  const filteredDescriptors = tabDescriptors.filter(tab => {
    return tab.slice ?
      hasPermission(permissions, tab.slice, tab.permission, tab.mode)
      :
      true;
  });

  return (
    <CCTabs
      tabs={filteredDescriptors.map(v => v.props)}
      currentTab={stateTab}
    />
  );
}

export default NavBar;
