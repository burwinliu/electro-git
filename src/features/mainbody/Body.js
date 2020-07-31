import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

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
    HISTORY_CONTROL
} from "../main"


export const Body = (props) => {
    const file = useSelector(state => state.appstore.currentDiff);
    const dir = useSelector(state => state.repo.path)
    const fileDiff = useSelector(state => state.stage.diff);
    const fileStatus = useSelector(state => state.stage.status);

    const [fileA, setFileA] = useState("")
    const [fileB, setFileB] = useState("")
    const [fileTracked, setFileTracked] = useState(true)

    

    const setFiles = (a, b) => {
        setFileA(a)
        setFileB(b)
    }

    const trackCurrentFile = async () => {
        await helperGitAdd(dir, [file]);
        await props.refresh()
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            setFiles(fileDiff[file].fileA, fileDiff[file].fileB)
        }
    }

    const renderDiff = () => {
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            const chunks = fileDiff[file].chunks
            if(props.diffControl === DIFF_CONTROL.MAIN_SIDE_BY_SIDE_VIEW){
                return(
                    <GitDiffSideBySide chunks={chunks} fileA={fileA} fileB={fileB}/>
                )
            }
            else if(props.diffControl === DIFF_CONTROL.MAIN_COMPRESSED_VIEW){
                return (
                    <GitDiffCompressed chunks={chunks} fileA={fileA} fileB={fileB}/>
                )
            }
            
        }
        else if(fileStatus !== undefined && fileStatus[file]){
            return (
                <GitDiffUntracked handle={trackCurrentFile}/>
            )
        }
        else{
            console.log("RESET ITEMS")
            return(
                <GitDiffUndefined/>
            )
        }
    }

    const renderHistory = () => {
        return(
            <div>
                HISTORY HERE
            </div>
        )
    }

    const renderContent = () => {
        if(props.contentControl === CONTENT_CONTROL.MAIN_DIFF_VIEW){
            return renderDiff();
        }
        else if (props.contentControl === CONTENT_CONTROL.MAIN_HISTORY_VIEW){
            return renderHistory();
        } 
    }

    useEffect(() => {
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            setFiles(fileDiff[file].fileA, fileDiff[file].fileB)
            setFileTracked(true)
        }
        else{
            setFiles("UNTRACKED", "UNTRACKED")
            setFileTracked(false)
        }
    }, [fileDiff, file])
    

    return (
        <div style={BodyAreaWrap}>
            {renderContent()}
        </div>
    )
}