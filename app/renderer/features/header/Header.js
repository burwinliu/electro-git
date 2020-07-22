import React, {useState} from 'react';
import { useSelector } from "react-redux";

import {
    HeaderWrap, HeaderItem,
    HeaderSidebar,
    HeaderMenuSubText,HeaderMenuMainText
} from "./HeaderStyles"

export const Header = (props) => {
    const dirPath = useSelector(state => state.repo.path);
    const dirSplit = dirPath.split("\\")

    return (
        <div style={HeaderWrap}>
            <div style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 0 0 1px"}}>
                <li style={{...HeaderMenuSubText}}>{"Current Repository:"}</li>
                <li style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{dirSplit[dirSplit.length-1]}</li>
            </div>
            <div style={HeaderItem}>
                <p>test</p>
            </div>
        </div>
    )
}