//Importing from outside the project
import React from 'react';

//Importing from other files in the project
import Icons from './Icons';
import { useCCDispatch } from '../../hooks';
import { update_current_tab } from '../../state/global';

type PageProps = {
    icons: Record<string,any>
}

/**
 * The home tab of the application.
 * @param _ Unused for now.
 * @returns The home tab body.
 */
function Page({
    icons,
}: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();

    React.useEffect(
        () => {
            dispatch(update_current_tab('home'));
        },
        [dispatch],
    );

    return (
        <Icons icons={icons} />
    );
}

export default Page;
