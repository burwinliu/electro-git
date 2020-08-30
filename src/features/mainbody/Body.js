import React, {useState, useEffect} from 'react';
import { useSelector, useDispatch } from "react-redux";

import {
    BodyAreaWrap, 
} from './BodyStyle'

import {
    helperGitOpen,
    helperGitAdd
} from "../../services"

import { 
    GitDiffSideBySide, 
    GitDiffCompressed,
    GitDiffUntracked,
    GitDiffUndefined,
    GitDiffNoChange
} from './Table';

import {
    CONTENT_CONTROL,
    DIFF_CONTROL,
    HISTORY_CONTROL,
    displayStateSetHistRepoFile
} from "../../store/ducks"

import {
    SidebarDiffRender,
    BodyHeaderHistoryFile,
    BodyHeaderHistoryRepo,
    BodyHeaderHistoryRepoUndefined
} from './Component'
import { gitRefresh } from '../../store/thunks/gitThunks';


export const Body = (props) => {
    const currDiffPath = useSelector(state => state.displayState.currentDiff);
    const dir = useSelector(state => state.git.path)

    const fileDiff = useSelector(state => state.git.diff);
    const fileStatus = useSelector(state => state.git.status);

    const contentControl = useSelector(state => state.control.contentControl)

    const diffControl = useSelector(state => state.control.diffControl)
    const histControl = useSelector(state => state.control.histControl)

    const currHistFile = useSelector(state => state.displayState.currentHistFile)
    const currRepoHistFile = useSelector(state=> state.displayState.currentHistRepoFile)

    const repoHistDiff = useSelector(state => state.git.repoHistDiff)
    const repoHistStatus = useSelector(state => state.git.repoHistStatus)
    
    const fileHistDiff = useSelector(state => state.git.fileHistDiff)

    const logLine = useSelector(state=>state.displayState.currentLogLine)
    

    const dispatch = useDispatch()


    const trackCurrentFile = async () => {
        await helperGitAdd(dir, [currDiffPath]);
        await dispatch(gitRefresh())
    }

    const renderDiff = () => {
        if (fileDiff !== undefined && fileDiff[currDiffPath] !== undefined){
            const chunks = fileDiff[currDiffPath].chunks
            if(diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
                return(
                    <GitDiffSideBySide chunks={chunks} fileA={fileDiff[currDiffPath].fileA} fileB={fileDiff[currDiffPath].fileB}/>
                )
            }
            else if(diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
                return (
                    <GitDiffCompressed chunks={chunks} fileA={fileDiff[currDiffPath].fileA} fileB={fileDiff[currDiffPath].fileB}/>
                )
            }
            
        }
        else if(fileStatus !== undefined && fileStatus[currDiffPath]){
            if (fileStatus[currDiffPath].index === '?' || fileStatus[currDiffPath].working_dir === '?')
                return (
                    <GitDiffUntracked handle={trackCurrentFile}/>
                )
            else
                return (
                    <GitDiffNoChange/>
                )
        }
        else{
            return(
                <GitDiffUndefined/>
            )
        }
        return null
    }

    const renderHistory = () => {
        
        const selectRepo = (id) => {
            dispatch(displayStateSetHistRepoFile(id))
        }
        if(histControl === HISTORY_CONTROL.MAIN_FILE_VIEW){
            let body, header;

            if ( !logLine || Object.keys(logLine).length === 0 ){
                header = <BodyHeaderHistoryRepoUndefined/>
            }
            else{
                header = <BodyHeaderHistoryFile/>
            }

            if (fileHistDiff === undefined|| fileHistDiff[currHistFile] === undefined){
                body =  <GitDiffUndefined/>
            }
            else{
                const chunks = fileHistDiff[currHistFile].chunks
                const fileA = currHistFile
                const fileB = currHistFile
                
                if(diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
                    body=<GitDiffSideBySide chunks={chunks||{}} fileA={fileA} fileB={fileB}/>
                }
                else if(diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
                    body =<GitDiffCompressed chunks={chunks||{}} fileA={fileA} fileB={fileB}/>
                }
            }

            return(
                <div style={{flexDirection: "column", overflowY: "auto", flexGrow: "1"}}>
                    {header}
                    {body}
                </div>
            )
        }
        if(histControl === HISTORY_CONTROL.MAIN_OVERVIEW_VIEW){
            let body, header;

            if ( !logLine || Object.keys(logLine).length === 0 ){
                header = <BodyHeaderHistoryRepoUndefined/>
            }
            else{
                header= <BodyHeaderHistoryRepo/>
            }

            if (repoHistDiff === undefined|| repoHistDiff[currRepoHistFile] === undefined){
                body = <GitDiffUndefined/>
            }
            else{
                const chunks = repoHistDiff[currRepoHistFile].chunks
                const fileA = currRepoHistFile
                const fileB = currRepoHistFile
                if(diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
                    body = <GitDiffSideBySide chunks={chunks||{}} fileA={fileA} fileB={fileB}/>
                }
                else if(diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
                    body = <GitDiffCompressed chunks={chunks||{}} fileA={fileA} fileB={fileB}/>
                }
            }
            return (
                <div style={{flexDirection: "column", flexGrow: "1"}}>
                    {header}
                    <div style={{flexDirection: "row", overflowY: "auto", flexGrow: "1"}}>
                        <SidebarDiffRender statusObj={repoHistStatus||{}} onSelect={selectRepo}/>
                        {body}
                    </div>
                </div>
            )
        }
        return null
    }

    const renderContent = () => {
        if(contentControl === CONTENT_CONTROL.MAIN_DIFF_VIEW){
            return renderDiff();
        }
        else if (contentControl === CONTENT_CONTROL.MAIN_HISTORY_VIEW){
            return renderHistory();
        } 
    }

    return (
        <div style={BodyAreaWrap}>
            {renderContent()}
        </div>
    )
}