import React from "react";
import { Switch, Route } from 'react-router-dom';
import ContentPage from './tabs/content';
import MetadataPage from './tabs/metadata';
import { NavBar } from "./tabs";

/*
 * Main entry point of the application
 */
export default () => {
    return <>
        <NavBar />
        <Switch>
            <Route path={'/content'}>
                <ContentPage />
            </Route>
            <Route path={'/metadata'}>
                <MetadataPage />
            </Route>
        </Switch>
    </>
}
