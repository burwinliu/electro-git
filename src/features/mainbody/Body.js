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
    GitDiffUndefined
} from './Table';

import {
    CONTENT_CONTROL,
    DIFF_CONTROL,
    HISTORY_CONTROL,
    appstoreSetHistRepoFile
} from "../../store/ducks"

import {
    SidebarDiffRender,
    BodyHeaderHistoryFile,
    BodyHeaderHistoryRepo,
    BodyHeaderHistoryRepoUndefined
} from './Component'


export const Body = (props) => {
    const currDiffPath = useSelector(state => state.appstore.currentDiff);
    const dir = useSelector(state => state.repo.path)

    const fileDiff = useSelector(state => state.stage.diff);
    const fileStatus = useSelector(state => state.stage.status);

    const contentControl = useSelector(state => state.appstore.contentControl)

    const diffControl = useSelector(state => state.appstore.diffControl)
    const histControl = useSelector(state => state.appstore.histControl)

    const currHistFile = useSelector(state => state.appstore.currentHistFile)
    const currRepoHistFile = useSelector(state=> state.appstore.currentHistRepoFile)

    const repoHistDiff = useSelector(state => state.stage.repoHistDiff)
    const repoHistStatus = useSelector(state => state.stage.repoHistStatus)
    
    const fileHistDiff = useSelector(state => state.stage.fileHistDiff)

    const logLine = useSelector(state=>state.appstore.currentLogLine)
    

    const dispatch = useDispatch()


    const trackCurrentFile = async () => {
        await helperGitAdd(dir, [currDiffPath]);
        await props.refresh()
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
            return (
                <GitDiffUntracked handle={trackCurrentFile}/>
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
            dispatch(appstoreSetHistRepoFile(id))
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