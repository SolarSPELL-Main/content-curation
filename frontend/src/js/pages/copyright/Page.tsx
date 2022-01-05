import React, { useEffect, useState, } from 'react';
import {Box, Button, Checkbox, Paper, TextField, Tooltip, Typography} from '@material-ui/core';
import {useCCDispatch, useCCSelector} from '../../hooks';
import {update_current_tab} from '../../state/global';
import {add_copyright, delete_copyright, edit_copyright, fetch_copyright} from '../../state/copyright';
import {add_organization, delete_organization, edit_organization, fetch_organization} from '../../state/organization';
import { Tabs } from '../../enums';
import { DataGrid, GridColDef } from '@material-ui/data-grid'
import Grid from "@material-ui/core/Grid";
import {ActionPanelItem, GenericDialog} from 'solarspell-react-lib';
import CheckIcon from "@material-ui/icons/Check"
import CloseIcon from "@material-ui/icons/Close"
import {useImmer} from 'use-immer';

import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import {ContentPermissions, Organization} from '../../types';
import {Autocomplete} from '@material-ui/lab';
import {isEqual} from 'lodash';


//const TitlePopup = React.forwardRef((props, ref: any) => <div
//{...props} ref={ref}
//>{props.children}</div>)

export default () => {
    const dispatch = useCCDispatch()
    useEffect(() => {
        dispatch(fetch_copyright());
        dispatch(fetch_organization());
    }, [dispatch])

    const [organization_columns] = useState<GridColDef[]>([
        { field: 'actions', headerName: "Actions", renderCell: ({ row }) => <>
            <ActionPanelItem
                type="confirm"
                icon={DeleteIcon}
                onAction={() => {
                    dispatch(delete_organization(row.id))
                }}
                confirmationTitle={`Delete Organization ${row.name}`}
                confirmationSize={"xs"}
            />
            <ActionPanelItem
                type="button"
                icon={EditIcon}
                onAction={() => {
                    update_add_org({
                        id: row.id,
                        name: row.name,
                        website: row.website,
                        email: row.email
                    })
                    update_is_open(is_open => {
                        is_open.add_organization = true
                    })
                }}
            />
        </>, hideSortIcons: true, disableColumnMenu: true},
        { field: 'name', headerName: "Name", width: 200},
        { field: 'website', headerName: "Website", width: 200},
        { field: 'email', headerName: "Email", width: 200},
    ])

    const [copyright_columns] = useState<GridColDef[]>([
        { field: 'actions', headerName: "Actions", renderCell: ({ row }) => <>
            <ActionPanelItem
                type="confirm"
                icon={DeleteIcon}
                onAction={() => {
                    dispatch(delete_copyright(row.id))
                }}
                confirmationTitle={`Delete Copyright ${row.description}`}
                confirmationSize={"xs"}
            />
            <ActionPanelItem
                type="button"
                icon={EditIcon}
                onAction={() => {
                    update_add_copy({
                        id: row.id,
                        description: row.description,
                        granted: row.granted,
                        organization: row.organization,
                        date_contacted: row.date_contacted,
                        date_of_response: row.date_of_response,
                        user: row.user,
                    });
                    console.log(organizations);
                    ((org => {
                        console.log(organizations)
                        if (org !== undefined) {
                            console.log("not undefined")
                            update_add_org(org)
                        }
                    })(organizations.find(o => o.id == row.organization)))
                    update_is_open(is_open => {
                        is_open.add_copyright = true
                    })
                }}
            />
        </>, hideSortIcons: true, disableColumnMenu: true},
        { field: 'description', headerName: "Description", width: 200,
            renderCell: ({ row })=> <Tooltip
                title={row.description}
            >
                <span style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}>{row.description}</span>
            </Tooltip>
        },
        { field: 'organization', headerName: "Organization", width: 200,
            valueGetter: params => params.row.organization_info.name
        },
        { field: 'granted', headerName: "Granted", width: 150,
            renderCell: params => params.row.granted ? <CheckIcon /> : <CloseIcon />},
        { field: 'date_contacted', headerName: "Date Contacted", width: 200},
        { field: 'date_of_response', headerName: "Date of Response", width: 200},
        { field: 'user', headerName: "User", width: 200,
            valueGetter: params => params.row.user_name
        },
    ])

    const copyright = useCCSelector(state => state.copyright.copyright)
    const organizations = useCCSelector(state => state.organization.organizations)
    console.log(organizations)
    const user_id = useCCSelector(state => state.global.user.user_id)
    useEffect(() => {
        dispatch(update_current_tab(Tabs.COPYRIGHT));
    }, [dispatch])

    const [is_open, update_is_open] = useImmer({
        add_organization: false,
        add_copyright: false,
    })
    const [add_org, update_add_org] = useImmer<Organization>({
        id: 0,
        name: "",
        website: "",
        email: "",
    })
    const [add_copy, update_add_copy] = useImmer<ContentPermissions>({
        id: 0,
        description: "",
        date_contacted: "",
        date_of_response: "",
        granted: false,
        organization: 0,
        user: user_id,
    })


    return <>
        <Grid container spacing={4} style={{
            maxWidth: "100%",
            padding: "2em"
        }}>
            <Grid item xs={12}>
                <Box display="flex">
                    <Typography variant="h5">Copyright Permissions</Typography>
                    <Button
                        style={{
                            marginLeft: "auto"
                        }}
                        onClick={_ => update_is_open(s => {
                            s.add_copyright = true
                        })}
                    >Add Copyright</Button>
                </Box>
                <Paper style={{marginTop: "1em"}}>
                    <DataGrid
                        rows={copyright}
                        columns={copyright_columns}
                        pageSize={5}
                        autoHeight
                    />
                </Paper>
                <GenericDialog
                    open={is_open.add_organization}
                    title={`${add_org.id == 0 ? "Add" : "Edit"} Organization`}
                    onClose={_ => update_is_open(s => {
                        s.add_organization = false
                    })}
                    actions={<>
                        <Button
                            color="secondary"
                            onClick={_ => update_is_open(s => {
                                s.add_organization = false
                            })}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={_ => {
                                add_org.id == 0 ?
                                    dispatch(add_organization(add_org)) :
                                    dispatch(edit_organization(add_org))
                                update_add_org({
                                    id: 0,
                                    name: "",
                                    website: "",
                                    email: ""
                                })
                                update_is_open(is_open => {
                                    is_open.add_organization = false
                                })
                            }}
                        >
                            {add_org.id == 0 ? "Add" : "Edit"}
                        </Button>
                    </>}
                >
                    <TextField
                        fullWidth
                        label="Organization"
                        value={add_org.name}
                        onChange={e => update_add_org(add_org => {
                            add_org.name = e.target.value
                        })}
                    />
                    <TextField
                        style={{marginTop: "1em"}}
                        fullWidth
                        label="Email"
                        value={add_org.email}
                        onChange={e => update_add_org(add_org => {
                            add_org.email = e.target.value
                        })}
                    />
                    <TextField
                        style={{marginTop: "1em"}}
                        fullWidth
                        label="Website"
                        value={add_org.website}
                        onChange={e => update_add_org(add_org => {
                            add_org.website = e.target.value
                        })}
                    />
                </GenericDialog>
            </Grid>
            <Grid item xs={12}>
                <Box display="flex">
                    <Typography variant="h5">Organizations</Typography>
                    <Button
                        style={{marginLeft: "auto"}}
                        onClick={_ => update_is_open(s => {
                            s.add_organization = true
                        })}
                    >Add Organization</Button>
                </Box>
                <Paper style={{marginTop: "1em"}}>
                    <DataGrid
                        rows={organizations}
                        columns={organization_columns}
                        pageSize={5}
                        autoHeight
                    />
                </Paper>
                <GenericDialog
                    open={is_open.add_copyright}
                    title={`${add_copy.id == 0 ? "Add" : "Edit"} Copyright Permission`}
                    onClose={_ => update_is_open(s => {
                        s.add_copyright = false
                    })}
                    actions={<>
                        <Button
                            color="secondary"
                            onClick={_ => update_is_open(s => {
                                s.add_copyright = false
                            })}
                        >
                            Close
                        </Button>
                        <Button
                            onClick={_ => {
                                add_copy.id == 0 ?
                                    dispatch(add_copyright(add_copy)) :
                                    dispatch(edit_copyright(add_copy))
                                update_add_copy({
                                    id: 0,
                                    description: "",
                                    date_contacted: "",
                                    date_of_response: "",
                                    granted: false,
                                    organization: 0,
                                    user: 0,
                                })
                                update_is_open(is_open => {
                                    is_open.add_copyright = false
                                })
                            }}
                        >
                            {add_copy.id == 0 ? "Add" : "Edit"}
                        </Button>
                    </>}
                >
                    <TextField
                        multiline
                        fullWidth
                        label="Description"
                        value={add_copy.description}
                        onChange={e => update_add_copy(add_copy => {
                            add_copy.description = e.target.value
                        })}
                    />
                    <TextField
                        style={{marginTop: "1em"}}
                        fullWidth
                        label="Date Contacted"
                        value={add_copy.date_contacted}
                        onChange={e => update_add_copy(add_copy => {
                            add_copy.date_contacted = e.target.value
                        })}
                    />
                    <TextField
                        style={{marginTop: "1em"}}
                        fullWidth
                        label="Date of Response"
                        value={add_copy.date_of_response}
                        onChange={e => update_add_copy(add_copy => {
                            add_copy.date_of_response = e.target.value
                        })}
                    />
                    <Typography
                        style={{marginTop: "1em"}}
                    >
                        Permission Granted
                    </Typography>
                    <Checkbox
                        checked={add_copy.granted}
                        onChange={e => update_add_copy(add_copy => {
                            add_copy.granted = e.target.checked
                        })}
                    />
                    <Autocomplete
                        style={{marginTop: "1em"}}
                        value={add_org}
                        options={organizations}
                        renderInput={params => <TextField
                            {...params} label="Organization"
                        />}
                        getOptionLabel={option => option.name}
                        getOptionSelected={(
                            input: Organization,
                            selected: Organization
                        ) => isEqual(input, selected)}
                        filterOptions={(
                            options: Organization[],
                            { inputValue }
                        ) => options.filter(org => org.name.indexOf(inputValue) >= 0)}
                        onChange={(_, val) => {
                            if (val != null) {
                                update_add_org(val)
                                update_add_copy(add_copy => {
                                    add_copy.organization = val.id
                                })
                            }
                        }}
                    />
                </GenericDialog>
            </Grid>
        </Grid>
    </>
}
