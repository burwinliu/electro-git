import React, {useState, useEffect} from 'react';
import { useSelector } from "react-redux";

import {
    BodyWrap, BodyHead, BodyContent, BodyHeaderButton, BodyContentTable, BodyContentTableHeader, BodyContentRowHeader
} from './BodyStyle'
import {colors} from "../../styles/palette"

import { Button } from '@material-ui/core';

import {renderGitChunk} from "../../services"

export const Body = (props) => {
    const file = useSelector(state => state.appstore.currentDiff);
    const fileDiff = useSelector(state => state.stage.diff);

    const [fileA, setFileA] = useState("")
    const [fileB, setFileB] = useState("")

    const setFiles = (a, b) => {
        setFileA(a)
        setFileB(b)
    }
    

    const renderHeader = () => {
        if (props.mode){
            return(
                <div style={BodyHead}>
                    <div style={{...BodyHeaderButton, width: "50%", borderWidth: "0 1px 0 0"}}>
                        {fileA} (Past File)
                    </div>
                    <div style={{...BodyHeaderButton, width: "50%", borderWidth: "0"}}>
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
            return (
                <div name="BodyContent" style={BodyWrap}>
                    {Object.keys(chunks).map(index =>{
                        const currentChunk = chunks[index]
                        console.log(currentChunk)
                        let fromLine = currentChunk.header.fromLine
                        let toLine = currentChunk.header.toLine

                        let rendered = renderGitChunk(currentChunk);

                        return(
                            <div style={BodyContent}>
                                
                                <table style={BodyContentTable}> 
                                    <colgroup>
                                        <col width="5%"/>
                                        <col width="45%"/>
                                        <col width="5%"/>
                                        <col width="45%"/>
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <td colSpan={4} style={BodyContentTableHeader}>
                                                File in repo changed on line {chunks[index].header.fromLine} for {chunks[index].header.fromLineLength} lines.
                                                File in Disk is now recorded on line {chunks[index].header.toLine} for {chunks[index].header.toLineLength} lines
                                            </td>
                                        </tr>
                                        {
                                            Object.keys(rendered).map(textIndex => {
                                                const currentLine = rendered[textIndex]

                                                let colorA = "white"
                                                let colorB = "white"
                                                let labelA = "grey hoverTableRow"
                                                let labelB = "grey hoverTableRow"
                                                if (currentLine.aSign === "-"){
                                                    colorA = colors.redLight
                                                    let labelA = "red hoverTableRow"
                                                }
                                                if (currentLine.bSign === "+"){
                                                    colorB = colors.greenLight
                                                    let labelB = "green hoverTableRow"
                                                }
                                                
                                                return(
                                                    <tr>
                                                        <td className={labelA} style={{backgroundColor: colorA}}><div style={{...BodyContentRowHeader,}}>
                                                            <div>{currentLine.aSign}</div>
                                                            <div>{currentLine.aNumber}</div>
                                                        </div></td>
                                                        <td className={labelA} style={{backgroundColor: colorA, borderRight: "solid " + colors.outline + " 1px",}}>
                                                            <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code>{currentLine.aText}</code></pre>
                                                        </td>
                                                        <td className={labelB} style={{backgroundColor: colorB}}><div style={{...BodyContentRowHeader}}>
                                                            <div>{currentLine.bSign}</div>
                                                            <div>{currentLine.bNumber}</div>
                                                        </div></td>
                                                        <td className={labelB} style={{backgroundColor: colorB}}>
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
    }
    useEffect(() => {
        if (fileDiff !== undefined && fileDiff[file] !== undefined){
            console.log(fileDiff[file])
            setFiles(fileDiff[file].fileA, fileDiff[file].fileB)
        }
        else{
            setFiles("UNTRACKED", "UNTRACKED")
        }
    }, [fileDiff, file])
    

    return (
        <div style={BodyWrap}>
            {renderHeader()}
            {renderContent()}
        </div>
    )
}