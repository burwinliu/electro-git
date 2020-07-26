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
    keyReset
} from '../../store/ducks'

//Service helpers
import {
    helperGitOpen, helperGitStatus, helperGitDiff,
    renderGitDiffInfo,
    generateSshGit,
} from "../../services"

import * as path from 'path';

export const MainPage = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const dispatch = useDispatch()

    const [diffMode, setDiffMode] = useState(true)

    const [loaded, setLoaded] = useState(true)
    
    //ROUTER HOOKS
    const history = useHistory();

    useEffect(()=>{
        if(dirPath === "" || dirPath===undefined){
            history.push('/')
        }
        
        const init = async () => {
            if(loaded){
                const gitObject = helperGitOpen(dirPath)

                const statusObj = await helperGitStatus(gitObject)
                const diffObj = await helperGitDiff(gitObject)
                const rendDiff = renderGitDiffInfo(diffObj)
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
        }

        init();
        try{
            const gitObject = helperGitOpen(dirPath)
            console.log(dirPath)
            gitObject.checkIsRepo().then((isRepo) => {
                console.log(isRepo)
                if (isRepo && dirPath !== "" && loaded){
                    console.log("WILL WATCH", dirPath)
                    watch(dirPath, { recursive: true, delay: 300 }, async (evt, name) => {
                        const splitPath = name.split(path.sep)
                        for (const i in splitPath){
                            if(splitPath[i] === '.git') return
                        }
                        //TODO make sure any git folder or gitignored folder is ignored
                        if(evt === "update"){
                            await init();
                        }
                        else if(evt == "remove"){
                            await init();
                        }
                        
                    });
                }
            })
            
        }
        catch(err){
            console.log("FAILED DUE TO ", err);
            dispatch(repoReset())
            history.push('/')
            return
        }
        return () => {
            dispatch(stageReset());
            dispatch(appstoreReset()) 
            setLoaded(false)
        }
    }, [dirPath, dispatch])

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
        setDiffMode(!diffMode)
    }

    return (
        <div style={MainWrapper}>
            <Header refresh={handleRefresh} handleModeSwitch={handleModeSwitch}/>
            <div style={MainContent}>
                <Sidebar refresh={handleRefresh}/>
                <Body refresh={handleRefresh} mode={diffMode}/>
            </div>
        </div>
    )
}
