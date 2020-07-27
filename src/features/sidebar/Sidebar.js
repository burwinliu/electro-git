import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

//Components
import { ModalFormTag } from "../modals"
import {
    Button, ButtonGroup,
    TextField, IconButton, 
    List, ListItem, ListItemText, ListItemIcon,
    Checkbox,
    Menu, MenuItem,
    Snackbar,
    FormControl, FormHelperText, InputLabel, Input
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
    appstoreSetCurrentDiff,
} from '../../store/ducks'

//styles
import {
    SidebarWrap, SidebarStyle, 
    SidebarHistButtons,
    SidebarMenuItems, SidebarMenuIcons, SidebarCheckbox,
    SidebarCommitMenu, SidebarCommitText, SidebarCommitSubText, SidebarCommitButtonGroups
} from './SidebarStyle'

import {colors} from "../../styles/palette"

// Helpers/Services
import {
    helperGitOpen,
    helperGitTag,
    helperGitAddCommit,
    helperGitPush,
    helperGitPushTag,
} from "../../services"
import { GitError } from 'simple-git';


export const SidebarChanges = (props) => {
    const filePath = useSelector(state => state.repo.path);
    const fileStatus = useSelector(state => state.stage.status);

    const dispatch = useDispatch()

    const [checkRecord, setChecked] = useState({});
    const [commitMsg, setCommitMsg] = useState('');

    const [toastMsg, setToastMsg] = useState("ERROR")
    const [toast, setToast] = useState(false)

    const [modalTagOpen, setModalTagOpen] = useState(false)
    const [tagText, setTagText] = useState("")
    const [tagMessage, setTagMessage] = useState("")

    const [loaded, setLoaded] = useState(true)

    useEffect( () => {
        props.refresh()
    }, [filePath])
    
    useEffect(() => {
        // Set up the file status
        let temp = {}
        for ( let i in fileStatus) {
            temp[i] = true
        }

        setChecked(temp)
    }, [fileStatus])

    useEffect(() => {
        // Prevent memory leak
        return () => {
            setLoaded(false)
        }
    }, [])

    const handleIconClick = (id) => {
        dispatch(appstoreSetCurrentDiff(id))
    }

    const handleRecord = (value) => {
        const temp = checkRecord
        temp[value] = true
        setChecked(temp)
    }

    const handleCheck = (evt) => {
        const temp = {...checkRecord}
        temp[evt.target.id] = !temp[evt.target.id]
        setChecked(temp)
    }

    const handleCommit = async (evt) => {
        const toCommit = []

        for(const i in checkRecord){
            if(checkRecord[i]){
                toCommit.push(i)
            }
        }
        await helperGitAddCommit(filePath, toCommit ,commitMsg)
        setCommitMsg("")
        props.refresh()
    }

    const handleCommitMsg = (evt) => {
        setCommitMsg(evt.target.value)
    }

    const handlePush = (evt) => {
        console.log("PUSHING")
        helperGitPush(filePath)
            .then((response) => {
                if(loaded){
                    console.log(response)
                    setToastMsg("Push to " + response.repo + " successful.")
                    setToast(true)
                }
                
            })
            .catch((err) => {
                if(loaded){
                    if (err instanceof GitError){
                        console.log("CAUGHT")
                        setToastMsg(" This Repository does not have a push destination configured. ")
                        setToast(true)
                    }
                    else{
                        throw err
                    }
                }
            })
    }

    const handleToastClose = () => {
        setToast(false)
    }

    const tagChange = (evt) => {
        setTagText(evt.target.value)
    }

    const tagMessageChange = (evt) => {
        setTagMessage(evt.target.value)
    }

    const handleTagOpen = () => {
        setModalTagOpen(true)
    }

    const handleTagClose = () => {
        setModalTagOpen(false)
    }

    const handleTagConfirm = () => {
        helperGitTag(filePath, tagText, tagMessage).then((obj) => {
            console.log(obj)
        })
        setModalTagOpen(false)
    }
    
    // Local items to make sure rendering goes well, and we aren't rendering null things. statusIcon is just an icon to be set and changed for inner rendering of the component
    let toRender = {}
    let statusIcon = null
    
    if(fileStatus !== undefined){
        console.log(filePath, "FILE PATH");
        toRender = fileStatus
    }

    return (
        <div style={SidebarWrap}>
            
            <List component="nav" aria-label="secondary mailbox folders" style={SidebarStyle}>
                {Object.keys(toRender).map((value) => {
                    if(checkRecord[value] === undefined){
                        handleRecord(value)
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
                        <ListItem key={value} button onClick={(evt) => handleIconClick(value)} style={SidebarMenuItems}>
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
            <div style={{...SidebarCommitMenu}} >
                <div style={{flexDirection: "column", margin: "0 10px"}}>
                    <div 
                        htmlFor="commit-input" 
                        style={{display: "inline-flex", flexDirection: "row", justifyContent: "space-between", flexGrow: "1"}}
                    >
                        <div style={{...SidebarCommitSubText, marginTop: "auto", marginBottom: "auto"}}>
                            Commit Message
                        </div>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleTagOpen}
                            style={{padding: "5px"}}
                            title="Add a Tag"
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                    <FormControl>
                        
                        <Input 
                            id="commit-input" 
                            multiline rows={5}
                            style={{padding: "0", margin: "0"}}
                            onChange={handleCommitMsg}
                            value={commitMsg}
                        />
                    </FormControl>
                </div>
                
                <ButtonGroup style={SidebarCommitButtonGroups} disableElevation variant="contained" color="primary">
                    <Button onClick={handleCommit} variant="outlined">Commit</Button>
                    <Button onClick={handlePush} variant="outlined">Push</Button>
                </ButtonGroup>
            </div>
            <Snackbar
                open={toast}
                onClose={handleToastClose}
                message={toastMsg}
                autoHideDuration={6000}
            />
            <ModalFormTag
                open={modalTagOpen}
                tag={tagText}
                message={tagMessage}
                handleTagChange={tagChange}
                handleMessageChange={tagMessageChange}
                handleClose={handleTagClose}
                handleConfirm={handleTagConfirm}
            />
            
        </div>
    )
}

export const SidebarHistory = (props) => {
    return ( 
        <div style={SidebarWrap}>
            <p>testing</p>
        </div>
    )
}

export const Sidebar = (props) => {
    const handleHist = () => {
        props.setHist(true)
    }

    const handleChange = () => {
        props.setHist(false)
    }
    return (
        <div style={{flexDirection: "column"}}>
            <ButtonGroup color="primary" aria-label="outlined primary button group" style={{width: "100%"}}>
                <Button style={{...SidebarHistButtons}} onClick={handleChange}>Changes</Button>
                <Button style={{...SidebarHistButtons}} onClick={handleHist}>History</Button>
            </ButtonGroup>
            {props.histControl ? <SidebarHistory refresh={props.refresh}/> : <SidebarChanges refresh={props.refresh}/> }
        </div>
    )
}