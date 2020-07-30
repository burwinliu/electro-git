import React, {useState, useEffect} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField } from '@material-ui/core';
import { Button } from '@material-ui/core'

import {CustomDirectoryField} from '../CustomFields'
import { ModalInputWrapper, ModalInputElement } from './ModalStyles'
import { useSelector, useDispatch } from 'react-redux';
import { helperGitRemoteName, helperGitTag, helperGitOpen } from '../../services';

import {repoSetUrl} from '../../store/ducks'
import { GitConstructError } from 'simple-git';
import { useHistory } from 'react-router-dom';

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
    const repoPath = useSelector(state => state.repo.path)

    const [tag, setTag] = useState("")
    const [msg, setMsg] = useState("")

    const handleTag = (evt) => {
        setTag(evt.target.value)
    }
    
    const handleMsg = (evt) => {
        setMsg(evt.target.value)
    }

    const handleConfirm = () => {
        helperGitTag(repoPath, tag, msg).then((obj) => {
            console.log(obj)
        })
        props.handleClose()
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'sm'}>
            <DialogTitle id="form-dialog-title">Add Tag</DialogTitle>
            <DialogContent style={ModalInputWrapper}>
                <DialogContentText id="alert-dialog-description">
                    Here, you may tag your current commit with a tag title (which acts as the version of your current commit) 
                    and a message (to describe your tag). NOTE: Tags "tag" the LAST commit that is already committed -- not the current changes
                </DialogContentText>
                <TextField style={ModalInputElement} value={tag} label="Tag Annotation" onChange={handleTag}/>
                <TextField style={ModalInputElement} value={msg} label="Tag Message" onChange={handleMsg}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleConfirm} color="primary">
                    Tag this Commit
                </Button>
            </DialogActions>
      </Dialog>
    )
}

export const ModalRepoSetting = (props) => {
    const repoURL = useSelector(state => state.repo.url)
    const repoPath = useSelector(state => state.repo.path)

    const [repoField, setRepoField] = useState(repoURL)
    const dispatch = useDispatch();
    const history = useHistory()

    useEffect(()=>{
        try{
            helperGitOpen(repoPath)
            helperGitRemoteName(repoPath).then((remoteURL)=> {
                dispatch(repoSetUrl(remoteURL))
            })
        }
        catch(err){
            console.log(err)
            if (err instanceof GitConstructError){
                console.log("CAUGHT")
                return
            }
        }
    }, [repoPath])

    const handleRepoChange = (evt) => {
        setRepoField(evt.target.value)
    }

    const handleConfirm = () => {
        dispatch(repoSetUrl(repoField))

        props.handleClose()
    }

    return(
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'sm'}>
                <DialogTitle id="form-dialog-title">Repository Settings</DialogTitle>
                <DialogContent style={ModalInputWrapper}>
                    <DialogContentText id="alert-dialog-description">
                        Here, you may set up your repository settings -- this includes things like repo's origin URL -- where it pushes to by default
                    </DialogContentText>
                    <TextField style={ModalInputElement} value={repoField} label="Remote URL" onChange={handleRepoChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Change Repo Remote
                    </Button>
                </DialogActions>
        </Dialog>
    )
}
