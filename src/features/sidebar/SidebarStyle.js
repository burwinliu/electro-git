import {colors} from "../../styles/palette"

export const SidebarWrap = {
    maxWidth: "300px",
    flexDirection: "column",
    flexGrow: "1",

    overflowY: "auto",
    overflowX: "hidden",

    borderRight: "solid " + colors.outline + " 1px",
    justifyContent: "space-between"
}

export const SidebarStyle = {
    paddingTop: "0px",
    maxHeight: "100%",
    overflowY: "auto"
}

export const SidebarCommitMenu = {
    minHeight: "200px",
    backgroundColor: colors.background,
    padding: "6px",

    flexDirection: "column",
    justifyContent: "space-around",

    borderWidth: "0",
    borderTop: "solid " + colors.outline + " 1px",
}

export const SidebarCommitText = {
    width: "100%",
    
}

export const SidebarCommitButtonGroups = {
    width: "100%",
    justifyContent: "space-around",
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