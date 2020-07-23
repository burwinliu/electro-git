import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import watch from 'node-watch'

import {Header} from "../header"
import {Sidebar} from '../sidebar'
import {Body} from '../mainbody'

// Toasts (Popup messages)
import{
    ErrorToast
} from '../toasts'

//Styles
import {MainWrapper, MainContent} from './MainStyle'

//REDUX store
import {
    stageSetStatusObj,
    stageSetDiffObj,
    stageReset,
} from '../../store/ducks'

//Service helpers
import {
    helperGitOpen, helperGitStatus, helperGitDiff,
    renderGitDiffInfo
} from "../../services"

import * as path from 'path';

export const MainPage = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch()

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    const [diffMode, setDiffMode] = useState(true)
    
    //ROUTER HOOKS
    const history = useHistory();

    if(dirPath === ""){
        history.push('/')
    }

    useEffect(()=>{
        console.log("INIT MAIN:")
        const init = async () => {
            const gitObject = helperGitOpen(dirPath)
            const statusObj = await helperGitStatus(gitObject)
            
            const statusDiff = await helperGitDiff(gitObject)
            const rendDiff = renderGitDiffInfo(statusDiff)
                        
            let storeStatus = {}
            let storeDiff = {}

            for (let index in statusObj){
                storeStatus[statusObj[index].path] = statusObj[index]
            }

            for (let index in rendDiff){
                storeDiff[index] = rendDiff[index]
            }

            dispatch(stageReset());
            dispatch(stageSetStatusObj(storeStatus))
            dispatch(stageSetDiffObj(storeDiff))
        }

        init();
        try{
            watch(dirPath, { recursive: true, delay: 300 }, async (evt, name) => {
                const splitPath = name.split(path.sep)
                for (const i in splitPath){
                    if(splitPath[i] === '.git') return
                }
                console.log(splitPath)
                //TODO make sure any git folder or gitignored folder is ignored
                console.log(name, "TRYING ")
                if(evt === "update"){
                    console.log("USING UPDATE", evt, name)
                    await init();
                }
                else if(evt == "remove"){
                    console.log("USING REMOVE", evt, name)
                    await init();
                }
                
            });
        }
        catch(err){
            console.log("FAILED DUE TO ", err);

            setErrMsg(err)
            setErrOpen(true)
            return
        }
        return () => {
            dispatch(stageReset());
        }
    }, [dirPath, dispatch])

    const handleErrClose = () => {
        setErrOpen(false)
    }
    const handleRefresh = () => {
        const gitObject = helperGitOpen(dirPath)
        dispatch(stageReset());

        helperGitStatus(gitObject).then((statusObj) =>{
            let storeStatus = {}
            for (let index in statusObj){
                storeStatus[statusObj[index].path] = statusObj[index]
            }
            dispatch(stageSetStatusObj(storeStatus))
        })
        
        helperGitDiff(gitObject).then((statusDiff)=>{
            const rendDiff = renderGitDiffInfo(statusDiff)
            let storeDiff = {}
            for (let index in rendDiff){
                storeDiff[index] = rendDiff[index]
            }
            dispatch(stageSetDiffObj(storeDiff))
        })
    }
    const handleModeSwitch = () => {
        console.log("TESTING")
        setDiffMode(!diffMode)
    }
    console.log("RERENDERED")

    return (
        <div style={MainWrapper}>
            <Header refresh={handleRefresh} handleModeSwitch={handleModeSwitch}/>
            <div style={MainContent}>
                <Sidebar refresh={handleRefresh}/>
                <Body mode={diffMode}/>
                <ErrorToast
                    open={errOpen}
                    handleClose={handleErrClose}
                    message={errMsg}
                />
            </div>
        </div>
    )
}
