import React, { useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import HomePage from './tabs/home';
import MetadataPage from './tabs/metadata';
import ContentPage from './tabs/content';
import { NavBar } from "./tabs";
import { fetch_user } from "./state/global"
import { useDispatch } from "react-redux"
import Snackbar from '@material-ui/core/Snackbar';
import { useCCDispatch, useCCSelector } from './hooks';
import * as Actions from './state/metadata';

/*
 * Main entry point of the application
 */
export default () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetch_user())
    }, [dispatch])

type PageProps = {

}

function Page(_: PageProps): React.ReactElement {
    const dispatch = useCCDispatch();
    const open = useCCSelector(state => state.global.toast_open);
    const message = useCCSelector(state => state.global.toast_message)
    
    useEffect(() => {
        dispatch(Actions.fetch_metadatatype());
    }, []);

    return <>
        <NavBar />
        <Switch>
            <Route path={'/content'}>
                <ContentPage />
            </Route>
            <Route path={'/metadata'}>
                <MetadataPage />
            </Route>
            <Route path={['/home', '/']}>
                <HomePage />
            </Route>
        </Switch>
        <Snackbar open={open} message=""/>"
    </>
}
}
