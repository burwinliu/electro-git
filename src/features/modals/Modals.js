import React, {useState, useEffect} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, TextField, Input, Snackbar } from '@material-ui/core';
import { Button } from '@material-ui/core'

import {CustomDirectoryField, CustomFileField} from '../CustomFields'
import { ModalInputWrapper, ModalInputElement } from './ModalStyles'
import { useSelector, useDispatch } from 'react-redux';
import { helperGitRemoteName, helperGitTag, helperGitOpen, helperGitBranchCreate, helperGitSetRemoteUrl, helperGitClone, helperGitInit } from '../../services';

import {repoSetUrl, repoSetPath} from '../../store/ducks'
import { GitConstructError, GitError } from 'simple-git';
import { useHistory } from 'react-router-dom';

export const ModalRepoOpen = (props) => {
    const [dir, setDir] = useState("")

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();

    const handleConfirm = async () => {
        if (dir){
            try{
                const gitObj = helperGitOpen(dir)
                if(await gitObj.checkIsRepo()){
                    const rootDir = await gitObj.revparse({'--show-toplevel': null })
                    dispatch(repoSetPath(rootDir))
                    props.handleClose()

                    history.push('/main')
                }
                else{
                    setErrMsg("Open Failed -- Directory provided is not a repo. Did you mean to init?")
                    setErrOpen(true)
                }
                
                return
            }
            catch(err){
                console.log(err)

                setErrMsg("Open Failed -- Directory provided was unable to be opened")
                setErrOpen(true)
                return
            }
        }
        setErrMsg("Open Failed -- No directory provided")
        setErrOpen(true)
    }

    const changeDir = (input) => {
        setDir(input)
    }
    const changeDirEvent = (evt) => {
        setDir(evt.target.value)
    }
    const handleErrClose = () => {
        setErrOpen(false)
    }

    return(
        <div>
            <ModalFormDirectory 
                title="Open Repository" 
                confirmText = "Open"
                open={props.open} 
                directory={dir||""}
                
                handleClose={props.handleClose}
                handleConfirm={handleConfirm}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />

            <Snackbar
                open={errOpen}
                onClose={handleErrClose}
                message={errMsg}
                autoHideDuration={6000}
                severity="error"
            />
        </div>
    )
}

export const ModalRepoClone = (props) => {
    const [dir, setDir] = useState("")
    const [url, setUrl] = useState("")

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();

    const handleConfirm = async () => {
        if (dir && url){
            try{
                helperGitClone(dir, url).then(async (temp) => {
                    dispatch(repoSetPath(dir))
                    dispatch(repoSetUrl(dir))
                    props.handleClose()
                    history.push('/main')
                    return
                });
                
            }
            catch(err){
                setErrMsg("Clone Failed " + err.message)
                setErrOpen(true)
                return
            }
        }
        setErrMsg("Open Failed -- No directory provided")
        setErrOpen(true)
    }

    const changeDir = (input) => {
        setDir(input)
    }
    const changeDirEvent = (evt) => {
        setDir(evt.target.value)
    }
    const changeUrl = (evt) => {
        setUrl(evt.target.value)
    }

    const handleErrClose = () => {
        setErrOpen(false)
    }

    return(
        <div>
            <ModalFormDirectoryAndUrl 
                title="Clone Repository"
                confirmText="Clone" 
                open={props.open}
                directory={dir||""}
                url={url}

                handleClose={props.handleClose}
                handleConfirm={handleConfirm}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
                handleUrlChange={changeUrl}
            />

            <Snackbar
                open={errOpen}
                onClose={handleErrClose}
                message={errMsg}
                autoHideDuration={6000}
                severity="error"
            />
        </div>
    )
}

export const ModalRepoCreate = (props) => {
    const [dir, setDir] = useState("")

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();

    const handleConfirm = async () => {
        if (dir){
            try{
                helperGitOpen(dir)
                await helperGitInit(dir);
                dispatch(repoSetPath(dir))
                props.handleClose()

                history.push('/main')
                return
            }
            catch(err){
                console.log(err)

                setErrMsg("Open Failed -- Directory provided was unable to be Created")
                setErrOpen(true)
                return
            }
        }
        setErrMsg("Open Failed -- No directory provided")
        setErrOpen(true)
    }

    const changeDir = (input) => {
        setDir(input)
    }
    const changeDirEvent = (evt) => {
        setDir(evt.target.value)
    }

    const handleErrClose = () => {
        setErrOpen(false)
    }
    return(
        <div>
            <ModalFormDirectory     
                title="Create Repository" 
                confirmText="Create"
                open={props.open} 
                directory={dir||""}

                handleClose={props.handleClose}
                handleConfirm={handleConfirm}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />

            <Snackbar
                open={errOpen}
                onClose={handleErrClose}
                message={errMsg}
                autoHideDuration={6000}
                severity="error"
            />
        </div>
    )
}

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
                console.log(remoteURL, "URL")
                dispatch(repoSetUrl(remoteURL))
            }).catch((err) => {
                if (err instanceof GitError){
                    setRepoField("")
                }
            })
        }
        catch(err){
            if (err instanceof GitConstructError){
                return
            }
            
        }
    }, [repoPath])

    const handleRepoChange = (evt) => {
        setRepoField(evt.target.value)
    }

    const handleConfirm = () => {
        dispatch(repoSetUrl(repoField))
        helperGitSetRemoteUrl(repoPath, repoField)
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

export const ModalFormFile = (props) => {
    /*
        Expects props with title, opn, handleCancel, handleConfirm, confirmText, directory, handleDirectoryChange
    */
    return (
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'lg'}>
            <DialogTitle id="form-dialog-title">Select File</DialogTitle>
            <DialogContent>
                <CustomFileField 
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
                    Select
                </Button>
            </DialogActions>
      </Dialog>
    )
}

export const ModalBranchCreate = (props) => {
    const repoPath = useSelector(state => state.repo.path)

    const [branchName, setBranchName] = useState("")

    const handleBranchChange = (evt) => {
        setBranchName(evt.target.value)
    }

    const handleConfirm = async () => {
        return helperGitBranchCreate(repoPath, branchName).then((response) => {
            console.log(response, "RESPONSE")
            props.refresh()
            props.handleClose()
        })
        
    }

    return(
        <Dialog open={props.open} onClose={props.handleClose} fullWidth={true} maxWidth={'sm'}>
                <DialogTitle id="form-dialog-title">New Branch</DialogTitle>
                <DialogContent style={ModalInputWrapper}>
                    <DialogContentText id="alert-dialog-description">
                        Create a new Branch
                    </DialogContentText>
                    <TextField style={ModalInputElement} value={branchName} label="Branch Name" onChange={handleBranchChange}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} color="primary">
                        Create Branch and Checkout
                    </Button>
                </DialogActions>
        </Dialog>
    )
}