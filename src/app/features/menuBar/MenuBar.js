import React, { useState, useEffect } from 'react';

import {ipcRenderer, BrowserWindow} from 'electron';

import {
    MenuBarWrapper,
    WindowControlsWrapper
} from "./MenuBarStyles"

import {IconButton, SvgIcon} from '@material-ui/core'
import {Remove, CropLandscape, Close} from '@material-ui/icons';

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

    useEffect(()=>{

        const handleMax = (e, isMax) => {
            console.log(isMax, "MAX")
            setIsMaximized(isMax)
        }
        ipcRenderer.on('isMaximize', handleMax)

        return() => {
            ipcRenderer.removeListener("isMaximize", handleMax)
        }
        
    })

    const handleMin = () => {
        ipcRenderer.send('minWindow');
    }

    const handleToggleMaximize = () => {
        ipcRenderer.send('toggleMaxWindow');
    }

    const handleClose = () => {
        ipcRenderer.send('closeWindow');
    }

    return (
        <div style = {MenuBarWrapper}>
            <div name="main-controls" style={{...WindowControlsWrapper}}>
                
            </div>
            <div name="window-controls" style={{...WindowControlsWrapper}}>
                <IconButton aria-label="minimize" onClick={handleMin}>
                    <Remove fontSize="small" />
                </IconButton>
                <IconButton aria-label="toggleMax" onClick={handleToggleMaximize}>
                    {isMaximized? <RestoreIcon fontSize="small"/> : <CropLandscape fontSize="small"/> }
                </IconButton>
                <IconButton aria-label="close" onClick={handleClose}>
                    <Close fontSize="small" />
                </IconButton>
            </div>
        </div>
    )
}