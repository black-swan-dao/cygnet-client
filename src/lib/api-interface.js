import { getTokenSilently, CONNECTION_PREFIX } from "$lib/authentication.js"
import { instance } from "$lib/data.js"
import { voteMultiplier } from "$lib/authentication"
import { get } from 'svelte/store'

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
        const response = await fetch("https://img.cygnet-service.com", requestOptions)
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
                    authorization: token,
                    prefix: get(CONNECTION_PREFIX)
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
            authorization: token,
            prefix: get(CONNECTION_PREFIX)
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

export const unsubmitProposal = async proposal => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            proposalId: proposal._id,
            authorization: token,
            prefix: get(CONNECTION_PREFIX)
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/unsubmit-proposal", requestOptions)
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
                authorization: token,
                prefix: get(CONNECTION_PREFIX)
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

export const setVote = async (cycleId, voteAllocation, voteMultiplier, voteMultiplierRole) => {
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
                authorization: token,
                prefix: get(CONNECTION_PREFIX)
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
                authorization: token,
                prefix: get(CONNECTION_PREFIX)
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
                authorization: token,
                prefix: get(CONNECTION_PREFIX)
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
                    authorization: token,
                    prefix: get(CONNECTION_PREFIX)
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
            authorization: token,
            prefix: get(CONNECTION_PREFIX)
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

// ADMIN
export const triggerCount = async cycleId => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Prepare message body
            const rawBody = JSON.stringify({
                cycleId: cycleId,
                authorization: token,
                prefix: get(CONNECTION_PREFIX),
            })
            // Set message options
            const requestOptions = {
                method: "POST",
                body: rawBody,
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/admin/count-votes", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const saveAbout = message => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Prepare message body
            const rawBody = JSON.stringify({
                instanceId: get(instance)._id,
                message: message,
                prefix: get(CONNECTION_PREFIX),
                authorization: token
            })
            // Set message options
            const requestOptions = {
                method: "POST",
                body: rawBody,
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/admin/save-about", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const saveCycle = async message => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Prepare message body
            const rawBody = JSON.stringify({
                instanceId: get(instance)._id,
                message: message,
                prefix: get(CONNECTION_PREFIX),
                authorization: token
            })
            // Set message options
            const requestOptions = {
                method: "POST",
                body: rawBody,
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/admin/save-cycle", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const deleteCycle = async cycle => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            cycleId: cycle._id,
            authorization: token,
            prefix: get(CONNECTION_PREFIX)
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/admin/delete-cycle", requestOptions)
        const responseData = await response.json()
        console.log(responseData)
    } catch (e) {
        console.log(e.message)
    }
}

export const saveResource = async message => {
    return new Promise(async (resolve, reject) => {
        try {
            // Get token
            const token = await getTokenSilently()
            // Prepare message body
            const rawBody = JSON.stringify({
                instanceId: get(instance)._id,
                message: message,
                prefix: get(CONNECTION_PREFIX),
                authorization: token
            })
            // Set message options
            const requestOptions = {
                method: "POST",
                body: rawBody,
                redirect: "follow",
            }
            // Send message
            const response = await fetch("/api/admin/save-resource", requestOptions)
            const responseData = await response.json()
            resolve(responseData)
        } catch (e) {
            console.log(e.message)
            reject(e.message)
        }
    })
}

export const deleteResource = async resource => {
    try {
        // Get token
        const token = await getTokenSilently()
        // Prepare message body
        const rawBody = JSON.stringify({
            resourceId: resource._id,
            authorization: token,
            prefix: get(CONNECTION_PREFIX)
        })
        // Set message options
        const requestOptions = {
            method: "POST",
            body: rawBody,
            redirect: "follow",
        }
        // Send message
        const response = await fetch("/api/admin/delete-resource", requestOptions)
        const responseData = await response.json()
        console.log(responseData)
    } catch (e) {
        console.log(e.message)
    }
}
