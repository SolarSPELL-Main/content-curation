import React from 'react';

import Body from './Body';
import * as GlobalActions from '../../state/global';
import * as MetadataActions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import { Tabs } from '../../enums';
import { fetch_copyright } from "../../state/copyright"
import { fetch_organization } from "../../state/organization"

/**
 * The full page body for the content tab.
 * @returns The full page.
 */
function Page(): React.ReactElement {
  const dispatch = useCCDispatch();

  React.useEffect(() => {
    // Avoids accidentally adding metadata added from metadata tab
    dispatch(MetadataActions.update_newly_added([]));
    dispatch(GlobalActions.update_current_tab(Tabs.CONTENT));
    dispatch(MetadataActions.fetch_metadatatype());
    dispatch(fetch_copyright());
    dispatch(fetch_organization());
  }, [dispatch]);

  return (
    <Body />
  );
}

export default Page;
