import React from 'react';

import HomePage from './home';
import MetadataPage, { Icon as MetadataIcon } from './metadata';
import ContentPage, { Icon as ContentIcon } from './content';
import ProfilePage from './profile';
import Logo from '../../assets/logo.png';

import NavBar from './NavBar';
import { Link as RouterLink, Route, Switch } from 'react-router-dom';

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
const icons = {
    'metadata': MetadataIcon,
    'content': ContentIcon,
};

// Add tab props here for it to show up on the NavBar
const tabDescriptors = [
    {
        component: RouterLink,
        style: logoTabStyle,
        to: '/home',
        label: (
            <img src={Logo} style={logoStyle} />
        ),
        value: 'home',
    },
    {
        component: RouterLink,
        to: '/metadata',
        label: 'Metadata',
        value: 'metadata',
    },
    {
        component: RouterLink,
        to: '/content',
        label: 'Content',
        value: 'content',
    },
    {
        component: RouterLink,
        to: "/profile",
        label: "Profile",
        value: "profile",
    },
];

export default function Tabs(): React.ReactElement {
    // Add route paths down here to make them accessible on the page
    // The home path ['/'] is all-consuming, so any unmatched URLs
    // will redirect to that Route.
    return (<>
        <NavBar tabDescriptors={tabDescriptors} />
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
    </>);
}
