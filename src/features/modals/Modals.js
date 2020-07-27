import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField } from '@material-ui/core';
import { Button } from '@material-ui/core'

import {CustomDirectoryField} from '../CustomFields'
import { ModalInputWrapper, ModalInputElement } from './ModalStyles'

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
                <TextField style={ModalInputElement} value={props.url} onChange={props.handleUrlChange}/>
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

export const ModalFormTag = (props) => {
    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle id="form-dialog-title">Add Tag</DialogTitle>
            <DialogContent style={ModalInputWrapper}>
                <DialogContentText id="alert-dialog-description">
                    Here, you may tag your current commit with a tag title (which acts as the version of your current commit) and a message (to describe your tag)
                </DialogContentText>
                <TextField style={ModalInputElement} value={props.tag} label="Tag Annotation" onChange={props.handleTagChange}/>
                <TextField style={ModalInputElement} value={props.message} label="Tag Message" onChange={props.handleMessageChange}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={props.handleConfirm} color="primary">
                    Tag this Commit
                </Button>
            </DialogActions>
      </Dialog>
    )
}

export const ModalRepoSetting = (props) => {
    
}
