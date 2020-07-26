import React from 'react';

import {Button, makeStyles} from "@material-ui/core"
import {colors} from "../../styles/palette"

import {
    BodyWrap, 
    BodyHeaderWrap, BodyHeaderItem, 
    BodyContent, 
    BodyUntracked, BodyUntrackedButton,
    BodyContentTable, BodyContentTableHeaderMain, BodyContentTableHeaderSub, BodyContentTableHeaderContent, BodyHeaderFileFont, BodyHeaderSubFont,
    BodyContentRowHeader, BodyContentCode, BodyContentTableAnimate, 
} from './BodyStyle'

import {
    renderGitChunkTwoFileFormat, 
    helperGitOpen,
    helperGitAdd,
    renderGitChunkCompressed
} from "../../services"

const renderFunctionHeaderRowTwo = (functionStr) => {
    if(functionStr === ""){
        return 
    }
    return (
        <tr style={BodyContentTableHeaderSub}>
            <td colSpan={2} 
                style={{...BodyContentTableHeaderContent, ...BodyHeaderSubFont, 
                    padding: "0 30px", borderRight: "solid " + colors.outline + " 1px", color: colors.blueSubLight}}
            >
                {functionStr}
            </td>
            <td colSpan={2} style={{...BodyContentTableHeaderContent, ...BodyHeaderSubFont, padding: "0 30px", color: colors.blueSubLight}}>
                {functionStr}
            </td>
        </tr>
    )
}

const renderFunctionHeaderRowCompress = (functionStr) => {
    if(functionStr === ""){
        return 
    }
    return (
        <tr style={BodyContentTableHeaderSub}>
            <td colSpan={4} style={{...BodyContentTableHeaderContent, ...BodyHeaderSubFont, paddingLeft: "30px", color: colors.blueSubLight}}>
                {functionStr}
            </td>
        </tr>
    )
}

export const GitDiffSideBySide = (props) => {
    const styleAnimate = makeStyles(BodyContentTableAnimate)()

    const chunks = props.chunks
    const fileA = props.fileA
    const fileB = props.fileB

    return (
        <div name="BodyContent" style={BodyWrap}>
            <table style={BodyContentTable}> 
                <colgroup>
                    <col width="50%"/>
                    <col width="50%"/>
                </colgroup>
                <tbody>
                    <tr>
                        <td style={{paddingLeft: "20px", borderRight: "solid " + colors.outline + " 1px"}}><h3 style={BodyHeaderFileFont}>{fileA}</h3></td>
                        <td style={{paddingLeft: "20px"}}><h3 style={BodyHeaderFileFont}>{fileB}</h3></td>
                    </tr>
                </tbody>
            </table>
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
                                <tr style={BodyContentTableHeaderMain}>
                                    <td 
                                        colSpan={2} 
                                        style={{
                                            ...BodyContentTableHeaderContent,
                                            ...BodyHeaderSubFont,
                                            borderRight: "solid " + colors.outline + " 1px"
                                        }}
                                     >
                                        File in repo changed on line {fromLine} for {chunks[index].header.fromLineLength} lines.
                                    </td>
                                    <td 
                                        colSpan={2} 
                                        style={{
                                            ...BodyContentTableHeaderContent,
                                            ...BodyHeaderSubFont,
                                        }}
                                     >
                                        File in Disk is now recorded on line {toLine} for {chunks[index].header.toLineLength} lines.
                                    </td>
                                </tr>
                                {renderFunctionHeaderRowTwo(currentChunk.header.functionContext)}
                                {
                                    Object.keys(loaded).map(textIndex => {
                                        const currentLine = loaded[textIndex]

                                        let colorA = colors.white
                                        let colorAHead = colors.whiteDark
                                        let colorB = colors.white
                                        let colorBHead = colors.whiteDark
                                        let classA = "white"
                                        let classB = "white"

                                        if (currentLine.aSign === "-"){
                                            colorAHead = colors.redLight
                                            colorA = colors.redLightSub
                                            classA = "red"
                                        }
                                        if (currentLine.bSign === "+"){
                                            colorBHead = colors.greenLight
                                            colorB = colors.greenLightSub
                                            classB = "green"
                                        }

                                        if (currentLine.aSign === ""){
                                            colorAHead = colors.greyLight
                                            colorA = colors.greyLight
                                            classA = "grey"
                                        }
                                        if (currentLine.bSign === ""){
                                            colorBHead = colors.greyLight
                                            colorB = colors.greyLight
                                            classB = "grey"
                                        }
                                        
                                        return(
                                            <tr key={textIndex} className={styleAnimate.tableRow}>
                                                <td 
                                                    className={classA + "head"} 
                                                    style={{backgroundColor: colorAHead}}
                                                >
                                                    <div style={{...BodyContentRowHeader,}}>
                                                        <div>{currentLine.aSign}</div>
                                                        <div>{currentLine.aNumber}</div>
                                                    </div>
                                                </td>
                                                <td className={classA} style={{backgroundColor: colorA, paddingLeft:"4px"}}>
                                                    <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code style={BodyContentCode}>{currentLine.aText}</code></pre>
                                                </td>
                                                <td 
                                                    className={classB + "head"} 
                                                    style={{backgroundColor: colorBHead}}
                                                >
                                                    <div style={{...BodyContentRowHeader}}>
                                                        <div>{currentLine.bSign}</div>
                                                        <div>{currentLine.bNumber}</div>
                                                    </div>
                                                </td>
                                                <td className={classB} style={{backgroundColor: colorB, paddingLeft:"4px"}}>
                                                    <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code style={BodyContentCode}>{currentLine.bText}</code></pre>
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

export const GitDiffCompressed = (props) =>{
    const styleAnimate = makeStyles(BodyContentTableAnimate)()

    const chunks = props.chunks
    const fileA = props.fileA
    const fileB = props.fileB
    return (
        <div name="BodyContent" style={BodyWrap}>
            <table style={BodyContentTable}> 
                <colgroup>
                    <col width="100%"/>
                </colgroup>
                <tbody>
                    <tr>
                        <td style={{paddingLeft: "20px"}}><h3 style={BodyHeaderFileFont}>{fileA} {">"} {fileB}</h3></td>
                    </tr>
                </tbody>
                    
            </table>
            {Object.keys(chunks).map(index =>{
                const currentChunk = chunks[index]
                
                let fromLine = currentChunk.header.fromLine
                let toLine = currentChunk.header.toLine
                let loaded = renderGitChunkCompressed(currentChunk);
                return(
                    <div key={index} style={BodyContent}>
                        
                        <table style={BodyContentTable}> 
                            <colgroup>
                                <col width="5%"/>
                                <col width="5%"/>
                                <col width="90%"/>
                            </colgroup>
                            <tbody>
                                <tr style={BodyContentTableHeaderMain}>
                                    <td 
                                        colSpan={3} 
                                        style={{
                                            ...BodyHeaderSubFont,
                                            ...BodyContentTableHeaderContent,
                                            paddingLeft: "20px",
                                        }}
                                     >
                                        File in repo changed on line {fromLine} for {chunks[index].header.fromLineLength} lines; 
                                        File in Disk is now recorded on line {toLine} for {chunks[index].header.toLineLength} lines.
                                    </td>
                                </tr>
                                {renderFunctionHeaderRowCompress(currentChunk.header.functionContext)}
                                {
                                    Object.keys(loaded).map(textIndex => {
                                        const currentLine = loaded[textIndex]

                                        let color = colors.white
                                        let colorHead = colors.whiteDark
                                        let className = "white"

                                        if (currentLine.aSign === "-"){
                                            colorHead = colors.redLight
                                            color = colors.redLightSub
                                            className = "red"
                                        }
                                        if (currentLine.bSign === "+"){
                                            colorHead = colors.greenLight
                                            color = colors.greenLightSub
                                            className = "green"
                                        }
                                        
                                        return(
                                            <tr key={textIndex} className={styleAnimate.tableRow}>
                                                <td 
                                                    className={className + "head"} 
                                                    style={{backgroundColor: colorHead}}
                                                >
                                                    <div style={{...BodyContentRowHeader,}}>
                                                        <div>{currentLine.aSign}</div>
                                                        <div>{currentLine.aNumber}</div>
                                                    </div>
                                                </td>
                                                <td 
                                                    className={className + "head"} 
                                                    style={{backgroundColor: colorHead}}
                                                >
                                                    <div style={{...BodyContentRowHeader}}>
                                                        <div>{currentLine.bSign}</div>
                                                        <div>{currentLine.bNumber}</div>
                                                    </div>
                                                </td>
                                                <td className={className} style={{backgroundColor: color, paddingLeft:"4px"}}>
                                                    <pre style={{margin: "0px", whiteSpace: "pre-wrap"}}><code style={BodyContentCode}>{currentLine.text}</code></pre>
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

export const GitDiffUntracked = (props) => {
    const trackCurrent = props.handle
    return(
        <div style={BodyUntracked}>
            <Button style={BodyUntrackedButton} onClick={trackCurrent} variant="outlined">Track Current File</Button>
        </div>
    )
    
}