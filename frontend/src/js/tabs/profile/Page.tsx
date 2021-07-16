import React from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import ProfileImpact from "../../../assets/profileimpact.jpg"
import Chip from "@material-ui/core/Chip"

import { useCCSelector, useCCDispatch } from '../../hooks';
import { logout } from "../../state/global"
import { AuthGroup } from '../../enums';

export default () => {
    const dispatch = useCCDispatch()
    const user = useCCSelector(state => state.global.user)
    

    return <Grid container spacing={2}>
        <Grid item xs={6} style={{padding: "2em"}}>
            <img src={ProfileImpact} style={{maxWidth: "100%"}} />
        </Grid>
        <Grid item xs={6} style={{padding: "2em"}}>
            {user.username ? <>
                <Typography variant="h2">Hello, {user.username}! 👋</Typography>
                <Typography variant="subtitle2">Email</Typography>
                <Typography>{user.email}</Typography>
                <Typography variant="subtitle2">Permission Groups</Typography>
                {user.groups.map((group, idx) => <Chip
                    style={{marginRight: "1em"}}
                    key={idx}
                    label={group}
                />)}
                <div style={{marginTop: "2em"}}/>
                <Button onClick={_ => dispatch(logout())}>
                    LOGOUT
                </Button>
                {user.groups.includes(AuthGroup.ADMIN) ?
                    <Button href="/admin/">
                        Admin Site
                    </Button> : <></>
                }
            </> : <>
                <Typography variant="h2">
                    You are logged out
                </Typography>
                <Button style={{marginTop: "2em"}} href="/accounts/google/login/">
                    Login
                </Button>
            </>}
        </Grid>
    </Grid>
}
