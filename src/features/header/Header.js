import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

// Components
import { 
    Button, ButtonGroup, Icon,
    Collapse, List, ListItem, ListItemText, ListItemIcon, Divider,
    withStyles,
    ClickAwayListener,
} from '@material-ui/core';
import { ModalRepoSetting, ModalBranchCreate } from '../modals/Modals';
import { FecthOrPull } from "./HeaderHelper";

import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Settings as SettingsIcon,
    MergeType as MergeTypeIcon,
    Folder as FolderIcon,
} from '@material-ui/icons';

import * as path from 'path';

import {
    HeaderWrap, HeaderItem,
    HeaderSidebar, HeaderRepoSidebarDropdown, HeaderRepoSidebarDropdownWrapper,
    HeaderMenuSubText,
    HeaderMenuMainText,
} from "./HeaderStyles"

import {
    repoSetPath, stageSetStatusSummary,
} from '../../store/ducks'
import { colors } from '../../styles/palette';


import {
    helperGitBranchCheckout,
    helperGitFetch
} from '../../services'

export const Header = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const curBranch = useSelector(state => state.appstore.branch)
    const branchList = useSelector(state=>state.stage.branchList)
    const repoRecord = useSelector(state=>state.appstore.repoRecord)
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();
    const [repoNav, setRepoNav] = useState(false)
    const [branchNav, setBranchNav] = useState(false)
    

    const [repoSettings, setRepoSettings] = useState(false)
    const [branchCreate, setBranchCreate] = useState(false)
    
    const recordBranch = {}

    const HeaderButton = withStyles((theme) => ({
        root:{
            alignItems: "start",
        },
        label: {
            flexDirection: "row",
            minWidth: "268px",
            justifyContent: "space-between"
        },
        
    }))(Button);

    const SidebarDropdown = withStyles(() => ({
        wrapper:{
            width: "300px",
            backgroundColor: colors.background,
            zIndex: "1",
            
        },
        wrapperInner:{
            flexDirection: "column"
        }
    }))(Collapse)

    let basePath = null

    if (dirPath !== undefined){
        basePath = path.basename(dirPath)
    }
    

    const handleReturn = () => {
        dispatch(repoSetPath(""))
        history.push('/')
    }

    const handleRepoOpen = () => {
        setRepoNav(true);
    };
    const handleRepoClose = () => {
        setRepoNav(false)
    }
    const handleClickAwayRepo = () => {
        if(repoSettings) return
        handleRepoClose()
    }

    const handleBranchDialogOpen = () => {
        setBranchCreate(true)
    }
    const handleBranchDialogClose = () => {
        props.refresh()
        setBranchCreate(false)
    }


    const handleBranchOpen = () => {
        setBranchNav(true);
    };
    const handleBranchClose = () => {
        setBranchNav(false)
    }

    const handleClickAwayBranch = () => {
        if (branchCreate) return
        handleBranchClose()
    }

    const handleRepoDialogOpen = () => {
        setRepoSettings(true)
    }
    const handleRepoDialogClose = () => {
        setRepoSettings(false)
    }
   

    const handleCheckoutBranch = (branchName, commit) => {
        helperGitBranchCheckout(dirPath, branchName)
            .then((response) =>{
                console.log(response)
                props.refresh()
            })
            .catch((err) =>{
                console.log(err)

            })
    }   
    const handleNewRepo = (newPath) => {
        dispatch(repoSetPath(newPath))
        history.push('/')
    }

    

    return (
        <div style={HeaderWrap}>
            <div>
                <ClickAwayListener onClickAway={handleClickAwayRepo}>
                    <div style={{flexDirection: "column", height: "fit-content"}}>
                        {repoNav? 
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, backgroundColor: colors.background, borderWidth: "0 1px 0 0"}} onClick={handleRepoClose}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Repository:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{basePath}</div>
                                </div>
                                <ArrowDropUpIcon fontSize="large"/>
                            </HeaderButton> 
                            :
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 1px 0 0"}} onClick={handleRepoOpen}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Repository:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{basePath}</div>
                                </div>
                                <ArrowDropDownIcon fontSize="large"/>
                            </HeaderButton> 
                        }   
                        <SidebarDropdown in={repoNav}>
                            <List style={{...HeaderRepoSidebarDropdown}}>
                                <ListItem button onClick={handleRepoDialogOpen}>
                                    <ListItemIcon>
                                        <SettingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Repository Settings" />
                                </ListItem>
                                <Divider />
                                {
                                    Object.keys(repoRecord||{}).map((key) => {
                                        const pathSplit = repoRecord[key].split("/")
                                        
                                        if (repoRecord[key] === dirPath || repoRecord[key] === "") return 
                                        return(
                                            <ListItem style={{minHeight: "30px"}} button key={key} onClick={() => handleNewRepo(repoRecord[key])}>
                                                <ListItemIcon>
                                                    <FolderIcon/>
                                                </ListItemIcon>
                                                <ListItemText primary={pathSplit[pathSplit.length-1]}/>
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </SidebarDropdown>
                        
                    
                    </div>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleClickAwayBranch}>
                    <div style={{flexDirection: "column", height: "fit-content"}}>
                        {branchNav? 
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, backgroundColor: colors.background, borderWidth: "0 1px 0 0"}} onClick={handleBranchClose}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Branch:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{curBranch}</div>
                                </div>
                                <ArrowDropUpIcon fontSize="large"/>
                            </HeaderButton> 
                            :
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 1px 0 0"}} onClick={handleBranchOpen}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Branch:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{curBranch}</div>
                                </div>
                                <ArrowDropDownIcon fontSize="large"/>
                            </HeaderButton> 
                        }   
                        <SidebarDropdown in={branchNav}>
                            <List style={{...HeaderRepoSidebarDropdown}}>
                                <ListItem>
                                    <Button style={{width: "100%"}} variant="outlined" onClick={handleBranchDialogOpen}>
                                        New Branch
                                    </Button>
                                </ListItem>
                                {
                                    Object.keys(branchList||{}).map((key) => {
                                        const splitStr = branchList[key].name.split("/");
                                        if(branchList[key].current === true || splitStr[splitStr.length-1] === curBranch || recordBranch[splitStr[splitStr.length-1]]){
                                            return
                                        }
                                        recordBranch[splitStr[splitStr.length-1]] = true
                                        return (
                                            <ListItem button key={key} onClick={() => handleCheckoutBranch(splitStr[splitStr.length-1])}>
                                                <ListItemIcon>
                                                    <MergeTypeIcon/>
                                                </ListItemIcon>
                                                <ListItemText 
                                                    style={{flexDirection: "column"}}
                                                    primary={splitStr[splitStr.length-1]} 
                                                    secondary={branchList[key].commit}
                                                />
                                            </ListItem>
                                        )
                                    })
                                }
                            </List>
                        </SidebarDropdown>
                        
                    
                    </div>
                </ClickAwayListener>
                <FecthOrPull/>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.refresh}>
                    Refresh Repo
                </Button>
                
            </div>
            <Button style={{...HeaderItem, borderWidth: "0 0 0 1px"}} onClick={handleReturn}>
                Choose new Repo (For development)
            </Button>
            <ModalRepoSetting open={repoSettings} handleClose={handleRepoDialogClose}/>
            <ModalBranchCreate open={branchCreate} handleClose={handleBranchDialogClose}/>
        </div>
    )
}