import React from 'react'
import { Snackbar,Slide,Alert } from '@mui/material'
import PropTypes from "prop-types";

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
};

const GeneralSnackbarAlerts = ({open,type,msg,setOpen}) => {    
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false)
};
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    slots={{transition:SlideTransition}}
                    sx={{ width: '30%'}}>
        <Alert severity={type} sx={{ width: '100%'}} onClose={handleClose}>
            {msg}
        </Alert>
    </Snackbar>
  )
}

GeneralSnackbarAlerts.propTypes={
  open:PropTypes.bool.isRequired,
  type:PropTypes.string.isRequired,
  msg:PropTypes.string.isRequired,
  setOpen:PropTypes.func.isRequired,
}

export default GeneralSnackbarAlerts