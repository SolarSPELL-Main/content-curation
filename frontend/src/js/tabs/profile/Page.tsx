//Importing from outside the project
import React from "react"
import Button from "@material-ui/core/Button"
import Typography from "@material-ui/core/Typography"

//Importing from other files in the project
import { useCCSelector, useCCDispatch } from '../../hooks';
import { logout, show_toast } from "../../state/global"

//Snackbar Implementation
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';
import { PayloadAction } from '@reduxjs/toolkit'
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }


export default () => {
    const dispatch = useCCDispatch()
    const user = useCCSelector(state => state.global.user)
    
    //Snackbar Implementation
    const [open, setOpen] = React.useState(false);
    var message;
    var severity: 'error'|'warning'|'info'|'success' = 'success';
    var duration=6000
    const handleClick = (message, severity) => {
        setOpen(true);
        message = message;
        severity = severity;
        if (severity=="error")
            duration=9999999999
    };
    const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
      return ;
    };

    return <div style={{ marginTop: "4em", marginLeft: "8em" }}>
        {user.username ? <>
            <Typography>Hello, {user.username}! 👋</Typography>
            <Typography>email: {user.email}</Typography>
            <Typography>Your Groups: {user.groups.join(", ")}</Typography>
            <Button onClick={_ => dispatch(logout())}>
                LOGOUT
            </Button>
            {user.groups.includes("Admin") ?
                <Button href="/admin/">
                    Admin Site
                </Button> : <></>
            }
        </> : <>
            <Button href="/accounts/google/login/">
                Login
            </Button>
        </>}
        
        
        <div>
        <Button onClick={() => handleClick({message: "Message to display",severity: "info"})}>Test Button</Button>
        <Snackbar anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={duration}
        onClose={handleClose}
        >
          <React.Fragment >
            <Alert severity={severity} autoHideDuration={duration}> {message}
              <IconButton size="small" aria-label="close" color="inherit" >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Alert>
          </React.Fragment>
        </Snackbar>
      </div>
    
    
    </div>
}