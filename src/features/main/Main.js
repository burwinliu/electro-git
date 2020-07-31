import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import watch from 'node-watch'

import {Header} from "../header"
import {Sidebar} from '../sidebar'
import {Body} from '../mainbody'


//Styles
import {MainWrapper, MainContent} from './MainStyle'

//REDUX store
import {
    stageSetStatusObj,
    stageSetDiffObj,
    stageReset,
    repoReset,
    appstoreReset,
    keyReset,
    stageSetRepoLog,
    stageSetFileLog
} from '../../store/ducks'

//Service helpers
import {
    helperGitOpen, helperGitStatus, helperGitDiff,
    renderGitDiffInfo,
    generateSshGit,
    helperGitLog,
    helperGitDir,
    helperGitCheckIgnore,
    helperGitLogFile
} from "../../services"

import * as path from 'path';

import {
    CONTENT_CONTROL,
    DIFF_CONTROL,
    HISTORY_CONTROL
} from "./MainHelper"


export const MainPage = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const diffFile = useSelector( state=> state.appstore.currentHistFile)
    const dispatch = useDispatch()

    // Control what to be shown in content -- difference or history
    const [contentControl, setContentControl] = useState(CONTENT_CONTROL.MAIN_DIFF_VIEW) 

    // Controls how the history should be viewed
    const [historyControl, setHistoryControl] = useState(HISTORY_CONTROL.MAIN_OVERVIEW_VIEW)
    //Controls how the diff should be viewed
    const [diffControl, setDiffControl] = useState(DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW)

    const [loaded, setLoaded] = useState(true)
    const [error, setError] = useState(false)
    
    //ROUTER HOOKS
    const history = useHistory();

    useEffect(()=>{
        if(error) return;
        handleRefresh().then((isErr)=>{
            if(!dirPath || dirPath === undefined || isErr) {
                setError(true)
                return
            };
            try{
                watch(dirPath, { recursive: true, delay: 300 }, async (evt, name) => {
                    if(loaded){
                        const splitPath = name.split(path.sep)
                        const gitDir = await helperGitDir(dirPath)
                        for (const i in splitPath){
                            if(splitPath[i] === gitDir) return
                        }
                        if(await (helperGitCheckIgnore(dirPath, name)))
                            return;
                        
                        //TODO make sure any git folder or gitignored folder is ignored
                        console.log(name)
                        if(evt === "update"){
                            await handleRefresh();
                        }
                        else if(evt == "remove"){
                            await handleRefresh();
                        }
                    }
                })
            }
            catch(err){
                console.log(err, "AT WATCH")
            }
        })
        
            
        return () => {
            dispatch(stageReset());
            dispatch(appstoreReset()) 
            setLoaded(false)
        }
    }, [dirPath])

    const handleErrorCheck = async () => {
        try{
            const isRepo = await helperGitOpen(dirPath).checkIsRepo('root')
            if (isRepo){
                console.log(isRepo, "IS REPO", dirPath)
                return false
            }
        }
        catch(err){
            
            handleErr(true)
            setLoaded(false)
            console.log(err, error)
            return true
        }
        
    }

    const handleRefresh = async () => {
        console.log(error)
        if(error) return;
        console.log("REFRESH")
        if(await handleErrorCheck()) return;
        
        dispatch(stageReset());
        

        helperGitStatus(dirPath).then((statusObj) =>{
            if(loaded){
                let storeStatus = {}
                for (let index in statusObj){
                    storeStatus[statusObj[index].path] = statusObj[index]
                }
                dispatch(stageSetStatusObj(storeStatus))
            }
        })
        
        helperGitDiff(dirPath).then((statusDiff)=>{
            if(loaded){
                const rendDiff = renderGitDiffInfo(statusDiff)
                let storeDiff = {}
                for (let index in rendDiff){
                    storeDiff[index] = rendDiff[index]
                }
                dispatch(stageSetDiffObj(storeDiff))
            }
        })

        helperGitLog(dirPath).then((log)=>{
            if(loaded){
                dispatch(stageSetRepoLog(log.all))
            }
        })

        helperGitLogFile(dirPath, diffFile).then((log)=>{
            if(loaded){
                dispatch(stageSetFileLog(log.all))
            }
        })
    }

    const handleErr = (state) => {
        setError(state)
    }

    const handleContentControl = (input) => {
        setContentControl(input)
    }

    const handleHistoryControl = (input) => {
        setHistoryControl(input)
    }
    
    const handleDiffSwitch = () => {
        if(diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
            setDiffControl(DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW)
        }
        if(diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
            setDiffControl(DIFF_CONTROL.MAIN_COMPRESSED_VIEW)
        }
    }


    return (
        <div style={MainWrapper}>
            <Header refresh={handleRefresh} handleDiffSwitch={handleDiffSwitch}/>
            {
                error?
                <div> CANNOT FIND {dirPath} </div>
                :
                <div style={MainContent}>
                    <Sidebar 
                        refresh={handleRefresh}
                        
                        contentControl={contentControl}
                        historyControl={historyControl}
                        diffControl={diffControl}

                        handleContentControl={handleContentControl}
                        handleHistoryControl={handleHistoryControl}
                    />
                    <Body 
                        refresh={handleRefresh} 
                        
                        contentControl={contentControl}
                        historyControl={historyControl}
                        diffControl={diffControl}
                    />
                </div>
                
            }
        </div>
    )
}
