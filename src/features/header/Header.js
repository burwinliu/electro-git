import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { 
    Button, ButtonGroup,
    withStyles
} from '@material-ui/core';

import * as path from 'path';

import {
    HeaderWrap, HeaderItem,
    HeaderSidebar,
    HeaderMenuSubText,
    HeaderMenuMainText,
} from "./HeaderStyles"

import {
    repoSetPath,
} from '../../store/ducks'

export const Header = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch();

    //ROUTER HOOKS
    const history = useHistory();

    const HeaderButton = withStyles((theme) => ({
        root:{
            alignItems: "start",
        },
        label: {
            flexDirection: "column",
            minWidth: "268px",
        },
    }))(Button);

    let basePath = null

    if (dirPath !== undefined){
        basePath = path.basename(dirPath)
    }
    

    const handleReturn = () => {
        dispatch(repoSetPath(""))
        history.push('/main')
    }

    return (
        <div style={HeaderWrap}>
            <ButtonGroup>
                <HeaderButton style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 1px 0 0"}}>
                    <div style={{...HeaderMenuSubText}}>{"Current Repository:"}</div>
                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{basePath}</div>
                </HeaderButton>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.refresh}>
                    Fetch and Refresh
                </Button>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={props.handleModeSwitch}>
                    Switch Diff Render (Development Only, to change to dropdown)
                </Button>
            </ButtonGroup>
            <Button style={{...HeaderItem, borderWidth: "0 0 0 1px"}} onClick={handleReturn}>
                Choose new Repo (For development)
            </Button>
        </div>
    )
}