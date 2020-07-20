import React from 'react';

import {Button} from '@material-ui/core'

import {FieldWrapper, FieldButton, FieldInput} from './fieldStyle'

import {ipcRenderer} from 'electron';



export const CustomDirectoryField = (props) => {
    const getDirectory = () => {
        ipcRenderer.send('selectDirectory');
    }

    ipcRenderer.on("selectDirectory", (e, files) => {
        props.handleDirectoryChange(files.filePaths[0])
    });
    
    return(
        <div style={FieldWrapper}>
            <input 
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