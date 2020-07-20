import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import {Button, ButtonGroup} from "@material-ui/core"
import { GitHub } from '@material-ui/icons';

// STYLES
import {
    LobbyContent,
    LobbyIcon,
    LobbyCenterText,
    LobbyTitle,
    LobbyTop,
    LobbyButton
} from './LobbyStyle.js'

// COMPONENTS
// Modals (Forms/Dialogs)
import {
    ModalFormDirectory,
    ModalFormDirectoryAndUrl
} from '../modals'
// Toasts (Popup messages)
import{
    ErrorToast
} from '../toasts/Toasts'

// GIT HELPER
import {
    helperGitOpen,
    helperGitInit
} from '../../services/servicesGit'

//REDUX
import {
    repoSetPath
} from '../../store/ducks/repo'

//ROUTER
import {
    useHistory,
    useLocation
} from "react-router-dom"

export const LobbyPage = (props) => {
    const [openOpen, setOpenOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    const [dir, setDir] = useState("")
    const [url, setUrl] = useState("")

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const hist = useHistory()
    const loc = useLocation()

    const handleClickOpenOpen = () => {
        setOpenOpen(true);
    };
    const handleCloseOpen = () => {
        setOpenOpen(false);
    }; 
    const handleConfirmOpen = async () => {
        if (dir){
            try{
                await helperGitOpen(dir)
                store.dispatch(repoSetPath(dir))
                setOpenOpen(false);
                hist.push('/main')
                console.log(hist, loc.pathName)
                return
            }
            catch(err){
                console.log(err)

                setErrMsg("Open Failed --Directory provided was unable to be opened")
                setErrOpen(true)
                return
            }
        }
        setErrMsg("Open Failed -- No directory provided")
        setErrOpen(true)
    }; 

    //Create Events
    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
    }; 
    const handleConfirmCreate = async () => {
        if (dir){
            try{
                await helperGitOpen(dir)
                await helperGitInit(form.path);
                store.dispatch(repoSetPath(dir))
                setOpenCreate(false);
                hist.push('/main')
                return
            }
            catch(err){
                console.log(err)

                setErrMsg("Open Failed --Directory provided was unable to be opened")
                setErrOpen(true)
                return
            }
        }
        setErrMsg("Open Failed -- No directory provided")
        setErrOpen(true)
    }; 
    
    // Clone Events
    const handleClickOpenClone = () => {
        setOpenClone(true);
    };
    const handleCloseClone = () => {
        setOpenClone(false);
    }; 
    const handleConfirmClone = () => {
        setOpenOpen(false);
    }; 

    const changeDir = (input) => {
        setDir(input)
    }
    const changeDirEvent = (evt) => {
        setDir(evt.target.value)
    }
    const changeUrl = (input) => {
        setUrl(input)
    }

    const handleErrClose = () => {
        setErrOpen(false)
    }

    return (
        <div style={LobbyContent}>
            <div style={LobbyCenterText}>
                <GitHub style={LobbyIcon}/>
                <h1 style={{...LobbyTitle, ...LobbyTop}} id="intro-subtext">Welcome - Let us begin!</h1>
                <h2 style={{...LobbyTitle}}>Select one of the following</h2>
            </div>
            <ButtonGroup orientation="vertical">
                <Button style={LobbyButton} variant="outlined" onClick={handleClickOpenOpen}>
                    Open a directory (repository)
                </Button>
                <Button style={LobbyButton} variant="outlined" onClick={handleClickOpenCreate}>
                    Create a repository
                </Button>
                <Button style={LobbyButton} variant="outlined" onClick={handleClickOpenClone}>
                    Clone (Copy) a repository
                </Button>
            </ButtonGroup>

            {/* Modal Forms */}
            <ModalFormDirectory 
                title="Open Repository" 
                confirmText = "Open"
                open={openOpen} 
                directory={dir}
                
                handleClose={handleCloseOpen}
                handleConfirm={handleConfirmOpen}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />
            <ModalFormDirectory     
                title="Create Repository" 
                confirmText="Create"
                open={openCreate} 
                directory={dir}

                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />
            <ModalFormDirectoryAndUrl 
                title="Clone Repository"
                confirmText="Clone" 
                open={openClone}
                directory={dir}
                url={url}

                handleClose={handleCloseClone}
                handleConfirm={handleConfirmClone}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
                handleUrlChange={changeUrl}
            />

            <ErrorToast
                open={errOpen}
                handleClose={handleErrClose}
                message={errMsg}
            />
        </div>
    )
}

export default LobbyPage; 