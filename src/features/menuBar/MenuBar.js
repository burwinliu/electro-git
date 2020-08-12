import React, { useState, useEffect } from 'react';

import {ipcRenderer, shell} from 'electron';

import {
    MenuBarWrapper,
    WindowControlsWrapper
} from "./MenuBarStyles"

import {
    Button,
    Menu, MenuItem, Popover,
    List, ListItem,
    IconButton, 
    SvgIcon
} from '@material-ui/core'
import {
    Remove as RemoveIcon, 
    CropLandscape as MaxIcon, 
    Close as CloseIcon,
    GitHub as GithubIcon,
} from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { appstoreSetDiffControl, DIFF_CONTROL } from '../../store/ducks';
import { ModalRepoOpen, ModalRepoClone, ModalRepoCreate } from '../modals';

const RestoreIcon = (props) => {
    return (
        <SvgIcon {...props} style={{fontSize: "1rem"}} viewBox='0 0 10 10'>
            <svg>
                <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"/>
            </svg>
        </SvgIcon>
    )
}

export const MenuBar = (props) => {
    const [isMaximized, setIsMaximized] = useState(false)
    const [anchorElFile, setAnchorElFile] = React.useState(null);
    const [anchorElView, setAnchorElView] = React.useState(null);
    // const [anchorElBranch, setAnchorElBranch] = React.useState(null);

    const [openOpen, setOpenOpen] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [openClone, setOpenClone] = useState(false);

    const diffControl = useSelector(state => state.appstore.diffControl)

    const dispatch = useDispatch();


    useEffect(()=>{

        const handleMax = (e, isMax) => {
            setIsMaximized(isMax)
        }
        ipcRenderer.on('isMaximize', handleMax)

        return() => {
            ipcRenderer.removeListener("isMaximize", handleMax)
        }
        
    })
    // LOGO LOGIC
    const handleGithubClick = () => {
        shell.openExternal("https://github.com/burwinliu/electro-git")
    }

    //FILE MENU LOGIC
    const handleClickFile = (event) => {
        setAnchorElFile(event.currentTarget);
    };

    const handleCloseFile = () => {
        setAnchorElFile(null);
    };



    // REPO MENU LOGIC
    const handleClickView = (event) => {
        setAnchorElView(event.currentTarget);
    };

    const handleCloseView = () => {
        setAnchorElView(null);
    };

    const handleToggleDiffView = () => {
        if (diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
            dispatch(appstoreSetDiffControl(DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW))
        }
        else if (diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
            dispatch(appstoreSetDiffControl(DIFF_CONTROL.MAIN_COMPRESSED_VIEW))
        }
    }

    const handleMin = () => {
        ipcRenderer.send('minWindow');
    }

    const handleToggleMaximize = () => {
        ipcRenderer.send('toggleMaxWindow');
    }

    const handleClose = () => {
        ipcRenderer.send('closeWindow');
    }

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
        <div style = {MenuBarWrapper}>
            <div name="main-controls" style={{...WindowControlsWrapper}}>
                <IconButton onClick={handleGithubClick}>
                    <GithubIcon fontSize="small" />
                </IconButton>
                <Button aria-controls="view-repo-control" aria-haspopup="true" onClick={handleClickFile}>
                    File
                </Button>
                <Button aria-controls="view-menu-control" aria-haspopup="true" onClick={handleClickView}>
                View
            </Button>

           
            
            </div>
            <div name="window-controls" style={{...WindowControlsWrapper}}>
                <IconButton aria-label="minimize" onClick={handleMin}>
                    <RemoveIcon fontSize="small" />
                </IconButton>
                <IconButton aria-label="toggleMax" onClick={handleToggleMaximize}>
                    {isMaximized? <RestoreIcon fontSize="small"/> : <MaxIcon fontSize="small"/> }
                </IconButton>
                <IconButton aria-label="close" onClick={handleClose}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </div>
            {/* File Menu */}
            <Popover
                open={Boolean(anchorElFile)}
                anchorEl={anchorElFile}
                onClose={handleCloseFile}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List>
                    <ListItem button onClick={handleClickOpenOpen}>
                        Open Repo
                    </ListItem>
                    <ListItem button onClick={handleClickOpenCreate}>
                        Create New Repo
                    </ListItem>
                    <ListItem button onClick={handleClickOpenClone}>
                        Clone New Repo
                    </ListItem>
                </List>
            </Popover>
            {/* View Menu */}
            <Popover
                open={Boolean(anchorElView)}
                anchorEl={anchorElView}
                onClose={handleCloseView}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
            >
                <List>
                    <ListItem button onClick={handleToggleDiffView}>
                        Toggle Difference Display Style
                    </ListItem>
                </List>
            </Popover>
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