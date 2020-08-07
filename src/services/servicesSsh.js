import NodeRSA from "node-rsa"

export const generateSshGit = (path, email) => {
    const key = new NodeRSA({b:4096 })
    return 
}
