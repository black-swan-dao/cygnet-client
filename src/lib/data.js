import { writable, derived, get } from 'svelte/store';
import { loadData, client } from "$lib/sanity.js"
import { currentCycle } from './cycles';
import { profileMeta } from './authentication';
import { goto } from '$app/navigation';
import _ from 'lodash'

export const proposals = writable([])
export const users = writable([])
export const resources = writable([])
export const votes = writable([])
export const cycles = writable([])
export const results = writable([])
export const general = writable([])

export const proposalsInCycle = derived(
    [proposals, currentCycle],
    ([$proposals, $currentCycle]) => {
        if ($proposals.length === 0) return []
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

export const proposalsInCycleByUser = derived(
    [proposalsInCycle, profileMeta],
    ([$proposalsInCycle, $profileMeta]) => {
        if ($proposalsInCycle.length === 0) return []
        return $proposalsInCycle.filter(p => {
            if (!p.authors || p.authors.length === 0) return false
            const authorIds = _.get(p, "authors", []).map(a => a._id)
            const isAuthor = authorIds.includes($profileMeta._id)
            if (isAuthor) return true
        })
    }
);

export const usersInCycle = derived(
    [users, currentCycle],
    ([$users, $currentCycle]) => {
        if ($users.length === 0) return []
        if (!$currentCycle.discordRole || $currentCycle.discordRole === '') return $users
        return $users.filter(u => _.get(u, "roles", []).includes($currentCycle.discordRole))
    }
);

export const resourcesInCycle = derived(
    [resources, currentCycle],
    ([$resources, $currentCycle]) => {
        if ($resources.length === 0) return []
        return $resources.filter(p => _.get(p, "cycle._id", "") === $currentCycle._id)
    }
);

export const getData = () => {
    return new Promise(async (resolve, reject) => {
        cycles.set(await loadData('*[_type == "cycle"]'))
        proposals.set(await loadData('*[_type == "proposal"]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}|order(_updatedAt desc) '))
        users.set(await loadData('*[_type == "user"]'))
        resources.set(await loadData('*[_type == "resource"]{..., cycle->{...}}'))
        votes.set(await loadData('*[_type == "vote"]{..., cycle->{...}, user->{...}}'))
        results.set(await loadData('*[_type == "result"]{..., cycle->{...}, result[]{..., proposal->{..., authors[]->{...}}}}'))
        general.set(await loadData('*[_id == "general"]{...}[0]'))
        resolve()
    })
}

export const listenForPhaseChanges = () => {
    client.listen("*[_type == 'cycle']").subscribe(update => {
        if (update.result._id == get(currentCycle)._id) {
            if (update.result.phase !== get(currentCycle).phase) {
                goto(`/${update.result.phase}`)
            }
            currentCycle.set(update.result)
        }
        setTimeout(async () => {
            cycles.set(await loadData('*[_type == "cycle"]'))
        }, 1000)
    })
}

export const listenForProposalChanges = () => {
    client.listen("*[_type == 'proposal']{..., authors[]->{...}, resources[]->{...}, cycle->{...}}").subscribe(update => {
        setTimeout(async () => {
            proposals.set(await loadData('*[_type == "proposal"]{..., authors[]->{...}, resources[]->{...}, cycle->{...}}|order(_updatedAt desc) '))
        }, 1000)
    })
}