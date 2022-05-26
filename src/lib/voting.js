import { writable, derived, get } from 'svelte/store'
import { voteMultiplier } from '$lib/authentication'
export const voteCredits = writable(100)
export const voteAllocation = writable({})
export const TOTAL_VOICE_CREDITS = 100

export const remainingVoiceCredits = derived(
    voteAllocation,
    $voteAllocation => {
        let result = 100
        for (const [key, value] of Object.entries($voteAllocation)) {
            result = result - Math.abs(value)
        }
        return result
    }
);

export const usedVoiceCredits = derived(
    voteAllocation,
    $voteAllocation => {
        let result = 0
        for (const [key, value] of Object.entries($voteAllocation)) {
            result = result + Math.abs(value)
        }
        return result
    }
);

export const totalEffectiveVotes = derived(
    voteAllocation,
    $voteAllocation => {
        let result = 0
        for (const [key, value] of Object.entries($voteAllocation)) {
            result = result + Math.sqrt(Math.abs(value)) * get(voteMultiplier).weight
        }
        return result
    }
);

export const updateVoteAllocation = (proposalId, voiceCredits) => {
    voteAllocation.update(vA => {
        vA[proposalId] = voiceCredits
        return vA
    })
}

export const setVoteAllocation = newVoteAllocation => {
    let tempVoteAllocation = {}
    newVoteAllocation.forEach(v => {
        tempVoteAllocation[v.proposal._ref] = v.voteCredits
    })
    voteAllocation.set(tempVoteAllocation)
}