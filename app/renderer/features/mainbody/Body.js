import React, {useState} from 'react';
import { useSelector } from "react-redux";

import {BodyWrap, BodyHead, BodyContent} from './BodyStyle'

export const Body = (props) => {
    const file = useSelector(state => state.appstore.currentDiff);
    const fileDiff = useSelector(state => state.stage.diff);

    const [viewType, setViewType] = useState(true)  // TWO FILES VIEW, may change to accomedate more in the future?
    const [fileA, setFileA] = useState("")
    const [fileB, setFileB] = useState("")

    if(fileDiff){
        console.log(fileDiff, fileDiff[file])
    }

    const setFiles = (a, b) => {
        setFileA(a)
        setFileB(b)
    }

    const renderHeader = () => {
        if (viewType){
            return(
                <div>TESTING</div>
            )
        }
        return (
            <div>TESTING2</div>
        )
    }

    const renderContent = () => {
        return (
            <div>TESTING3</div>
        )
    }

    return (
        <div style={BodyWrap}>
            <div style={BodyHead}>{renderHeader()}</div>
            <div style={BodyContent}>
                {renderContent()}
            </div>
            
        </div>
    )
}