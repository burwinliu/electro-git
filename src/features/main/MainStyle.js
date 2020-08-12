import { headerHeight, menuHeight} from "../../styles/constants"

export const MainCenter = {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",

    flexGrow: "1",
}

export const MainWrapper = {
    flexDirection: "column",
    flexGrow: "1",
}

export const MainContent = {
    flexDirection: "row",
    flexGrow: "1",

    height: "calc(100vh - " + headerHeight + " - " + menuHeight + " - 3px)" // 3 px -- 2 for border top of body to create draggable, and 1px for border
}