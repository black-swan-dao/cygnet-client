import { writable, derived } from 'svelte/store'
export const voteCredits = writable(100)
export const voteAllocation = writable({})
export const TOTAL_VOICE_CREDITS = 100

export const voteMultipliers = {
    '🦠 TheSphere': 3,
    '🍇 Artist': 3,
    '🍇 Presenter': 2,
    '🍇 Cultural Pro': 2,
    '🍇 Invested Audience': 2,
    '🍇 Friends of The Sphere': 1
}

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
            result = result + Math.sqrt(Math.abs(value))
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