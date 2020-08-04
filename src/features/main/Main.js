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
    stageSetRepoLog,
    stageSetFileLog,
    appstoreSetDiffControl,
    stageSetBranchList,
    appstoreSetBranch,
    appstoreAddRepoRecord
} from '../../store/ducks'

//Service helpers
import {
    helperGitOpen, helperGitStatus, helperGitDiff,
    renderGitDiffInfo,
    generateSshGit,
    helperGitLog,
    helperGitDir,
    helperGitCheckIgnore,
    helperGitLogFile,
    helperGitBranchList
} from "../../services"

import * as path from 'path';

import {
    CONTENT_CONTROL,
    DIFF_CONTROL,
    HISTORY_CONTROL
} from "../../store/ducks"


export const MainPage = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const diffFile = useSelector( state=> state.appstore.currentHistFile)
    const dispatch = useDispatch()

    const [loaded, setLoaded] = useState(true)
    const [error, setError] = useState(false)

    const [toWatch, setToWatch] = useState(false)
    
    //ROUTER HOOKS
    const history = useHistory();

    useEffect(()=>{
        if(error) return;
        handleRefresh().then((isErr)=>{
            if(!dirPath || dirPath === undefined || isErr ) {
                setError(true)
                return
            };
            try{
                watch(dirPath, { recursive: true, delay: 300 }, async (evt, name) => {
                    if(loaded && toWatch){
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
        
        setToWatch(true)
        dispatch(appstoreAddRepoRecord(dirPath))
        return () => {
            dispatch(stageReset());
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

        helperGitBranchList(dirPath).then((branchList) => {
            if(loaded){
                dispatch(stageSetBranchList(branchList.branches))
                dispatch(appstoreSetBranch(branchList.current))
            }            
        })

        if(diffFile === "") return

        helperGitLogFile(dirPath, diffFile).then((log)=>{
            if(loaded){
                dispatch(stageSetFileLog(log.all))
            }
        })
    }

    const handleErr = (state) => {
        setError(state)
    }

    return (
        <div style={MainWrapper}>
            <Header refresh={handleRefresh}/>
            {
                error?
                <div> CANNOT FIND {dirPath} </div>
                :
                <div style={MainContent}>
                    <Sidebar 
                        refresh={handleRefresh}
                    />
                    <Body 
                        refresh={handleRefresh} 
                    />
                </div>
                
            }
        </div>
    )
}
