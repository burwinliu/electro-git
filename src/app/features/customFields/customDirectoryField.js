import React, { useEffect } from 'react';

import {Button, TextField } from '@material-ui/core'

import {FieldWrapper, FieldButton, FieldInput} from './FieldStyle'

import {ipcRenderer} from 'electron';



export const CustomDirectoryField = (props) => {
    const getDirectory = () => {
        ipcRenderer.send('selectDirectory');
    }
    useEffect(()=>{
        const renderFunc = (e, files) => {
            const filePath = files.filePaths[0]
            if (!files.cancelled){
                props.handleDirectory(filePath)
            }
        }
        ipcRenderer.on("selectDirectory", renderFunc);
        return () => {
            ipcRenderer.removeListener("selectDirectory", renderFunc)
        }
    })
    
    
    return(
        <div style={FieldWrapper}>
            <TextField 
                id="input-createrepo-directory-text"  // react to some directory change here
                type="text"
                value={props.directory} 
                onChange={props.handleDirectoryChange}

                style={FieldInput}
            />
            <Button style={FieldButton} onClick={getDirectory}>
                Directory
            </Button>
        </div>
    )
}