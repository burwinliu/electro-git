import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import chokidar from 'chokidar'

import {Header} from "../header"
import {Sidebar} from '../sidebar'
import {Body} from '../mainbody'
import {Button} from "@material-ui/core"


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
    appstoreAddRepoRecord,
    appstoreRemoveRepoRecord,
    repoSetPath,
    appstoreSetLogLine,
    stageSetStatusSummary
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
    const dirPath = useSelector(state => state.repo.path);
    const diffFile = useSelector( state=> state.appstore.currentHistFile)
    const record = useSelector(state=> state.appstore.repoRecord)
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
        dispatch(appstoreAddRepoRecord(dirPath))
        return () => {
            dispatch(stageReset());
            dispatch(appstoreSetLogLine({}))
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
        dispatch(appstoreRemoveRepoRecord(dirPath))
        if(record.length === 0){
            dispatch(repoSetPath(""))
            history.push("/")
        }
        dispatch(repoSetPath(record[0]))
        history.push("/")
        handleRefresh()
    }

    const handleRefresh = async () => {
        if(error) return;
        if(await handleErrorCheck()) return;
        dispatch(stageReset());

        const branchList = await helperGitBranchList(dirPath)


        dispatch(stageSetBranchList(branchList.branches || {}))
        dispatch(appstoreSetBranch(branchList.current))

        helperGitStatus(dirPath).then((statusSummary) =>{
            let storeStatus = {}
            const statusObj = statusSummary.files
            for (let index in statusObj){
                storeStatus[statusObj[index].path.replace(/"/g, "")] = statusObj[index]
            }
            dispatch(stageSetStatusObj(storeStatus))
            dispatch(stageSetStatusSummary(statusSummary))
        })
        
        helperGitDiff(dirPath).then((statusDiff)=>{
            const rendDiff = renderGitDiffInfo(statusDiff)
            let storeDiff = {}
            for (let index in rendDiff){
                storeDiff[index.replace(/"/g, "")] = rendDiff[index]
            }
            dispatch(stageSetDiffObj(storeDiff))
        })

        if(Object.keys(branchList.branches).length === 0){
            dispatch(appstoreSetBranch("Master"))
            return
        }

        helperGitLog(dirPath).then((log)=>{
            if(loaded){
                dispatch(stageSetRepoLog(log.all))
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
                <div> 
                    CANNOT FIND {dirPath}. Would you like to remove?

                    <Button onClick={handleRemoveRepo}>Remove</Button>
                </div>
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
