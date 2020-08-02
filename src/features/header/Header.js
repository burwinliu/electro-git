import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { 
    Button, ButtonGroup, Icon,
    Collapse, List, ListItem, ListItemText, ListItemIcon, Divider,
    withStyles,
    ClickAwayListener,
} from '@material-ui/core';

import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Settings as SettingsIcon,
    MergeType as MergeTypeIcon
} from '@material-ui/icons';

import * as path from 'path';

import {
    HeaderWrap, HeaderItem,
    HeaderSidebar, HeaderRepoSidebarDropdown, HeaderRepoSidebarDropdownWrapper,
    HeaderMenuSubText,
    HeaderMenuMainText,
} from "./HeaderStyles"

import {
    repoSetPath,
} from '../../store/ducks'
import { colors } from '../../styles/palette';
import { ModalRepoSetting } from '../modals/Modals';

import {
    helperGitBranchCheckout
} from '../../services'

export const Header = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const curBranch = useSelector(state => state.appstore.branch)
    const branchList = useSelector(state=>state.stage.branchList)
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();
    const [repoNav, setRepoNav] = useState(false)
    const [branchNav, setBranchNav] = useState(false)

    const [repoSettings, setRepoSettings] = useState(false)
    

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
            zIndex: "1"
        },
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

    const handleBranchOpen = () => {
        setBranchNav(true);
    };
    const handleBranchClose = () => {
        setBranchNav(false)
    }

    const handleRepoDialogOpen = () => {
        setRepoSettings(true)
    }
    const handleRepoDialogClose = () => {
        setRepoSettings(false)
    }

    const handleCheckoutBranch = (branchName, commit) => {
        helperGitBranchCheckout(dirPath, branchName, commit)
            .then((response) =>{
                console.log(response)
                props.refresh()
            })
            .catch((err) =>{
                console.log(err)

            })
    }   

    return (
        <div style={HeaderWrap}>
            <div>
                <ClickAwayListener onClickAway={handleRepoClose}>
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
                            </List>
                        </SidebarDropdown>
                        
                    
                    </div>
                </ClickAwayListener>
                <ClickAwayListener onClickAway={handleBranchClose}>
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
                                {
                                    Object.keys(branchList||{}).map((key) => {
                                        const splitStr = branchList[key].name.split("/");
                                        if(branchList[key].current === true || splitStr[splitStr.length-1] === curBranch){
                                            return
                                        }
                                        return (
                                            <ListItem button key={key} onClick={() => handleCheckoutBranch(branchList[key].name, branchList[key].commit)}>
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
                    
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.refresh}>
                    Fetch and Refresh
                </Button>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.handleDiffSwitch}>
                    Switch Diff Render (Development Only, to change to dropdown)
                </Button>
            </div>
            <Button style={{...HeaderItem, borderWidth: "0 0 0 1px"}} onClick={handleReturn}>
                Choose new Repo (For development)
            </Button>
            <ModalRepoSetting open={repoSettings} handleClose={handleRepoDialogClose}/>
        </div>
    )
}