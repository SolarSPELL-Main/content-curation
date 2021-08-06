import React from 'react';
import { Route, Switch } from 'react-router-dom';

import HomePage from './home';
import MetadataPage, { Icon as MetadataIcon } from './metadata';
import ContentPage, { Icon as ContentIcon } from './content';
import ProfilePage, { Icon as ProfileIcon } from './profile';

// Add Icon assets here if you would like it to appear in the homepage
// Key values should be corresponding paths
const icons = {
    '/metadata': MetadataIcon,
    '/content': ContentIcon,
    '/profile': ProfileIcon,
};

/**
 * The Router used to switch between different pages of the web app.
 * Only accounts for the body of the page, not footer/navbar/etc.
 * @returns The page body of the web app.
 */
export default function PageBody(): React.ReactElement {
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
