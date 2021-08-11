/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import Icons from './Icons';
import { useCCDispatch } from '../../hooks';
import { update_current_tab } from '../../state/global';
import { Tabs } from '../../enums';

/** Main props type */
type PageProps = {
    /** See Icons for prop description */
    icons: Record<string,any>
}

/**
 * The home tab of the application.
 * @param props The icons to be displayed on the homepage.
 * @returns The home tab body.
 */
function Page({
  icons,
}: PageProps): React.ReactElement {
  const dispatch = useCCDispatch();

  React.useEffect(
    () => {
      dispatch(update_current_tab(Tabs.HOME));
    },
    [dispatch],
  );

  return (
    <Icons icons={icons} />
  );
}

export default Page;
