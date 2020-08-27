import { combineReducers } from 'redux'

import {appstoreReducer as appstore} from './appstore'
import {repoReducer as repo} from './repo'
import {stageReducer as stage} from './stage'

export {appstoreReducer as appstore} from './appstore'
export {repoReducer as repo} from './repo'
export {stageReducer as stage} from './stage'

export * from './appstore'

export * from './repo'

export * from './stage'

// FOR NEW THINGS TO CONVERT TO
import {configReducer as config} from './configStore'
import {controlReducer as control} from './controlStore'
import {displayReducer as display} from './displayStore'
import {gitReducer as git} from './gitStore'

export {configReducer as config} from './configStore'
export {controlReducer as control} from './controlStore'
export {displayReducer as display} from './displayStore'
export {gitReducer as git} from './gitStore'

export * from './configStore'
export * from './controlStore'
export * from './displayStore'
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

export const newReducer = combineReducers({
    config,
    control,
    display, 
    git,
})


export const rootReducer = combineReducers({
    appstore,
    repo,
    stage,
})