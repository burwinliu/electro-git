import {colors, menuHeight} from "../../styles"

export const WindowControlsWrapper = {
    WebkitAppRegion: "no-drag"
}

export const MenuBarWrapper = {
    flexDirection: "row",
    flexGrow: "1",
    height: menuHeight,
    maxHeight: menuHeight,
    justifyContent: "space-between",
    width: "100vw",
    backgroundColor: colors.menu,

    WebkitAppRegion: "drag",
    WebkitUserSelect: "none"
}