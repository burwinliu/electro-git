import { combineReducers } from 'redux'

// FOR NEW THINGS TO CONVERT TO
import {configReducer as config} from './configStore'
import {controlReducer as control} from './controlStore'
import {displayStateReducer as displayState} from './displayStateStore'
import {gitReducer as git} from './gitStore'

export {configReducer as config} from './configStore'
export {controlReducer as control} from './controlStore'
export {displayStateReducer as displayState} from './displayStateStore'
export {gitReducer as git} from './gitStore'

export * from './configStore'
export * from './controlStore'
export * from './displayStateStore'
export * from './gitStore'

// For view control of whether to show history or changes
export const CONTENT_CONTROL = {
    MAIN_DIFF_VIEW: 0,
    MAIN_HISTORY_VIEW: 1,
}

// For view control of DIFF RENDER
export const DIFF_CONTROL = {
    MAIN_SIDE_BY_SIDE_VIEW: 0,
    MAIN_COMPRESSED_VIEW: 1
}

// FOR HISTORY CONTROL
export const HISTORY_CONTROL = {
    MAIN_OVERVIEW_VIEW: 0,
    MAIN_FILE_VIEW: 1,
}

export const rootReducer = combineReducers({
    config,
    control,
    displayState, 
    git,
})