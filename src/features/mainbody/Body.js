import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import {
    BodyWrap, 
    BodyHeaderWrap, BodyHeaderItem
} from './BodyStyle'

import {
    helperGitOpen,
    helperGitAdd
} from "../../services"

import { 
    GitDiffSideBySide, 
    GitDiffCompressed,
     GitDiffUntracked
} from './Table';

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
        const gitObject = helperGitOpen(dir)
        await helperGitAdd(gitObject, [file]);
        await props.refresh()
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            setFiles(fileDiff[file].fileA, fileDiff[file].fileB)
        }
    }

    

    const renderHeader = () => {
        if(!fileTracked){
            return(
                <div style={BodyHeaderWrap}> 
                    <div style={{...BodyHeaderItem, borderWidth: "0"}}>
                        File {file} is not being tracked
                    </div>
                </div>
            )
        }
        if (props.mode){
            return(
                <div style={BodyHeaderWrap}>
                    <div style={{...BodyHeaderItem, width: "50%", borderWidth: "0 1px 0 0"}}>
                        {fileA} (Past File)
                    </div>
                    <div style={{...BodyHeaderItem, width: "50%", borderWidth: "0"}}>
                        {fileB} (Current File)
                    </div>
                </div>
            )
        }
        return (
            <div>{fileA}, {fileB} (WITH SIDE BY SIDE)</div>
        )
    }

    const renderContent = () => {
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            const chunks = fileDiff[file].chunks
            if(props.mode){
                return(
                    <GitDiffSideBySide chunks={chunks} fileA={fileA} fileB={fileB}/>
                )
            }
            else{
                return (
                    <GitDiffCompressed chunks={chunks} fileA={fileA} fileB={fileB}/>
                )
            }
            
        }
        else{
            return (
                <GitDiffUntracked handle={trackCurrentFile}/>
            )
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
        <div style={BodyWrap}>
            {renderContent()}
        </div>
    )
}