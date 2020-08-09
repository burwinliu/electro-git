import React, {useState, useEffect} from "react"

// REDUX
import { useSelector, useDispatch } from "react-redux"
import { stageSetStatusSummary } from "../../store/ducks"

//Components
import { 
    Button, ClickAwayListener, Collapse,
    Dialog, DialogTitle, DialogContent, DialogActions,
    List, ListItem, ListItemIcon, ListItemText,
    withStyles,
    Snackbar,
    DialogContentText,
    Divider,
} from "@material-ui/core"

import {
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon ,
    MergeType as MergeTypeIcon,
} from '@material-ui/icons';
import {
    ModalBranchCreate
} from "../modals"

// Services
import { 
    helperGitFetch, 
    helperGitPull,
    helperGitPush,
    helperGitBranchCheckout,
    helperGitCheckBranchRemote,
    helperGitBranchPush,
    helperGitRemoteName,
    helperGitStatus,
    helperGitIsMerge, 
    helperGitAdd,
    helperGitAddCommit,
    helperGitMergePull
 } from "../../services"

// Styles
import { 
    HeaderItem,
    HeaderSidebar, HeaderRepoSidebarDropdown,
    HeaderMenuSubText,
    HeaderMenuMainText,
} from './HeaderStyles'

import { GitError } from "simple-git"

import { colors } from '../../styles/palette';



export const FetchOrPull = () => {
    const dirPath = useSelector(state => state.repo.path);
    const statusSummary = useSelector(state=> state.stage.statusSummary)
    const branch = useSelector(state => state.appstore.branch)
    const branchList = useSelector(state => state.stage.branchList)

    const [isPublished, setIsPublished] = useState(true)

    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const dispatch = useDispatch()

    useEffect( () => {
        if(branch === ""){
            return
        }
        helperGitRemoteName(dirPath).then((result) => {
            handleFetchAction().catch((err) => {
                setErrMsg(err.message)
                setErr(true)
            })
        }).catch((err) => {
            console.log(err.message)
        })
        
    }, [])

    useEffect( () => {
        if(branch === ""){
            console.log(branchList)
            setIsPublished(false)
            return
        }
        helperGitRemoteName(dirPath).then((result) => {
            helperGitCheckBranchRemote(dirPath, branch).then((isChecked) => {
                console.log(isChecked)
                setIsPublished(isChecked)
            }).catch((err) => {
                setErrMsg(err.message)
                setErr(true)
            })
        }).catch((err) => {
            console.log(err.message)
        })
    }, [branch, dirPath])

    const DialogFrag = () => {
        return(
            <Dialog  
                open={err}
                onClose={handleErrClose} 
            >
                <DialogTitle id="simple-dialog-title">Error</DialogTitle>
                <DialogContent>
                    <div>
                        <pre style={{whiteSpace: "pre-wrap"}}><code>{errMsg}</code></pre>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    const handleFetchAction =() => {
        return helperGitFetch(dirPath).then((status) => {
            dispatch(stageSetStatusSummary(status))
        })
    }
    
    const handlePullAction = () => {

        helperGitPull(dirPath).then((status) => {
        }).catch((err) => {
            setErrMsg(err.message)
            setErr(true)
        })
        handleFetchAction();
    }

    const handlePushAction = () => {
        helperGitPush(dirPath)
            .then((response) => {
                setErrMsg("Push to " + response.repo + " successful.")
                setErr(true)
                
            })
            .catch((err) => {
                if (err instanceof GitError){
                    setErrMsg(err.message)
                    setErr(true)
                }
                else{
                    throw err
                }
            })
        handleFetchAction();
    }

    const handlePublishBranch = () => {
        helperGitBranchPush(dirPath, branch).then( () => {
            helperGitCheckBranchRemote(dirPath, branch).then((isChecked) => {
                console.log(isChecked)
                setIsPublished(isChecked)
            })
        }).catch( (err) => {
            setErr(true)
            setErrMsg(err.message)
        })
    }

    const handleErrClose = () => {
        setErr(false)
    }

    if (!isPublished && Object.keys(branchList||{}).length === 0){
        return (
            <div title="Commit before continuing" >
                <Button 
                    style={{...HeaderItem, borderWidth: "0 1px 0 0"}} 
                    disabled
                >
                    <ListItemText 
                        style={{flexDirection: "column"}} 
                        primary={"Publish Branch"} 
                        secondary={
                            <span style={{fontSize: ".6rem"}}>
                                Cannot Publish
                            </span>
                        }
                        
                    />
                </Button>
                <DialogFrag/>
            </div>
        )
    }

    if (!isPublished){
        return (
            <div title="Commit before continuing" >
                <Button 
                    style={{...HeaderItem, borderWidth: "0 1px 0 0"}}
                    onClick={handlePublishBranch}
                >
                    Publish Branch
                </Button>
                <DialogFrag/>
            </div>
        )
    }


    if (statusSummary && statusSummary.behind > 0) {
        return (
            <div>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handlePullAction}>
                    Pull
                </Button>
                <DialogFrag/>
            </div>
            
        )
    }
    
    if (statusSummary && statusSummary.behind > 0) {
        return (
            <div>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handlePullAction}>
                    Pull
                </Button>
                <DialogFrag/>
            </div>
            
        )
    }

    if (statusSummary && statusSummary.ahead > 0) {
        return (
            <div>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handlePushAction}>
                    Push
                </Button>
                <DialogFrag/>
            </div>
            
        )
    }
    

    return (
        <div>
            <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handleFetchAction}>
                Fetch Remote
            </Button>
            <DialogFrag/>
        </div>
            
    )
}

export const BranchDropdown = (props) => {
    const branchList = useSelector(state=>state.stage.branchList)
    const curBranch = useSelector(state => state.appstore.branch)
    const dirPath = useSelector(state => state.repo.path)

    const [branchNav, setBranchNav] = useState(false)
    const [branchCreate, setBranchCreate] = useState(false)

    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const recordBranch = {}

    let branchRender = curBranch

    const HeaderButton = withStyles((theme) => ({
        root:{
            alignItems: "start",
        },
        label: {
            flexDirection: "row",
            minWidth: "268px",
            justifyContent: "space-between"
        },
        
    }))(Button);

    const SidebarDropdown = withStyles(() => ({
        wrapper:{
            width: "300px",
            backgroundColor: colors.background,
            zIndex: "1",
            
        },
        wrapperInner:{
            flexDirection: "column"
        }
    }))(Collapse)


    const handleBranchDialogOpen = () => {
        setBranchCreate(true)
    }
    
    const handleBranchOpen = () => {
        setBranchNav(true);
    };
    const handleBranchClose = () => {
        setBranchNav(false)
    }

    const handleClickAwayBranch = () => {
        if (branchCreate) return
        handleBranchClose()
    }

    const handleCheckoutBranch = (branchName, commit) => {
        helperGitBranchCheckout(dirPath, branchName)
            .then((response) =>{
                props.refresh()
            })
            .catch((err) =>{
                setBranchCreate(false)
                setErr(true)
                setErrMsg(err.message)

            })
    }   

    const handleBranchDialogClose = () => {
        setBranchCreate(false)
    }

    const handleErrClose = () => {
        setErr(false)
    }

    if(Object.keys(branchList||{}).length === 0){
        return(
            <HeaderButton disabled style={{...HeaderItem, ...HeaderSidebar, backgroundColor: colors.background, borderWidth: "0 1px 0 0"}} onClick={handleBranchClose}>
                <div style={{flexDirection:  "column"}}>
                    <div style={{...HeaderMenuSubText}}>{"Current Branch:"}</div>
                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{curBranch}</div>
                </div>
                <ArrowDropUpIcon fontSize="large"/>
            </HeaderButton> 
        )
    }
    
    if(curBranch === ""){
        branchRender = "No Branch Selected"
    }

    return( 
        <div>

            <ClickAwayListener onClickAway={handleClickAwayBranch}>
                <div style={{flexDirection: "column", height: "fit-content"}}>
                        {branchNav? 
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, backgroundColor: colors.background, borderWidth: "0 1px 0 0"}} onClick={handleBranchClose}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Branch:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{branchRender}</div>
                                </div>
                                <ArrowDropUpIcon fontSize="large"/>
                            </HeaderButton> 
                            :
                            <HeaderButton style={{...HeaderItem, ...HeaderSidebar, borderWidth: "0 1px 0 0"}} onClick={handleBranchOpen}>
                                <div style={{flexDirection:  "column"}}>
                                    <div style={{...HeaderMenuSubText}}>{"Current Branch:"}</div>
                                    <div style={{...HeaderMenuSubText, ...HeaderMenuMainText}}>{branchRender}</div>
                                </div>
                                <ArrowDropDownIcon fontSize="large"/>
                            </HeaderButton> 
                        }   
                    <SidebarDropdown in={branchNav}>
                        <List style={{...HeaderRepoSidebarDropdown}}>
                            <ListItem>
                                <Button style={{width: "100%"}} variant="outlined" onClick={handleBranchDialogOpen}>
                                    New Branch
                                </Button>
                            </ListItem>
                            {
                                Object.keys(branchList||{}).map((key) => {
                                    const splitStr = branchList[key].name.split(/[\/\\]/g);
                                    if(branchList[key].current === true || splitStr[splitStr.length-1] === curBranch || recordBranch[splitStr[splitStr.length-1]]){
                                        return
                                    }
                                    recordBranch[splitStr[splitStr.length-1]] = true
                                    return (
                                        <ListItem button key={key} onClick={() => handleCheckoutBranch(splitStr[splitStr.length-1])}>
                                            <ListItemIcon>
                                                <MergeTypeIcon/>
                                            </ListItemIcon>
                                            <ListItemText 
                                                style={{flexDirection: "column"}}
                                                primary={splitStr[splitStr.length-1]} 
                                                secondary={branchList[key].commit}
                                            />
                                        </ListItem>
                                    )
                                })
                            }
                        </List>
                    </SidebarDropdown>
                    
                
                </div>
            </ClickAwayListener>
            <ModalBranchCreate open={branchCreate} handleClose={handleBranchDialogClose} refresh={props.refresh}/>
            <Dialog  
                open={err}
                onClose={handleErrClose} 
            >
                <DialogTitle id="simple-dialog-title">Push Message</DialogTitle>
                <DialogContent>
                    <div>
                        <pre style={{whiteSpace: "pre-wrap"}}><code>{errMsg}</code></pre>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleErrClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export const ConflictsPops = (props) => {
    const statusSummary = useSelector(state=> state.stage.statusSummary)
    const dirPath = useSelector(state => state.repo.path)
    const branch = useSelector(state => state.appstore.branch)

    const [openMerge, setOpenMerge] = useState(false)
    const [mergeMsg, setMergeMsg] = useState("")

    const [show, setShow] = useState(false)
    const [length, setLength] = useState(0)

    const dispatch = useDispatch()

    useEffect( () => {
        helperGitStatus(dirPath).then((status) => {
            dispatch(stageSetStatusSummary(status))
            
        })
    }, [])

    useEffect( () => {
        if (statusSummary && statusSummary.conflicted.length !== 0){
            
            helperGitIsMerge(dirPath).then((resp) => {
                console.log(resp)
                if(resp){
                    setMergeMsg("Merge In Process -- Please Resolve")
                    setOpenMerge(true)
                    setLength(statusSummary.conflicted.length)
                    if(statusSummary.conflicted.length === 0) {
                        setLength("RESOLVED")
                    }
                }
                else{
                    return
                }
            })
        }
    }, [statusSummary])

    const handleShow = () => {
        setOpenMerge(false)
        setShow(true)
    }

    const handleClose = () => {
        setOpenMerge(true)
        setShow(false)
    }

    const handleAdd = (key) => {
        helperGitAdd(dirPath, [key])
        helperGitStatus(dirPath).then((status) => {
            dispatch(stageSetStatusSummary(status))
            if(status.conflicted.length === 0) {
                setLength("RESOLVED")
                setOpenMerge(false)
                setShow(false)
                helperGitMergePull(dirPath)
            }
        })
    }

    console.log(statusSummary, "SUMMARY")
    

    return (
        <div>
            <Snackbar
                open={openMerge}
                message={mergeMsg}
                severity="error"
                action={
                    <Button variant="contained" onClick={handleShow}>
                        View Conflicts
                    </Button>
                }
            >
            </Snackbar>

            <Dialog  
                open={show}
                onClose={handleClose} 
                fullWidth={true} 
                maxWidth={'lg'}
                style={{minWidth: "400px"}}
            >
                <DialogTitle id="simple-dialog-title">Resolve these conflicts!</DialogTitle>
                <DialogContent style={{flexDirection:"column"}}>
                    <DialogContentText>Here, mark all files you have finished merging as done to "ADD" them to complete the merge</DialogContentText>
                    <DialogContentText>{length} conflicted files:</DialogContentText>
                    {
                        statusSummary?
                        <List>
                            {
                                statusSummary.conflicted.map((key) => {
                                    console.log(key, "KEY")
                                    return(
                                        <ListItem key={key} >
                                            <ListItemText primary={key} secondary={
                                                <Button onClick={() => handleAdd(key)}>Resolve Merge</Button>   
                                            }/>
                                            
                                        </ListItem>                                        
                                    )
                                })
                            }
                        </List>
                        :
                        null
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </div>

        
    )
}