import React from "react"
import { useCCSelector, useCCDispatch } from './hooks'
import { fetch_btc, add_metadata } from "./state/metadata"
import Button from "@material-ui/core/Button"
import MetadataDisplay from "solarspell-react-lib/src/components/MetadataDisplay"


/*
 * Component to test adding metadata to the global store
 */
export default () => {
    const metadata_types = useCCSelector(state => state.metadata.metadata_types)
    const btc = useCCSelector(state => state.metadata.btc)
    const metadata_by_type = useCCSelector(state => state.metadata.metadata_types)
    const dispatch = useCCDispatch()
    const [myState, setState] = React.useState(0)

    return <>
        <h1>{myState}</h1>
        <Button onClick={() => setState(1)} />
        <h1>{metadata_types.join(", ")}</h1>
        <Button onClick={() => dispatch(add_metadata("New Metadata"))}>Add</Button>
        <h1>BTC Price {btc?.bpi?.USD?.rate}</h1>
        <Button onClick={() => dispatch(fetch_btc())}>Check BTC</Button>
        <MetadataDisplay
            metadata={metadata_by_type}
            metadataTypes={Object.keys(metadata_by_type)
                .map((name, id) => ({ name, id })
            )} />
    </>
}
