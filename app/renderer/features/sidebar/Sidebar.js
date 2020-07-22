import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    Button, 
    Menu, MenuItem,
    List, ListItem, ListItemText, ListSubheader, ListItemIcon, ListItemSecondaryAction,
    Checkbox
} from '@material-ui/core';

import {
    appstoreSetCurrentDiff,
} from '../../store/ducks'

//styles
import {
    SidebarWrap, SidebarStyle, 
    SidebarMenuHeader, 
    SidebarMenuSubText, SidebarMenuMainText, SidebarMenuItems, SidebarMenuIcons, SidebarCheckbox, SidebarText
} from './SidebarStyle'


export const Sidebar = (props) => {
    const fileStatus = useSelector(state => state.stage.status);

    const dispatch = useDispatch()

    const [checkRecord, setChecked] = useState({});

    useEffect(() => {
        let temp = {}
        for ( let i in fileStatus) {
            temp[i] = true
        }

        setChecked(temp)
    }, [])

    const handleClick = (id) => {
        dispatch(appstoreSetCurrentDiff(id))
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


    

    let toRender = {}
    
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
                    return (
                        <ListItem key={value} button onClick={() => handleClick(value)} style={SidebarMenuItems}>
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
                            
                        </ListItem>
                    );
                })}
            </List>
        </div>
    )
}