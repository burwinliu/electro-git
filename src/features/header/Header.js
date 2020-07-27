import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { 
    Button, ButtonGroup,
    Collapse, List, ListItem, ListItemText,
    Menu,MenuItem,
    withStyles,
} from '@material-ui/core';

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
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();
    const [repoNav, setRepoNav] = useState(false)



    const HeaderButton = withStyles((theme) => ({
        root:{
            alignItems: "start",
        },
        label: {
            flexDirection: "column",
            minWidth: "268px",
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
        history.push('/main')
    }

    const handleRepoToggle = (event) => {
        setRepoNav(!repoNav);
    };

    return (
        <div style={HeaderWrap}>
            <div>
                <div style={{flexDirection: "column", height: "fit-content"}}>
                    <HeaderButton style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 1px 0 0"}} onClick={handleRepoToggle}>
                        <div style={{...HeaderMenuSubText}}>{"Current Repository:"}</div>
                        <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{basePath}</div>
                    </HeaderButton>
                    <SidebarDropdown in={repoNav}>
                        <List style={{...HeaderRepoSidebarDropdown}}>
                            <ListItem button>
                                <p>Repo Settings</p>
                            </ListItem>
                        </List>
                    </SidebarDropdown>
                </div>
                    
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.refresh}>
                    Fetch and Refresh
                </Button>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.handleModeSwitch}>
                    Switch Diff Render (Development Only, to change to dropdown)
                </Button>
            </div>
            <Button style={{...HeaderItem, borderWidth: "0 0 0 1px"}} onClick={handleReturn}>
                Choose new Repo (For development)
            </Button>
            
        </div>
    )
}