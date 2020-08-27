import { 
    Add as AddIcon, 
    ChangeHistory as ChangeHistoryIcon, 
    Clear as ClearIcon,
    DeleteOutlineOutlined as DeleteOutlineOutlinedIcon,
    DeviceUnknown as DeviceUnknownIcon,
    EditOutlined as EditOutlinedIcon,
    FileCopyOutlined as FileCopyOutlinedIcon,
    MergeType as MergeTypeIcon
 } from '@material-ui/icons';

 import {
     Menu, 
     MenuItem,
     ListItemIcon,
 } from '@material-ui/core'

 import React, { useEffect } from 'react'

 import {
     SidebarMenuIcons
 } from "./SidebarStyle"

 import {
     colors
 } from "../../styles/palette"
import { helperGitIgnore, helperGitCheckIgnore } from '../../services';
import { useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';

export const getSymbol = (working_dir, index) => {
    switch(working_dir){
        case "!":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Ignored">
                    <ClearIcon/>
                </ListItemIcon>
            )
            
        case "?":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Not Tracked">
                    <DeviceUnknownIcon/>
                </ListItemIcon>
            )
            
        case "M":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Modified">
                    <ChangeHistoryIcon/>
                </ListItemIcon>
            )
            
        case "D":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.red}} title="Deleted">
                    <DeleteOutlineOutlinedIcon/>
                </ListItemIcon>
            )
            
        case "R":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Renamed">
                    <EditOutlinedIcon/>
                </ListItemIcon>
            )
            
        case "C":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.blue}} title="Copied">
                    <FileCopyOutlinedIcon/>
                </ListItemIcon>
            )
            
    }
    switch(index){
        case "!":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Ignored">
                    <ClearIcon/>
                </ListItemIcon>
            )
            
        case "?":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Not Tracked">
                    <DeviceUnknownIcon/>
                </ListItemIcon>
            )
            
        case "M":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Modified">
                    <ChangeHistoryIcon/>
                </ListItemIcon>
            )
            
        case "A":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.green}} title="Added">
                    <AddIcon/>
                </ListItemIcon>
            )
            
        case "D":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.red}} title="Deleted">
                    <DeleteOutlineOutlinedIcon/>
                </ListItemIcon>
            )
            
        case "R":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Renamed">
                    <EditOutlinedIcon/>
                </ListItemIcon>
            )
            
        case "C":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.blue}} title="Copied">
                    <FileCopyOutlinedIcon/>
                </ListItemIcon>
            )
        case "U":
            return (
                <ListItemIcon style={{...SidebarMenuIcons, color: colors.blue}} title="Copied">
                    <MergeTypeIcon/>
                </ListItemIcon>
            )
    }
}

export const MenuSidebarChangesItem = (props) => {
    const repoPath = useSelector(state=>state.git.path)

    let state = props.state
    const setState = props.setState
    const refresh = props.refresh

    const initialState = {
        mouseX: null,
        mouseY: null,
        value: null,
    };

    useEffect( () => {
        state = props.state
    }, [state])

    const handleIgnore = () => {
        if(state.value && helperGitCheckIgnore(repoPath, state.value)){
            console.log(state.value)
            ipcRenderer.send('addToGitIgnore', repoPath, state.value )
            refresh();
        }
        handleClose();
    }

    const handleOpenExplore = () => {
        let path;
        if (repoPath.slice(-1) != "/"){
            path = repoPath + "/" + state.value
        }
        else{
            path = repoPath + state.value
        }
        ipcRenderer.send('openInFileExplorer', path )
        handleClose();
    }

    const handleClose = () => {
        setState(initialState);
    }

    return (
        <Menu
            keepMounted
            open={state.mouseY !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            anchorPosition={
                state.mouseY !== null && state.mouseX !== null
                    ? { top: state.mouseY, left: state.mouseX }
                    : undefined
            }
        >
            <MenuItem onClick={handleIgnore}>Add to .gitignore</MenuItem>
            <MenuItem onClick={handleOpenExplore}>Open in Explorer</MenuItem>
        </Menu>
    )
}