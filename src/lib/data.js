import { writable, derived, get } from 'svelte/store';
import { loadData, client } from "$lib/sanity.js"
import { currentCycle } from '$lib/cycles.js';
import { goto } from '$app/navigation';
import _ from 'lodash'

export const CYGNET_ID = import.meta.env.VITE_CYGNET_ID

export const proposals = writable([])
export const users = writable([])
export const resources = writable([])
export const votes = writable([])
export const cycles = writable([])
export const results = writable([])
export const instance = writable([])

export const proposalsInCycle = derived(
    [proposals, currentCycle],
    ([$proposals, $currentCycle]) => {
        if ($proposals.length === 0) return []
        if (!$currentCycle) return []
        return $proposals.filter(p => _.get(p, "cycle._id", "") === $currentCycle._id)
    }
);

export const submittedProposalsInCycle = derived(
    [proposalsInCycle],
    ([$proposalsInCycle,]) => {
        if ($proposalsInCycle.length === 0) return []
        return $proposalsInCycle.filter(p => p.submitted)
    }
);

// export const proposalsInCycleByUser = derived(
//     [proposalsInCycle, profileMeta],
//     ([$proposalsInCycle, $profileMeta]) => {
//         if (!$profileMeta || $proposalsInCycle.length === 0) return []
//         return $proposalsInCycle.filter(p => {
//             if (!p.authors || p.authors.length === 0) return false
//             const authorIds = _.get(p, "authors", []).map(a => a._id)
//             const isAuthor = authorIds.includes($profileMeta._id)
//             if (isAuthor) return true
//         })
//     }
// );

export const usersInCycle = derived(
    [users, currentCycle],
    ([$users, $currentCycle]) => {
        if ($users.length === 0) return []
        if (!$currentCycle) return []
        if (!$currentCycle.discordRole || $currentCycle.discordRole === '') return $users
        return $users.filter(u => _.get(u, "roles", []).includes($currentCycle.discordRole))
    }
);

export const resourcesInCycle = derived(
    [resources, currentCycle],
    ([$resources, $currentCycle]) => {
        if ($resources.length === 0) return []
        if (!$currentCycle) return []
        return $resources.filter(p => _.get(p, "cycle._id", "") === $currentCycle._id)
    }
);

export const getData = () => {
    return new Promise(async (resolve, reject) => {
        instance.set(await loadData('*[_type == "instance" && _id == $cygnetId]{...}[0]', { cygnetId: CYGNET_ID }))
        cycles.set(await loadData('*[_type == "cycle" && instance._ref == $cygnetId]', { cygnetId: CYGNET_ID }))
        proposals.set(await loadData('*[_type == "proposal" && instance._ref == $cygnetId]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}|order(_updatedAt desc)', { cygnetId: CYGNET_ID }))
        users.set(await loadData('*[_type == "user" && instance._ref == $cygnetId]', { cygnetId: CYGNET_ID }))
        resources.set(await loadData('*[_type == "resource" && instance._ref == $cygnetId]{..., cycle->{...}}', { cygnetId: CYGNET_ID }))
        votes.set(await loadData('*[_type == "vote" && instance._ref == $cygnetId]{..., cycle->{...}, user->{...}}', { cygnetId: CYGNET_ID }))
        results.set(await loadData('*[_type == "result" && instance._ref == $cygnetId]{..., cycle->{...}, result[]{..., proposal->{..., authors[]->{...}}}}', { cygnetId: CYGNET_ID }))
        resolve()
    })
}

export const listenForPhaseChanges = () => {
    client.listen("*[_type == 'cycle' && instance._ref == $cygnetId]", { cygnetId: CYGNET_ID }).subscribe(update => {
        if (update.result._id == get(currentCycle)._id) {
            if (update.result.phase !== get(currentCycle).phase) {
                goto(`/${update.result.phase}`)
            }
            currentCycle.set(update.result)
        }
        setTimeout(async () => {
            cycles.set(await loadData("*[_type == 'cycle' && instance._ref == $cygnetId]", { cygnetId: CYGNET_ID }))
        }, 1000)
    })
}

export const listenForProposalChanges = () => {
    client.listen("*[_type == 'proposal' && instance._ref == $cygnetId]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}", { cygnetId: CYGNET_ID }).subscribe(update => {
        setTimeout(async () => {
            proposals.set(await loadData('*[_type == "proposal" && instance._ref == $cygnetId]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}|order(_updatedAt desc)', { cygnetId: CYGNET_ID }))
        }, 1000)
    })
}