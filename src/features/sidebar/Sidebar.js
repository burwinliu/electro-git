import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

//Components
import { ModalFormTag, ModalFormFile } from "../modals"
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
} from '@material-ui/icons'

import {
    colors
} from "../../styles/palette"

import {
    appstoreSetCurrentDiff, 
    
    stageSetRepoLog,
    appstoreSetCurrentHistFile,
    appstoreSetContentControl,
    appstoreSetHistControl,
    stageSetFileHistDiff,
    stageSetRepoHistDiff,
    stageSetRepoHistStatus,
    appstoreSetLogLine,
    stageSetStatusSummary,
} from '../../store/ducks'

//styles
import {
    SidebarWrap, SidebarStyle, 
    SidebarHistButtons,
    SidebarMenuItems, SidebarMenuIcons, SidebarCheckbox,
    SidebarCommitMenu, SidebarCommitText, SidebarCommitSubText, SidebarCommitButtonGroups,

    SidebarHistText
} from './SidebarStyle'

import {
    getSymbol,
    MenuSidebarChangesItem
} from './SidebarHelper'

// Helpers/Services
import {
    helperGitOpen,
    helperGitTag,
    helperGitAddCommit,
    helperGitPush,
    helperGitPushTag,
    helperGitLog,
    helperGitDiffHist,
    renderGitDiffInfo,
    helperGitShowHist,
    renderGitStatusHist,
    helperGitFetch
} from "../../services"

import {
    CONTENT_CONTROL,
    DIFF_CONTROL,
    HISTORY_CONTROL
} from "../../store/ducks"

import { ipcRenderer } from 'electron';


export const SidebarChanges = (props) => {
    const filePath = useSelector(state => state.repo.path);
    const fileStatus = useSelector(state => state.stage.status);

    const dispatch = useDispatch()

    const [checkRecord, setChecked] = useState({});
    const [commitMsg, setCommitMsg] = useState('');

    const [toastMsg, setToastMsg] = useState("ERROR")
    const [toast, setToast] = useState(false)

    const [modalTagOpen, setModalTagOpen] = useState(false)

    const [loaded, setLoaded] = useState(true)

    const [state, setState] = useState({
        mouseX: null,
        mouseY: null,
        value: null,
    })


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
        dispatch(appstoreSetCurrentDiff(id.replace(/"/g, '')))
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
        helperGitFetch(filePath).then((status) => {
            dispatch(stageSetStatusSummary(status))
        })
        setCommitMsg("")
        props.refresh()
    }

    const handleCommitMsg = (evt) => {
        setCommitMsg(evt.target.value)
    }

    const handleToastClose = () => {
        setToast(false)
    }
    const handleTagOpen = () => {
        setModalTagOpen(true)
    }

    const handleTagClose = () => {
        setModalTagOpen(false)
    }

    const handleContextChangeItem = (event, val) => {
        const parent = document.getElementById('sidebar-changes').getBoundingClientRect()
        event.preventDefault();

        if(event.clientX < parent.left || event.clientX > parent.right || event.clientY < parent.top || event.clienY > parent.bottom ){
            setState({
                mouseX: null,
                mouseY: null,
                ...state,
            })
        }
        else{
            setState({
                mouseX: event.clientX - 2,
                mouseY: event.clientY - 4,
                value: val,
            });
        }
    }

    const handleResetContext = () => {
        setState({
            mouseX: null,
            mouseY: null,
            value: state.value
        })
    }
    
    // Local items to make sure rendering goes well, and we aren't rendering null things. statusIcon is just
    // an icon to be set and changed for inner rendering of the component
    let toRender = {}
    
    if(fileStatus !== undefined){
        toRender = fileStatus
    }

    return (
        <div style={SidebarWrap}>
            
            <List id={"sidebar-changes"} component="nav" aria-label="secondary mailbox folders" style={SidebarStyle} onMouseDown={handleResetContext}>
                {Object.keys(toRender).map((value) => {
                    if(checkRecord[value] === undefined){
                        handleRecord(value)
                    }

                    const parsedValue = value.replace(/"/g, "")

                    return (
                        <ListItem 
                            key={value}
                            button 
                            onClick={(evt) => handleIconClick(value)} 
                            style={SidebarMenuItems}
                            onContextMenu={(evt) => handleContextChangeItem(evt, value)}
                        >
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
                            <ListItemText primary={`${parsedValue}`}/>
                            {getSymbol(fileStatus[value].working_dir, fileStatus[value].index)}
                        </ListItem>
                    );
                })}
                <MenuSidebarChangesItem
                    state={state}
                    setState={setState}
                    refresh={props.refresh}
                />
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
                    <Button id="commit-btn" style={{width: "100%"}} onClick={handleCommit} variant="outlined">Commit</Button>
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
                handleClose={handleTagClose}
            />
            
            
        </div>
    )
}

export const SidebarHistory = (props) => {
    const repoPath = useSelector(state=>state.repo.path)
    const histControl = useSelector(state => state.appstore.histControl)

    const [overviewStyle, setOverviewStyle] = useState({})
    const [fileStyle, setFileStyle] = useState({})

    const [openFileModal, setOpenFileModal] = useState(false)
    const [directory, setDirectory] = useState("")

    const dispatch = useDispatch()

    useEffect( () => {
        if(histControl === HISTORY_CONTROL.MAIN_OVERVIEW_VIEW){
            setOverviewStyle({color: colors.purpleLight, borderColor: colors.purpleLight, backgroundColor: colors.offWhite})
            setFileStyle({})
        } 
        else if (histControl === HISTORY_CONTROL.MAIN_FILE_VIEW){
            setOverviewStyle({})
            setFileStyle({color: colors.purpleLight, borderColor: colors.purpleLight, backgroundColor: colors.offWhite})
        } 
    }, [histControl])

    const historyOverview = () => {
        dispatch(appstoreSetHistControl(HISTORY_CONTROL.MAIN_OVERVIEW_VIEW))
    }

    const historyFile = () => {
        setOpenFileModal(true)
    }

    const changeDir = (input) => {
        setDirectory(input)
    }

    const changeDirEvent = (evt) => {
        setDirectory(evt.target.value)
    }
    const handleConfirmModal = () => {
        const dirParsed = directory.replace(/\\/g,"\/");
        const repoPathParsed = repoPath.replace(/\\/g,"\/");
        if(dirParsed.includes(repoPathParsed)){
            dispatch(appstoreSetCurrentHistFile(dirParsed.replace(repoPathParsed + "/", "")))
            dispatch(appstoreSetHistControl(HISTORY_CONTROL.MAIN_FILE_VIEW))
            props.refresh()
            setOpenFileModal(false)
        }
        else{
            console.log("VALID ITEM ONLY", repoPathParsed, dirParsed)
        }
        
    }
    const handleCloseModal = () => {
        setOpenFileModal(false)
    }

    return ( 
        <div style={SidebarWrap}>
            <SidebarRenderHistList/>
            <div style={{...SidebarCommitMenu, minHeight: null}} >
                <ButtonGroup color="primary" aria-label="outlined primary button group" style={{width: "100%"}}>
                    <Button style={{...overviewStyle}} onClick={historyOverview}>See History Overview</Button>
                    <Button style={{...fileStyle}} onClick={historyFile}>See History of File</Button>
                </ButtonGroup>
            </div>
            <ModalFormFile 
                open={openFileModal} 
                directory={directory||""}
                
                handleClose={handleCloseModal}
                handleConfirm={handleConfirmModal}
                handleDirectoryChange={changeDirEvent}
                handleDirectory = {changeDir}
            />
        </div>
    )
}

const SidebarHistItem = (props) => {
    const regexTag = /(tag: ([^\n]*?)\, )|(tag: ([^\n]*))/
    const tagText = regexTag.exec(props.toRender.refs)
    const filePath = useSelector(state => state.repo.path);
    const histControl = useSelector(state => state.appstore.histControl)
    
    const dispatch = useDispatch();
    let tagItem;

    if(tagText){
        tagItem = (
            <Button disabled variant="contained" style={{color: "black"}}>
                {tagText[2]||tagText[4]}
            </Button>
        )
    }

    const handleClick = async (logLine) => {
        
        const diffHist = await helperGitDiffHist(filePath, logLine.hash)
        const diffHistRender = renderGitDiffInfo(diffHist)
        if(histControl === HISTORY_CONTROL.MAIN_OVERVIEW_VIEW){
            const statusHist = await helperGitShowHist(filePath, logLine.hash)
            const renderStatusHist = renderGitStatusHist(statusHist)
            dispatch(stageSetRepoHistDiff(diffHistRender))
            dispatch(stageSetRepoHistStatus(renderStatusHist))
        }
        else if(histControl === HISTORY_CONTROL.MAIN_FILE_VIEW){
            dispatch(stageSetFileHistDiff(diffHistRender))
        }
        dispatch(appstoreSetLogLine(logLine))
    }

    return (
        <ListItem button onClick={()=>handleClick(props.toRender)}>
            <ListItemText style={{...SidebarHistText, flexDirection: "column"}} primary={props.toRender.message} secondary={props.toRender.date}/>
            {tagItem}
        </ListItem>
    )
}

const SidebarRenderHistList = (props) => {
    const repoHistory = useSelector(state => state.stage.repoLog);
    const fileHistory = useSelector(state => state.stage.fileLog)
    const hist = useSelector(state => state.appstore.histControl)

    if(hist === HISTORY_CONTROL.MAIN_OVERVIEW_VIEW){
        return (
            <List component="nav" style={SidebarStyle}>
                {Object.keys(repoHistory || {}).map((value) => {
                    return(
                        <SidebarHistItem toRender={repoHistory[value]} key={value}/>        
                    )
                    
                })}
            </List>
        )
    }
    else if(hist === HISTORY_CONTROL.MAIN_FILE_VIEW){
        return (
            <List component="nav" style={SidebarStyle}>
                {Object.keys(fileHistory || {}).map((value) => {
                    return(
                        <SidebarHistItem toRender={fileHistory[value]} key={value}/>        
                    )
                    
                })}
            </List>
        )
    }
    
}


export const Sidebar = (props) => {
    const contentControl = useSelector( state => state.appstore.contentControl)
    const dispatch = useDispatch()

    const [historyStyle, setHistoryStyle] = useState({})
    const [changesStyle, setChangesStyle] = useState({})

    useEffect( () => {
        if(contentControl === CONTENT_CONTROL.MAIN_HISTORY_VIEW){
            setHistoryStyle({color: colors.purpleLight, borderColor: colors.purpleLight, backgroundColor: colors.offWhite})
            setChangesStyle({})
        } 
        else if (contentControl === CONTENT_CONTROL.MAIN_DIFF_VIEW){
            setHistoryStyle({})
            setChangesStyle({color: colors.purpleLight, borderColor: colors.purpleLight, backgroundColor: colors.offWhite})
        } 
    }, [contentControl])

    const renderContent = () => {
        if(contentControl === CONTENT_CONTROL.MAIN_HISTORY_VIEW){
            return(
                <SidebarHistory refresh={props.refresh}/> 
            )
        } 
        else if (contentControl === CONTENT_CONTROL.MAIN_DIFF_VIEW){
            return(
                <SidebarChanges refresh={props.refresh}/> 
            )
        } 
    }

    const handleHist = () => {
        dispatch(appstoreSetContentControl(CONTENT_CONTROL.MAIN_HISTORY_VIEW))
    }

    const handleChange = () => {
        dispatch(appstoreSetContentControl(CONTENT_CONTROL.MAIN_DIFF_VIEW))
    }
    return (
        <div style={{flexDirection: "column"}}>
            <ButtonGroup color="primary" aria-label="outlined primary button group" style={{width: "100%"}}>
                <Button style={{...SidebarHistButtons, ...changesStyle }} onClick={handleChange}>Changes</Button>
                <Button style={{...SidebarHistButtons, ...historyStyle }} onClick={handleHist}>History</Button>
            </ButtonGroup>
            {
                renderContent()
            }
        </div>
    )
}