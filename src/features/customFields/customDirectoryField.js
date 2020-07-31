import React, { useEffect } from 'react';

import {Button, TextField } from '@material-ui/core'

import {FieldWrapper, FieldButton, FieldInput} from './FieldStyle'

import {ipcRenderer} from 'electron';



export const CustomDirectoryField = (props) => {
    const getDirectory = () => {
        ipcRenderer.send('selectDirectoryCustomField');
    }
    useEffect(()=>{
        const renderFunc = (e, files) => {
            const filePath = files.filePaths[0]
            if (!files.cancelled){
                props.handleDirectory(filePath)
            }
        }
        ipcRenderer.on("selectDirectoryCustomField", renderFunc);
        return () => {
            ipcRenderer.removeListener("selectDirectoryCustomField", renderFunc)
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

export const CustomFileField = (props) => {
    const getDirectory = () => {
        ipcRenderer.send('selectFileCustomField');
    }
    useEffect(()=>{
        const renderFunc = (e, files) => {
            const filePath = files.filePaths[0]
            if (!files.cancelled){
                props.handleDirectory(filePath)
            }
        }
        ipcRenderer.on("selectFileCustomField", renderFunc);
        return () => {
            ipcRenderer.removeListener("selectFileCustomField", renderFunc)
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
                File
            </Button>
        </div>
    )
}