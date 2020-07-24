import React from 'react';

import { Snackbar } from '@material-ui/core';

export const ErrorToast = (props) => {
    return(
        <Snackbar
            open={props.open}
            onClose={props.handleClose}
            message={props.message}
            autoHideDuration={6000}
            severity="error"
        />
    )
}