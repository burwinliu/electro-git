import {colors} from "../../styles/palette"

//WRAPPER
export const BodyWrap = {
    flexDirection: "column",
    flexGrow: "1",

    overflowY: "auto",
    maxHeight: "100vh"
}

// HEADER
export const BodyHeaderWrap = {
    flexDirection: "row",
    flexGrow: "1",

    backgroundColor: colors.background,

    borderBottom: "solid " + colors.outline + " 1px",

    maxHeight: "30px",    
    minHieght: "30px",
}

export const BodyHeaderItem = {
    borderStyle: "solid",
    borderColor: colors.outline,
    alignItems: "center",
    padding : "0 8px",
    boxSizing: "border-box",
    maxWidth: "calc(calc(100vw - 300px)/2)"
}

// BODY
export const BodyContent = {
    flexDirection: "column",

    maxWidth: "calc(100vw - 300px)"
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
    borderWidth: "1px",
}
export const BodyContentTableHeader = {
    padding: "0 6px"
}
export const BodyContentRowHeader = {
    flexDirection: "row",
    justifyContent: "space-evenly"
}

export const BodyContentTableAnimate = {
    tableRow: {
        "& > td": {
            boxSizing:"border-box",
            borderStyle: "solid",
            borderColor: "transparent",
            borderWidth: "1px 0"
        },
        "&:hover > td":{
            borderStyle: "solid",
            borderColor: colors.outlineTableRow,
            borderWidth: "1px 0",
        },
        "&:hover > .red":{
            backgroundColor: colors.redLightHover
        },
        "&:hover > .green":{
            backgroundColor: colors.greenLightHover
        },
    },

}