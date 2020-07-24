import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    Button, ButtonGroup,
    TextField,
    List, ListItem, ListItemText, ListItemIcon,
    Checkbox
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add'
import ChangeHistoryIcon from '@material-ui/icons/ChangeHistory';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DeviceUnknownIcon from '@material-ui/icons/DeviceUnknown';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import MergeTypeIcon from '@material-ui/icons/MergeType';

import {
    appstoreSetCurrentDiff,
} from '../../store/ducks'

//styles
import {
    SidebarWrap, SidebarStyle, 
    SidebarMenuItems, SidebarMenuIcons, SidebarCheckbox,
    SidebarCommitMenu, SidebarCommitText, SidebarCommitButtonGroups
} from './SidebarStyle'

import {colors} from "../../styles/palette"

import {
    helperGitOpen,
    helperGitAddCommit
} from "../../services"

export const Sidebar = (props) => {
    const filePath = useSelector(state => state.repo.path);
    const fileStatus = useSelector(state => state.stage.status);

    const dispatch = useDispatch()

    const [checkRecord, setChecked] = useState({});
    const [commitMsg, setCommitMsg] = useState('');

    const [focused, setFocused] = useState("")

    useEffect(() => {
        let temp = {}
        for ( let i in fileStatus) {
            temp[i] = true
        }

        setChecked(temp)
    }, [fileStatus])

    const handleClick = (id, evt) => {
        dispatch(appstoreSetCurrentDiff(id))
        setFocused(id)
    }

    const setRecord = (value) => {
        const temp = checkRecord
        temp[value] = true
        setChecked(temp)
    }

    const handleCheck = (evt) => {
        const temp = {...checkRecord}
        temp[evt.target.id] = !temp[evt.target.id]
        setChecked(temp)
    }
    
    const handleCommitMsg = (evt) => {
        setCommitMsg(evt.target.value)
    }

    const handleCommit = async (evt) => {
        const toCommit = []
        const gitObj = helperGitOpen(filePath)

        for(const i in checkRecord){
            if(checkRecord[i]){
                toCommit.push(i)
            }
        }
        await helperGitAddCommit(gitObj, toCommit ,commitMsg)
        props.handleRefresh()
    }

    const handlePush = (evt) => {
        const gitObj = helperGitOpen(filePath)
        helperGitPush(gitObj)
    }


    let toRender = {}
    let statusIcon = null
    
    if(fileStatus !== undefined){
        toRender = fileStatus
    }

    

    return (
        <div style={SidebarWrap}>
            <List component="nav" aria-label="secondary mailbox folders" style={SidebarStyle}>
                {Object.keys(toRender).map((value) => {
                    if(checkRecord[value] === undefined){
                        setRecord(value)
                    }

                    switch(fileStatus[value].working_dir){
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
                    switch(fileStatus[value].index){
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
                        <ListItem key={value} button onClick={(evt) => handleClick(value, evt)} style={SidebarMenuItems}>
                            <ListItemIcon style={SidebarMenuIcons}>
                                <Checkbox
                                    edge="start"
                                    disableRipple
                                    id={ value }
                                    style={SidebarCheckbox}
                                    onChange = {handleCheck}
                                    checked = {checkRecord[value]}
                                />
                            </ListItemIcon>
                            <ListItemText primary={`${value}`}/>
                            {statusIcon}
                        </ListItem>
                    );
                })}
            </List>
            <div style={SidebarCommitMenu}>
                <TextField
                    style={SidebarCommitText}
                    label="Commit Message"
                    multiline
                    rows={5}
                    value={commitMsg}
                    onChange={handleCommitMsg}
                />
                <ButtonGroup style={SidebarCommitButtonGroups} disableElevation variant="contained" color="primary">
                    <Button onClick={handleCommit} variant="outlined">Commit</Button>
                    <Button onClick={handlePush} variant="outlined">Push</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}