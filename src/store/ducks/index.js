export {appstoreReducer as appstore} from './appstore'
export {repoReducer as repo} from './repo'
export {stageReducer as stage} from './stage'
export {userReducer as user} from './user'

export * from './appstore'

export * from './repo'

export * from './stage'

export * from './user'

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
