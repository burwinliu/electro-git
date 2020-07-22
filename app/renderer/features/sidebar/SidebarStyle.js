import {colors} from "../../styles/palette"
import {headerHeight} from "../../styles/constants"

export const SidebarWrap = {
    maxWidth: "300px",
    flexDirection: "column",
    flexGrow: "1",

    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "100vh",

    boxShadow: "0.3em 0.3em 1em rgba(0,0,0,0.3)"
}

export const SidebarStyle = {
    paddingTop: "0px",
    maxHeight: "100%",
    overflowY: "auto"
}

export const SidebarMenuHeader = {
    maxHeight: headerHeight,
    padding: "8px 16px",
    flexDirection: "column",
    flexGrow: "1",

    borderBottom: "solid " + colors.outline + " 1px",

    backgroundColor: colors.background,

    listStyleType: "none",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif"
}

export const SidebarMenuItems = {
    minHeight: "30px",
    padding: "4px 16px",
    borderColor: colors.outline, 
    borderStyle: "solid",
    borderWidth: "1px 0"
}

export const SidebarMenuIcons = {
    minWidth: "0px",
    height: "30px"
}

export const SidebarCheckbox = {
    color: colors.primary
}

export const SidebarText = {
    whiteSpace: "initial",
    maxWidth: "100%",
}