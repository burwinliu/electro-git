import { headerHeight } from "../../styles/constants"


export const MainWrapper = {
    flexDirection: "column",
    flexGrow: "1",
}

export const MainContent = {
    flexDirection: "row",
    flexGrow: "1",

    height: "calc(100vh - " + headerHeight + " - 1px)"
}