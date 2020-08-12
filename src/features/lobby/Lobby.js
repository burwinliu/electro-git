import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import {Button, ButtonGroup, Snackbar} from "@material-ui/core"
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
    ModalFormDirectoryAndUrl,
    ModalRepoClone,
    ModalRepoOpen,
    ModalRepoCreate
} from '../modals'

// GIT HELPER
import {
    helperGitOpen,
    helperGitInit,
    helperGitClone,
    helperGitDiff,
    renderGitDiffInfo
} from '../../services'

//REDUX
import {
    repoSetPath,
    repoSetUrl,
    stageReset
} from '../../store/ducks'

export const LobbyPage = () => {
    const [openOpen, setOpenOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    //REDUX HOOKS
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();
    
    useEffect(()=>{
        if(dirPath !== "" && dirPath !== undefined){
            history.push('/main')
        }
        dispatch(stageReset())
    }, [])

    const handleClickOpenOpen = () => {
        setOpenOpen(true);
        
    };
    const handleCloseOpen = () => {
        setOpenOpen(false);
    }; 
    
    //Create Events
    const handleClickOpenCreate = () => {
        setOpenCreate(true);
       
    };
    const handleCloseCreate = () => {
        setOpenCreate(false);
        
    }; 
    
    // Clone Events
    const handleClickOpenClone = () => {
        setOpenClone(true);
        
    };
    const handleCloseClone = () => {
        setOpenClone(false);
    }; 

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
            <ModalRepoOpen 
                open={openOpen} 
                handleClose={handleCloseOpen}
            />
            <ModalRepoCreate 
                open={openCreate} 
                handleClose={handleCloseCreate}
            />
            <ModalRepoClone 
                open={openClone}
                handleClose={handleCloseClone}
            />
        </div>
    )
}