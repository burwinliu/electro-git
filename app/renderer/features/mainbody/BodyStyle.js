import {colors} from "../../styles/palette"
import {headerHeight} from "../../styles/constants"

//WRAPPER
export const BodyWrap = {
    flexDirection: "column",
    flexGrow: "1",

    overflowY: "auto",
    maxHeight: "100vh"
}

// HEADER
export const BodyHead = {
    flexDirection: "row",
    flexGrow: "1",

    backgroundColor: colors.background,

    borderBottom: "solid " + colors.outline + " 1px",

    maxHeight: "30px",    
}

export const BodyHeaderButton ={
    border: "solid " + colors.outline,
    alignItems: "center",
    padding: "0 8px",
    boxSizing: "border-box",
    maxWidth: "calc(calc(100vw - 300px)/2)"
}

// BODY
export const BodyContent = {
    flexDirection: "column",
    flexGrow: "1",

    maxWidth: "calc(100vw - 300px)"
    
}
export const BodyContentTable = {
    borderSpacing: "0"
}
export const BodyContentTableHeader = {
    padding: "0 6px"
}
export const BodyContentRowHeader = {
    flexDirection: "row",
    justifyContent: "space-evenly"
}
export const BodyContentChunkLine = {
    flexDirection: "row",

    minHeight: "30px",
}