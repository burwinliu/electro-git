import {colors} from "../../styles/palette"
import {headerHeight, menuHeight} from "../../styles/constants"

export const HeaderWrap = {
    height: headerHeight,
    maxHeight: headerHeight,
    
    flexDirection: "row",
    flexGrow: "1",
    justifyContent: "space-between",

    borderBottom: "solid " + colors.outline + " 1px",

    backgroundColor: colors.backgroundHeader,

    listStyleType: "none",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"    
}

export const HeaderItem = {
    padding: "8px 16px",
    border: "solid " + colors.outline,
    borderWidth: "0",
    height: "53px"
}

export const HeaderSidebar = {
    width: "300px",
    minWidth: "300px",
    boxSizing: "border-box",
    flexDirection: "row"
}

export const HeaderRepoSidebarDropdownWrapper = { 
    width: "300px", 

    backgroundColor: colors.backgroundColor
}

export const HeaderRepoSidebarDropdown ={
    flexDirection: "column",

    height: "calc(100vh - " + headerHeight + " - " + menuHeight + " - 1px)", // 1px for border on top

    padding: "0",
    zIndex: "1",
    backgroundColor: colors.backgroundColor,
    boxSizing: "border-box",
    width: "100%"
}

export const HeaderMenuSubText = {
    lineHeight: "normal",
    color: colors.subtext
}

export const HeaderMenuMainText = {
    lineHeight: "normal",
    color: "black",
    marginLeft: "6px"
}