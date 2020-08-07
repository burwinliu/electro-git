import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

// Components
import { 
    Button, 
    Collapse, List, ListItem, ListItemText, ListItemIcon, Divider,
    withStyles,
    ClickAwayListener,
} from '@material-ui/core';
import { ModalRepoSetting, ModalBranchCreate } from '../modals/Modals';
import { FetchOrPull, BranchDropdown } from "./HeaderHelper";

import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon,
    Settings as SettingsIcon,
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
    repoSetPath,
} from '../../store/ducks'

import { colors } from '../../styles/palette';




export const Header = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const repoRecord = useSelector(state=>state.appstore.repoRecord)
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();
    const [repoNav, setRepoNav] = useState(false)
    

    const [repoSettings, setRepoSettings] = useState(false)
    const [render, setRender] = useState(false)
    
    


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




    

    const handleRepoDialogOpen = () => {
        setRepoSettings(true)
    }
    const handleRepoDialogClose = () => {
        setRepoSettings(false)
    }
   
    const handleNewRepo = (newPath) => {
        dispatch(repoSetPath(newPath))
        history.push('/')
    }

    const handleRefresh = async  () => {
        console.log("REFRESHING")
        setRender(true)
        await props.refresh()
        setRender(false)
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
                <BranchDropdown refresh={handleRefresh}/>
                <FetchOrPull/>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handleRefresh}>
                    Refresh Repo
                </Button>
                
            </div>
            <Button style={{...HeaderItem, borderWidth: "0 0 0 1px"}} onClick={handleReturn}>
                Choose new Repo (For development)
            </Button>
            <ModalRepoSetting open={repoSettings} handleClose={handleRepoDialogClose}/>
            
        </div>
    )
}