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
    gitReset,
    displayStateAddRepoRecord,
    displayStateRemoveRepoRecord,
    gitSetPath,
    displayStateSetLogLine,
} from '../../store/ducks'

import { gitRefresh } from '../../store/thunks/gitThunks';


export const MainPage = (props) => {
    const dirPath = useSelector(state => state.git.path);
    const record = useSelector(state=> state.displayState.repoRecord)
    const dispatch = useDispatch()
    const [error, setError] = useState(false)
    
    //ROUTER HOOKS
    const history = useHistory();
    

    useEffect(()=>{
        if(error) return;
        dispatch(gitRefresh())
        if(!dirPath || dirPath === undefined ) { 
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
        dispatch(displayStateAddRepoRecord(dirPath))
        return () => {
            dispatch(gitReset());
            dispatch(displayStateSetLogLine({}))
        }
    }, [dirPath])

    const handleRemoveRepo = () => {
        dispatch(displayStateRemoveRepoRecord(dirPath))
        if(record.length === 0){
            dispatch(gitSetPath(""))
            history.push("/")
        }
        dispatch(gitSetPath(record[0]))
        history.push("/")
        dispatch(gitRefresh())
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
                    <Sidebar/>
                    <Body 
                    />
                </div>
            )
        }
    }

    return (
        <div style={MainWrapper}>
            <Header/>
            <RenderContent/>
        </div>
    )
}
