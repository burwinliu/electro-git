import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import {
    BodyWrap, 
    BodyHeaderWrap, BodyHeaderItem, 
    BodyContent, 
    BodyUntracked, BodyUntrackedButton,
    BodyContentTable, BodyContentTableHeader, BodyContentRowHeader, BodyContentTableAnimate, 
} from './BodyStyle'

import {Button, makeStyles} from "@material-ui/core"
import {colors} from "../../styles/palette"

import {
    renderGitChunkTwoFileFormat, 
    helperGitOpen,
    helperGitAdd
} from "../../services"

export const Body = (props) => {
    const file = useSelector(state => state.appstore.currentDiff);
    const dir = useSelector(state => state.repo.path)
    const fileDiff = useSelector(state => state.stage.diff);
    const fileStatus = useSelector(state => state.stage.status);

    const [fileA, setFileA] = useState("")
    const [fileB, setFileB] = useState("")
    const [fileTracked, setFileTracked] = useState(true)

    const styleAnimate = makeStyles(BodyContentTableAnimate)()

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

    const renderFunctionHeaderRow = (functionStr) => {
        if(functionStr === ""){
            return 
        }
        return (
            <tr>
                <td colSpan={4} style={BodyContentTableHeader}>
                    {"These lines were found in this function: '" + functionStr + "'"}
                </td>
            </tr>
        )
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
            let key = 0;

            return (
                <div name="BodyContent" style={BodyWrap}>
                    {Object.keys(chunks).map(index =>{
                        const currentChunk = chunks[index]
                        
                        let fromLine = currentChunk.header.fromLine
                        let toLine = currentChunk.header.toLine
                        let loaded = renderGitChunkTwoFileFormat(currentChunk);

                        return(
                            <div key={index} style={BodyContent}>
                                
                                <table style={BodyContentTable}> 
                                    <colgroup>
                                        <col width="5%"/>
                                        <col width="45%"/>
                                        <col width="5%"/>
                                        <col width="45%"/>
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2} style={BodyContentTableHeader}>
                                                File in repo changed on line {fromLine} for {chunks[index].header.fromLineLength} lines.
                                            </td>
                                            <td colSpan={2} style={BodyContentTableHeader}>
                                                File in Disk is now recorded on line {toLine} for {chunks[index].header.toLineLength} lines.
                                            </td>
                                        </tr>
                                        {renderFunctionHeaderRow(currentChunk.header.functionContext)}
                                        {
                                            Object.keys(loaded).map(textIndex => {
                                                const currentLine = loaded[textIndex]

                                                let colorA = "white"
                                                let colorB = "white"
                                                let classA = "white"
                                                let classB = "white"

                                                if (currentLine.aSign === "-"){
                                                    colorA = colors.redLight
                                                    classA = "red"
                                                }
                                                if (currentLine.bSign === "+"){
                                                    colorB = colors.greenLight
                                                    classB = "green"
                                                }

                                                if (currentLine.aSign === ""){
                                                    colorA = colors.greyLight
                                                    classA = "grey"
                                                }
                                                if (currentLine.bSign === ""){
                                                    colorB = colors.greyLight
                                                    classB = "grey"
                                                }
                                                
                                                return(
                                                    <tr key={textIndex} className={styleAnimate.tableRow}>
                                                        <td className={classA} style={{backgroundColor: colorA}}><div style={{...BodyContentRowHeader,}}>
                                                            <div>{currentLine.aSign}</div>
                                                            <div>{currentLine.aNumber}</div>
                                                        </div></td>
                                                        <td className={classA} style={{backgroundColor: colorA, borderRight: "solid " + colors.outline + " 1px",}}>
                                                            <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code>{currentLine.aText}</code></pre>
                                                        </td>
                                                        <td className={classB} style={{backgroundColor: colorB}}><div style={{...BodyContentRowHeader}}>
                                                            <div>{currentLine.bSign}</div>
                                                            <div>{currentLine.bNumber}</div>
                                                        </div></td>
                                                        <td className={classB} style={{backgroundColor: colorB}}>
                                                            <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code>{currentLine.bText}</code></pre>
                                                        </td>
                                                    </tr>
                                                )
                                            
                                        })}
                                    </tbody> 
                                </table>
                            </div>
                        )
                    })}
                </div>
            )
        }
        else{
            return(
                <div style={BodyUntracked}>
                    <Button style={BodyUntrackedButton} onClick={trackCurrentFile} variant="outlined">Track Current File</Button>
                </div>
                
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
            {renderHeader()}
            {renderContent()}
        </div>
    )
}