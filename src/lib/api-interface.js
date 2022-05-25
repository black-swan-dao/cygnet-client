import { getTokenSilently } from "$lib/authentication.js"


export const uploadImage = file => {
    return new Promise(async (resolve, reject) => {
        let formData = new FormData()
        if (file) {
            formData.append("mainImage", file, file.name)
        }
        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow",
        }
        const response = await fetch("https://graphics.eyebeam.dev", requestOptions)
        // const response = await fetch("/api/upload-image", requestOptions)
        if (response.ok) {
            const responseData = await response.json()
            resolve(responseData)
            return
        }
        resolve({})
    })
}

export const saveProposal = messageBody => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Set message options
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    message: messageBody,
                    authorization: token
                }),
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/save-proposal", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const submitProposal = async proposal => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            proposalId: proposal._id,
            authorization: token
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/submit-proposal", requestOptions)
        const responseData = await response.json()
    } catch (e) {
        console.log(e.message)
    }
}

export const getVote = cycleId => {
    console.log("!!! GET VOTE", cycleId)
    return new Promise(async (resolve, reject) => {
        // Get token
        const token = await getTokenSilently()
        // Set message options
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({
                cycleId: cycleId,
                authorization: token
            })
        }
        // Send message
        const response = await fetch("/api/get-vote", requestOptions)
        const responseData = await response.json()
        let tempVoteAllocation = {}
        if (responseData.voteAllocation && Array.isArray(responseData.voteAllocation)) {
            responseData.voteAllocation.forEach(v => {
                tempVoteAllocation[v.proposal._ref] = v.voteCredits
            })
        }
        resolve({ lastSavedAt: responseData._updatedAt, submitted: responseData.submitted, votes: tempVoteAllocation })
    })
}

export const setVote = async (cycleId, voteAllocation, voteMultiplier, voteMultiplierRole, submitted) => {
    return new Promise(async (resolve, reject) => {
        // Get token
        const token = await getTokenSilently()
        // Set message options
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({
                cycleId: cycleId,
                voteAllocation: voteAllocation,
                voteMultiplier: voteMultiplier,
                voteMultiplierRole: voteMultiplierRole,
                authorization: token
            })
        }
        // Send message
        const response = await fetch("/api/set-vote", requestOptions)
        const responseData = await response.json()
        resolve(responseData)
    })
}

export const submitVote = async (cycleId) => {
    return new Promise(async (resolve, reject) => {
        // Get token
        const token = await getTokenSilently()
        // Set message options
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({
                cycleId: cycleId,
                authorization: token
            })
        }
        // Send message
        const response = await fetch("/api/submit-vote", requestOptions)
        const responseData = await response.json()
        resolve(responseData)
    })
}

export const unsubmitVote = async (cycleId) => {
    return new Promise(async (resolve, reject) => {
        // Get token
        const token = await getTokenSilently()
        // Set message options
        const requestOptions = {
            method: "POST",
            redirect: "follow",
            body: JSON.stringify({
                cycleId: cycleId,
                authorization: token
            })
        }
        // Send message
        const response = await fetch("/api/unsubmit-vote", requestOptions)
        const responseData = await response.json()
        resolve(responseData)
    })
}

export const connectEthAddress = messageBody => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Set message options
            const requestOptions = {
                method: "POST",
                body: JSON.stringify({
                    message: messageBody,
                    authorization: token
                }),
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/connect-eth-address", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const deleteProposal = async proposal => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            proposalId: proposal._id,
            authorization: token
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/delete-proposal", requestOptions)
        const responseData = await response.json()
        console.log(responseData)
    } catch (e) {
        console.log(e.message)
    }
}

export const triggerCount = async cycleId => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            cycleId: cycleId,
            authorization: token
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/count-votes", requestOptions)
        const responseData = await response.json()
        console.log(responseData)
    } catch (e) {
        console.log(e.message)
    }
}
