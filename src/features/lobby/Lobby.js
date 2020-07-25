import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

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
} from '../toasts'

// GIT HELPER
import {
    helperGitOpen,
    helperGitInit,
    helperGitClone,
    helperGitStatus,
    helperGitDiff,
    renderGitDiffInfo
} from '../../services'

//REDUX
import {
    repoSetPath,
    repoSetUrl,
    stageSetDiffObj,
    stageSetStatusObj,
    stageReset,
    appstoreReset
} from '../../store/ducks'

export const LobbyPage = () => {
    const [openOpen, setOpenOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    const [dir, setDir] = useState("")
    const [url, setUrl] = useState("")

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const [loaded, setLoaded] = useState(true)

    //REDUX HOOKS
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();

    useEffect(()=>{
        if(dirPath !== "" && dirPath !== undefined){
            history.push('/main')
        }
        return ()=>{
            setLoaded(false)
        }
    }, [])

    const handleClickOpenOpen = () => {
        if(loaded){
            setOpenOpen(true);
        }
        
    };
    const handleCloseOpen = () => {
        if(loaded){
            setOpenOpen(false);
        }
    }; 
    const handleConfirmOpen = async () => {
        if (dir){
            try{
                const gitObj = helperGitOpen(dir)
                if(await gitObj.checkIsRepo()){
                    console.log(gitObj, dir)
                    const rootDir = await gitObj.revparse({'--show-toplevel': null })
                    if(loaded){
                        console.log(rootDir)
                        dispatch(repoSetPath(rootDir))
                        await handleRefresh()
                        history.push('/main')
                    }
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
    }; 

    //Create Events
    const handleClickOpenCreate = () => {
        if(loaded){
            setOpenCreate(true);
        }
       
    };
    const handleCloseCreate = () => {
        if(loaded){
            setOpenCreate(false);
        }
        
    }; 
    const handleConfirmCreate = async () => {
        if (dir){
            try{
                helperGitOpen(dir)
                await helperGitInit(dir);
                dispatch(repoSetPath(dir))
                await handleRefresh()
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
    }; 
    
    // Clone Events
    const handleClickOpenClone = () => {
        if(loaded){
            setOpenClone(true);
        }
        
    };
    const handleCloseClone = () => {
        if(loaded){
            setOpenClone(false);
        }
    }; 
    const handleConfirmClone = async () => {
        if (dir && url){
            try{
                
                const repo = helperGitOpen(dir)
                helperGitClone(repo, url, dir);
                dispatch(repoSetPath(dir))
                dispatch(repoSetUrl(dir))
                await handleRefresh()
                
                history.push('/main')
                return
            }
            catch(err){
                console.log(err);
            }
        }
    }; 

    const handleErrClose = () => {
        if(loaded){
            setErrOpen(false)
        }
    }

    const changeDir = (input) => {
        if(loaded){
            setDir(input)
        }
    }
    const changeDirEvent = (evt) => {
        if(loaded){
            setDir(evt.target.value)
        }
    }
    const changeUrl = (input) => {
        if(loaded){
            setUrl(input)
        }
    }

    

    const handleRefresh = () => {
        const gitObject = helperGitOpen(dirPath)
        dispatch(stageReset());

        helperGitStatus(gitObject).then((statusObj) =>{
            let storeStatus = {}
            for (let index in statusObj){
                storeStatus[statusObj[index].path] = statusObj[index]
            }
            dispatch(stageSetStatusObj(storeStatus))
        })
        
        helperGitDiff(gitObject).then((statusDiff)=>{
            const rendDiff = renderGitDiffInfo(statusDiff)
            let storeDiff = {}
            for (let index in rendDiff){
                storeDiff[index] = rendDiff[index]
            }
            dispatch(stageSetDiffObj(storeDiff))
        })
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
                directory={dir||""}
                
                handleClose={handleCloseOpen}
                handleConfirm={handleConfirmOpen}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />
            <ModalFormDirectory     
                title="Create Repository" 
                confirmText="Create"
                open={openCreate} 
                directory={dir||""}

                handleClose={handleCloseCreate}
                handleConfirm={handleConfirmCreate}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />
            <ModalFormDirectoryAndUrl 
                title="Clone Repository"
                confirmText="Clone" 
                open={openClone}
                directory={dir||""}
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