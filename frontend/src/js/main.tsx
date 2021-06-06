import React from "react"
import { useCCSelector, useCCDispatch } from './hooks'
import { fetch_metadata, add_metadata } from "./state/metadata"
import Button from "@material-ui/core/Button"

/*
 * Component to test adding metadata to the global store
 */
export default () => {
    const metadata_types = useCCSelector(state => state.metadata.metadata_types)
    const btc = useCCSelector(state => state.metadata.btc)
    const dispatch = useCCDispatch()

    return <>
        <h1>{metadata_types.join(", ")}</h1>
        <Button onClick={() => dispatch(add_metadata("New Metadata"))}>Add</Button>
        <h1>BTC Price {btc?.bpi?.USD?.rate}</h1>
        <Button onClick={() => dispatch(fetch_metadata())}>Check BTC</Button>
    </>
}
