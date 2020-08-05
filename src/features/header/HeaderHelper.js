import React, {useState, useEffect} from "react"

// REDUX
import { useSelector, useDispatch } from "react-redux"
import { stageSetStatusSummary } from "../../store/ducks"

//Components
import { 
    Button,
    Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions 
} from "@material-ui/core"

// Services
import { 
    helperGitFetch, 
    helperGitPull,
    helperGitPush
 } from "../../services"

// Styles
import { HeaderItem } from './HeaderStyles'
import { GitError } from "simple-git"



export const FecthOrPull = () => {
    const dirPath = useSelector(state => state.repo.path);
    const statusSummary = useSelector(state=> state.stage.statusSummary)

    const [err, setErr] = useState(false)
    const [errMsg, setErrMsg] = useState("")

    const dispatch = useDispatch()

    useEffect( () => {
        handleFetchAction()
    }, [])

    const handleFetchAction =() => {
        helperGitFetch(dirPath).then((status) => {
            console.log(status)
            dispatch(stageSetStatusSummary(status))
        })
    }
    
    const handlePullAction = () => {

        helperGitPull(dirPath).then((status) => {
            console.log(status)
        }).catch((err) => {
            setErrMsg(err.message)
            setErr(true)
        })
        handleFetchAction();
    }

    const handlePushAction = (evt) => {
        console.log("PUSHING")
        helperGitPush(dirPath)
            .then((response) => {
                console.log(response)
                setErrMsg("Push to " + response.repo + " successful.")
                setErr(true)
                
            })
            .catch((err) => {
                if (err instanceof GitError){
                    console.log("CAUGHT")
                    setErrMsg(err.message)
                    setErr(true)
                }
                else{
                    throw err
                }
            })
        handleFetchAction();
    }

    const handleErrClose = () => {
        setErr(false)
    }
    
    if (statusSummary && statusSummary.behind > 0) {
        return (
            <div>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handlePullAction}>
                    Pull
                </Button>
                <Dialog  
                    open={err}
                    onClose={handleErrClose} 
                >
                    <DialogTitle id="simple-dialog-title">Error on Pull</DialogTitle>
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

    if (statusSummary && statusSummary.ahead > 0) {
        return (
            <div>
                <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handlePushAction}>
                    Push
                </Button>
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
    

    return (
        <Button style={{...HeaderItem, borderWidth: "0 1px 0 0"}} onClick={handleFetchAction}>
            Fetch Remote
        </Button>
    )
}