import React, { useEffect } from "react";
import { Switch, Route } from 'react-router-dom';
import HomePage from './tabs/home';
import MetadataPage from './tabs/metadata';
import ContentPage from './tabs/content';
import { NavBar } from "./tabs";
import { fetch_user } from "./state/global"
import { useDispatch } from "react-redux"

/*
 * Main entry point of the application
 */
export default () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetch_user())
    }, [dispatch])

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
    </>
}
