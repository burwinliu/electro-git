import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle  } from '@material-ui/core';
import { Button } from '@material-ui/core'

import {CustomDirectoryField} from '../CustomFields'
import { ModalPosition, ModalInputWrapper, ModalInputElement } from './ModalStyles'

export const ModalFormDirectory = (props) => {
    /*
        Expects props with title, opn, handleCancel, handleConfirm, confirmText, directory, handleDirectoryChange
    */
    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <CustomDirectoryField 
                    directory={props.directory} 
                    handleDirectoryChange={props.handleDirectoryChange}
                    handleDirectory={props.handleDirectory}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.handleConfirm} color="primary">
                    {props.confirmText}
                </Button>
            </DialogActions>
      </Dialog>
    )
}

export const ModalFormDirectoryAndUrl = (props) => {
    /*
        Expects props with title, open, handleClose, handleConfirm, confirmText, directory, handleDirectoryChange, url, handleUrlChange
    */
    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle id="form-dialog-title">{props.title}</DialogTitle>
            <DialogContent style={ModalInputWrapper}>
                <CustomDirectoryField 
                    directory={props.directory} 
                    handleDirectoryChange={props.handleDirectoryChange}
                    handleDirectory={props.handleDirectory}
                />
                <input style={ModalInputElement} value={props.url} onChange={props.handleUrlChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.handleConfirm} color="primary">
                    {props.confirmText}
                </Button>
            </DialogActions>
      </Dialog>
    )
}
