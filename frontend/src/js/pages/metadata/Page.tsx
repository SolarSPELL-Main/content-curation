import React, { useEffect } from 'react';

import Body from './Body';
import * as Actions from '../../state/metadata';
import { useCCDispatch } from '../../hooks';
import { update_current_tab } from '../../state/global';
import { Tabs } from '../../enums';

/**
 * The full page for the metadata tab.
 * @returns The full page.
 */
function Page(): React.ReactElement {
  const dispatch = useCCDispatch();
    
  useEffect(() => {
    dispatch(update_current_tab(Tabs.METADATA));
    dispatch(Actions.fetch_metadatatype());
  }, [dispatch]);

  return (
    <Body />
  );
}

export default Page;
