import React, { useState } from 'react';

import {Button, ButtonGroup} from "@material-ui/core"
import { GitHub } from '@material-ui/icons';

import {
    LobbyContent,
    LobbyIcon,
    LobbyCenterText,
    LobbyTitle,
    LobbyTop,
    LobbyButton
} from './LobbyStyle.js'

import {
    ModalFormDirectory,
    ModalFormDirectoryAndUrl
} from '../modals'

export const LobbyPage = () => {
    const [openOpen, setOpenOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    const [dir, setDir] = useState("")
    const [url, setUrl] = useState("")


    const handleClickOpenOpen = () => {
        setOpenOpen(true);
    };
    const handleCloseOpen = () => {
        setOpenOpen(false);
    }; 
    const handleConfirmOpen = () => {
        setOpenOpen(false);
    }; 

    //Create Events
    const handleClickOpenCreate = () => {
        setOpenCreate(true);
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
    }; 
    const handleConfirmCreate = () => {
        setOpenOpen(false);
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
    const changeUrl = (input) => {
        setUrl(input)
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
            <ModalFormDirectory 
                title="Open Repository" 
                confirmText = "Open"
                open={openOpen} 
                directory={dir}
                
                handleClose={handleCloseOpen}
                handleConfirm={handleConfirmOpen}
                handleDirectoryChange={changeDir}
            />
            <ModalFormDirectory     
                title="Create Repository" 
                confirmText="Create"
                open={openCreate} 
                directory={dir}

                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
                handleDirectoryChange={changeDir}
            />
            <ModalFormDirectoryAndUrl 
                title="Clone Repository"
                confirmText="Clone" 
                open={openClone}
                directory={dir}
                url={url}

                handleClose={handleCloseClone}
                handleConfirm={handleConfirmClone}
                handleDirectoryChange={changeDir}
                handleUrlChange={changeUrl}
            />
        </div>
    )
}

export default LobbyPage; 