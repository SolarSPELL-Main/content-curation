import React, { useEffect, useState } from 'react';
import {Button, Typography} from '@material-ui/core';
import {useCCDispatch, useCCSelector} from '../../hooks';
import {update_current_tab} from '../../state/global';
import {fetch_copyright} from '../../state/copyright';
import {fetch_organization} from '../../state/organization';
import { Tabs } from '../../enums';
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import Grid from "@material-ui/core/Grid";
import {GenericDialog} from 'solarspell-react-lib';
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"

const copyright_columns: GridColDef[] = [
    { field: 'description', headerName: "Copyright Permission", width: 200},
    { field: 'organization', headerName: "Organization", width: 200, valueGetter: params => params.row.organization_info.name
    },
    { field: 'granted', headerName: "Granted", width: 100,
        renderCell: params => params.row.granted ? <CheckIcon /> : <CloseIcon />},
    { field: 'date_contacted', headerName: "Date Contacted", width: 200},
    { field: 'date_of_response', headerName: "Date of Response", width: 200},
    { field: 'user', headerName: "User", width: 200},
]

const organization_columns: GridColDef[] = [
    { field: 'name', headerName: "Name", width: 200},
    { field: 'website', headerName: "Website", width: 200},
    { field: 'email', headerName: "Email", width: 200},
]

export default () => {
    const [open, setOpen] = useState(false)
    const dispatch = useCCDispatch()
    const copyright = useCCSelector(state => state.copyright.copyright)
    const organizations = useCCSelector(state => state.organization.organizations)
    useEffect(() => {
        dispatch(update_current_tab(Tabs.COPYRIGHT));
        dispatch(fetch_copyright());
        dispatch(fetch_organization());
    }, [dispatch])

    return <>
        <Grid container>
            <Grid item xs={6}>
                <Typography>Copyright Permissions</Typography>
                <Button onClick={_ => setOpen(true)}>Add Copyright</Button>
                <DataGrid
                    rows={copyright}
                    columns={copyright_columns}
                    pageSize={5}
                />
                <GenericDialog
                    open={open}
                    title="Add Copyright Permission"
                    onClose={_ => setOpen(false)}
                    actions={<></>}
                >
                </GenericDialog>
            </Grid>
            <Grid item xs={6}>
                <Typography>Organizations</Typography>
                <Button onClick={_ => setOpen(true)}>Add Organization</Button>
                <DataGrid
                    rows={organizations}
                    columns={organization_columns}
                    pageSize={5}
                />
                <GenericDialog
                    open={open}
                    title="Add Organization"
                    onClose={_ => setOpen(false)}
                    actions={<></>}
                >
                </GenericDialog>
            </Grid>
        </Grid>
    </>
}
