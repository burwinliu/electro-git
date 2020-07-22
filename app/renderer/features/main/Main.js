import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";

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

export const MainPage = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch()

    const [errMsg, setErrMsg] = useState("FAILED")
    const [errOpen, setErrOpen] = useState(false)

    useEffect(()=>{
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

            console.log(rendDiff, statusObj)
        }

        init();
        try{
            let watcher = watch(dirPath, { recursive: true, delay: 300 }, (evt, name) => {
                if(evt === "update"){
                    console.log('changed.', evt, "FILENAME",  name);
                }
                else{
                    console.log('changed.', evt, "FILENAME",  name);
                }
                
            });
            return () => {
                watcher.close()
            }
        }
        catch(err){
            console.log("FAILED DUE TO ", err);

            setErrMsg(err)
            setErrOpen(true)
            return
        }
    })

    const handleErrClose = () => {
        setErrOpen(false)
    }
    
    return (
        <div style={MainWrapper}>
            <Header/>
            <div style={MainContent}>
                <Sidebar/>
                <Body/>
                <ErrorToast
                    open={errOpen}
                    handleClose={handleErrClose}
                    message={errMsg}
                />
            </div>
        </div>
    )
}
