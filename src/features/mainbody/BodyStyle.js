import {colors} from "../../styles/palette"

//WRAPPERS
export const BodyAreaWrap = {
    flexDirection: "row",
    flexGrow: "1",

    wordBreak: "break-all",
}
export const BodyWrap = {
    flexDirection: "column",
    flexGrow: "1",

    borderSpacing: "0",
    borderStyle: "solid",
    borderColor: colors.outline,
    borderWidth: "1px",

    overflowY: "auto",
    maxHeight: "100vh"
}
//HEADER 
export const BodyHistHeader = {
    backgroundColor: colors.backgroundHeader,
    flexDirection: "row",
    flexGrow: "1",

    minHeight: "50px",
    maxHeight: "50px",

    borderSpacing: "0",
    borderStyle: "solid",
    borderColor: colors.outline,
    borderBottomWidth: "1px",
}
// BODY
export const BodyContent = {
    flexDirection: "column",
}

export const BodyUntracked = {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
}
export const BodyUntrackedButton = {
    height: "fit-content",
    color: colors.primary
}

export const BodyContentTable = {
    borderSpacing: "0",
    borderStyle: "solid",
    borderColor: colors.outline,
    borderWidth: "2px",
}
export const BodyHeaderFileFont = {
    fontWeight: "normal",
    marginBlockStart: "0.5rem",
    marginBlockEnd: "0.5rem"
}
export const BodyHeaderSubFont={
    color: colors.blueSub, 
}
export const BodyContentTableHeaderSub={
    backgroundColor: colors.offWhite,
}
export const BodyContentTableHeaderMain={
    backgroundColor: colors.offWhite
}
export const BodyContentTableHeaderContent = {
    padding: "0 20px",
    
}
export const BodyContentRowHeader = {
    flexDirection: "row",
    justifyContent: "space-evenly"
}
export const BodyContentCode = {
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
}

export const BodyContentTableAnimate = {
    tableRow: {
        "& > td": {
            boxSizing:"border-box",
            borderStyle: "solid",
            borderColor: "transparent",
            borderWidth: "2px 0"
        },
        "&:hover > td":{
            borderStyle: "solid",
            borderColor: colors.outlineDark,
            borderWidth: "2px 0",
        },
    }
}