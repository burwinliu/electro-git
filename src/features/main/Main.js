import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import chokidar from 'chokidar'

import {Header} from "../header"
import {Sidebar} from '../sidebar'
import {Body} from '../mainbody'
import {Button} from "@material-ui/core"


//Styles
import {MainWrapper, MainContent, MainCenter} from './MainStyle'

//REDUX store
import {
    gitSetStatusObj,
    gitSetDiffObj,
    gitReset,
    gitSetRepoLog,
    gitSetFileLog,
    controlSetDiffControl,
    gitSetBranchList,
    displayStateSetBranch,
    displayStateAddRepoRecord,
    displayStateRemoveRepoRecord,
    gitSetPath,
    displayStateSetLogLine,
    gitSetStatusSummary
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
import { ButtonGroup } from '@material-ui/core';


export const MainPage = (props) => {
    const dirPath = useSelector(state => state.git.path);
    const diffFile = useSelector( state=> state.displayState.currentHistFile)
    const record = useSelector(state=> state.displayState.repoRecord)
    const dispatch = useDispatch()

    const [loaded, setLoaded] = useState(true)
    const [error, setError] = useState(false)
    
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
                helperGitOpen(dirPath)
            }
            catch(err) {
                setError(true)
                return
            }
            // helperGitDir(dirPath).then((gitDir) => {
            //     // DOESNT WORK FOR SOME REASON? INVESTIGATE
            //     const watcher = chokidar.watch(dirPath, {
            //         usePolling: true,
            //         persistent: true,
            //         ignoreInitial: true,
            //         ignored: "**/" + gitDir + "/**"
            //     })
            //     console.log(watcher)
            //     watcher.on('all', (evt, name) => {
            //         helperGitCheckIgnore(dirPath, name).then( (ignored) => {
            //             if(ignored)
            //                 return
            //             handleRefresh();
            //         })
            //     })
            // })
        })
        dispatch(displayStateAddRepoRecord(dirPath))
        return () => {
            dispatch(gitReset());
            dispatch(displayStateSetLogLine({}))
            setLoaded(false)
        }
    }, [dirPath])

    const handleErrorCheck = async () => {
        try{
            const repoCheck = await helperGitOpen(dirPath)
            const isRepo = repoCheck.checkIsRepo('root')
            if (isRepo){
                return false
            }
            return false
        }
        catch(err){
            console.log(err.message)
            handleErr(true)
            setLoaded(false)
            return true
        }
        
    }

    const handleRemoveRepo = () => {
        dispatch(displayStateRemoveRepoRecord(dirPath))
        if(record.length === 0){
            dispatch(gitSetPath(""))
            history.push("/")
        }
        dispatch(gitSetPath(record[0]))
        history.push("/")
        handleRefresh()
    }

    const handleRefresh = async () => {
        if(error) return;
        if(await handleErrorCheck()) return;
        dispatch(gitReset());

        const branchList = await helperGitBranchList(dirPath)


        dispatch(gitSetBranchList(branchList.branches || {}))
        dispatch(displayStateSetBranch(branchList.current))

        helperGitStatus(dirPath).then((statusSummary) =>{
            let storeStatus = {}
            const statusObj = statusSummary.files
            for (let index in statusObj){
                storeStatus[statusObj[index].path.replace(/"/g, "")] = statusObj[index]
            }
            dispatch(gitSetStatusObj(storeStatus))
            dispatch(gitSetStatusSummary(statusSummary))
        })
        
        helperGitDiff(dirPath).then((statusDiff)=>{
            const rendDiff = renderGitDiffInfo(statusDiff)
            let storeDiff = {}
            for (let index in rendDiff){
                storeDiff[index.replace(/"/g, "")] = rendDiff[index]
            }
            dispatch(gitSetDiffObj(storeDiff))
        })

        if(Object.keys(branchList.branches).length === 0){
            dispatch(displayStateSetBranch("Master"))
            return
        }

        helperGitLog(dirPath).then((log)=>{
            if(loaded){
                dispatch(gitSetRepoLog(log.all))
            }
        })

        if(diffFile === "") return

        helperGitLogFile(dirPath, diffFile).then((log)=>{
            if(loaded){
                dispatch(gitSetFileLog(log.all))
            }
        })
    }

    const handleErr = (state) => {
        setError(state)
    }

    const RenderContent = () => {
        if(!dirPath || dirPath === "" ){
            return (
                <div style={MainCenter}> 
                    <h1>No Repo Selected</h1>
                </div>
            )
        }
        if(error) {
            return (
                <div style={MainCenter}> 
                    <h1>CANNOT FIND {dirPath}. Would you like to remove?</h1>

                    <Button onClick={handleRemoveRepo}>Remove</Button>
                </div>
            )
        }
        else{
            return (
                <div style={MainContent}>
                    <Sidebar 
                        refresh={handleRefresh}
                    />
                    <Body 
                        refresh={handleRefresh} 
                    />
                </div>
            )
        }
    }

    return (
        <div style={MainWrapper}>
            <Header refresh={handleRefresh}/>
            <RenderContent/>
        </div>
    )
}
