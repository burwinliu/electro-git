import {colors} from "../../styles/palette"
import {headerHeight} from "../../styles/constants"

export const BodyWrap = {
    flexDirection: "column",
    flexGrow: "1",

    overflowY: "auto",
    maxHeight: "100vh"
}

export const BodyContent = {
    flexDirection: "column",
    flexGrow: "1",
    
}

export const BodyHead = {
    flexDirection: "row",
    flexGrow: "1",

    backgroundColor: colors.background,

    borderBottom: "solid " + colors.outline + " 1px",

    maxHeight: "30px",    
}