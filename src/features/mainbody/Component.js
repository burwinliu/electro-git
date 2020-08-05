import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux";

import {
    List, ListItem, ListItemText, ListItemIcon,
    Checkbox,
} from '@material-ui/core';
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
    SidebarStyle, SidebarWrap,
    SidebarMenuItems, SidebarMenuIcons
} from "../sidebar/SidebarStyle"

import {
    BodyHistHeader
} from "./BodyStyle"

import {colors} from "../../styles/palette"

export const SidebarDiffRender = (props) => {
    /*
        Assumes you pass onSelect, statusObj
    */
    const [statusObj, setStatus] = useState(props.statusObj)

    const handleDiff = props.onSelect

    useEffect(()=>{
        setStatus(props.statusObj)
    }, [props.statusObj])


    const handleIconClick = (id) => {
        handleDiff(id)
    }

    let statusIcon;
    return(
        <div name="status" style={{...SidebarWrap}}>
            <List component="nav" aria-label="secondary mailbox folders" style={SidebarStyle}>
                {Object.keys(statusObj).map((value) => {
                    switch(statusObj[value].working_dir){
                        case "!":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Ignored">
                                    <ClearIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "?":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Not Tracked">
                                    <DeviceUnknownIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "M":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Modified">
                                    <ChangeHistoryIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "D":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.red}} title="Deleted">
                                    <DeleteOutlineOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "R":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Renamed">
                                    <EditOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "C":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.blue}} title="Copied">
                                    <FileCopyOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                    }
                    switch(statusObj[value].index){
                        case "!":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Ignored">
                                    <ClearIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "?":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.grey}} title="Not Tracked">
                                    <DeviceUnknownIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "M":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Modified">
                                    <ChangeHistoryIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "A":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.green}} title="Added">
                                    <AddIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "D":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.red}} title="Deleted">
                                    <DeleteOutlineOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "R":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.yellow}} title="Renamed">
                                    <EditOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                        case "C":
                            statusIcon = (
                                <ListItemIcon style={{...SidebarMenuIcons, color: colors.blue}} title="Copied">
                                    <FileCopyOutlinedIcon/>
                                </ListItemIcon>
                            )
                            break
                    }   
                    return (
                        <ListItem key={value} button onClick={() => handleIconClick(value)} style={SidebarMenuItems}>
                            <ListItemText primary={`${value}`}/>
                            {statusIcon}
                        </ListItem>
                    );
                })}
            </List>
        </div>
    )
}

export const BodyHeaderHistoryFile = (props) => {
    const logLine = useSelector(state=> state.appstore.currentLogLine)

    return(
        <div style={{...BodyHistHeader}}>
            <ListItem>
                <ListItemText
                    primary={logLine.message}
                    secondary={
                        logLine.author_email
                    }
                    style={{flexDirection: "column"}}
                />
            </ListItem>
        </div>

    )
}

export const BodyHeaderHistoryRepo = () => {
    const logLine = useSelector(state=> state.appstore.currentLogLine)
    
    return(
        <div style={{...BodyHistHeader}}>
            <ListItem>
                <ListItemText
                    primary={logLine.message}
                    secondary={
                        logLine.author_email
                    }
                    style={{flexDirection: "column"}}
                />
            </ListItem>
        </div>

    )
}

export const BodyHeaderHistoryRepoUndefined = (props) => {
    const logLine = useSelector(state=> state.appstore.currentLogLine)
    
    return(
        <div style={{...BodyHistHeader}}>
            <ListItem>
                <ListItemText
                    primary="No Commit selected"
                />"
            </ListItem>
        </div>

    )
}