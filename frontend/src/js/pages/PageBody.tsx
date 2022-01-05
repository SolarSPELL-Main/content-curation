import React, { lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Loader from '../Loader';

const HomePage = lazy(() => import('./home'));
const MetadataPage = lazy(() => import('./metadata'));
const ContentPage = lazy(() => import('./content'));
const CopyrightPage = lazy(() => import('./copyright'));
const ProfilePage = lazy(() => import('./profile'));

import MetadataIcon from '../../assets/icons/metadata.png';
import ContentIcon from '../../assets/icons/content.png';
import CopyrightIcon from '../../assets/icons/copyright.png';
import ProfileIcon from '../../assets/icons/profile.png';

// Add Icon assets here if you would like it to appear in the homepage
// Key values should be corresponding paths
const icons = {
  '/metadata': MetadataIcon,
  '/content': ContentIcon,
  '/copyright': CopyrightIcon,
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
    <Suspense fallback={<Loader />}>
      <Switch>
        <Route path={'/content'}>
          <ContentPage />
        </Route>
        <Route path={'/metadata'}>
          <MetadataPage />
        </Route>
        <Route path={'/copyright'}>
          <CopyrightPage />
        </Route>
        <Route path={'/profile'}>
          <ProfilePage />
        </Route>
        <Route path={['/home', '/']}>
          <HomePage icons={icons} />
        </Route>
      </Switch>
    </Suspense>
  );
}
