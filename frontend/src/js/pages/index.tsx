//Importing from outside the project
import React from 'react';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

//Importing from other files in the project
import HomePage from './home';
import MetadataPage, { Icon as MetadataIcon } from './metadata';
import ContentPage, { Icon as ContentIcon } from './content';
import ProfilePage, { Icon as ProfileIcon } from './profile';
import Logo from '../../assets/logo.png';
import CCNavBar, { TabDescriptor } from './NavBar';
import { Tabs } from '../enums';

// Style for the logo itself
const logoStyle: React.CSSProperties = {
    height: '75px',
    width: '300px',
    margin: '10px',
};

// Style for the tab associated with the logo
const logoTabStyle: React.CSSProperties = {
    width: '320px',
    maxWidth: '320px',
    backgroundColor: 'var(--ocean-blue)',
};

// Add Icon assets here if you would like it to appear in the homepage
// Key values should be corresponding paths
const icons = {
    '/metadata': MetadataIcon,
    '/content': ContentIcon,
    '/profile': ProfileIcon,
};

// Add tab props here for it to show up on the NavBar
const tabDescriptors: TabDescriptor[] = [
    {
        props: {
            component: RouterLink,
            style: logoTabStyle,
            to: '/home',
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
            to: "/profile",
            label: "Profile",
            value: Tabs.PROFILE,
        },
    },
];

export function NavBar(): React.ReactElement {
    return <CCNavBar tabDescriptors={tabDescriptors} />;
}

export function PageBody(): React.ReactElement {
    // Add route paths down here to make them accessible on the page
    // The home path ['/'] is all-consuming, so any unmatched URLs
    // will redirect to that Route.
    return (
        <Switch>
            <Route path={'/content'}>
                <ContentPage />
            </Route>
            <Route path={'/metadata'}>
                <MetadataPage />
            </Route>
            <Route path={'/profile'}>
                <ProfilePage />
            </Route>
            <Route path={['/home', '/']}>
                <HomePage icons={icons} />
            </Route>
        </Switch>
    );
}
