import createAuth0Client from "@auth0/auth0-spa-js"
import { writable, derived, get } from 'svelte/store';
import { loadData } from "$lib/sanity.js"
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "$lib/cygnet-config.js"
import { currentCycle } from '$lib/cycles.js';
import { CYGNET_ID } from "$lib/data.js";

const DISCORD_PREFIX = "oauth2|discord|"
const SLACK_PREFIX = "oauth2|slack|"
export const CONNECTION_PREFIX = writable('')

export let auth0 = null;
export let isAuthenticated = false;
export const profile = writable({})
export const profileMeta = writable({})
export const isAdmin = writable(false)

export const configureAuthClient = async connection => {

    CONNECTION_PREFIX.set(connection === 'slack' ? SLACK_PREFIX : DISCORD_PREFIX)

    auth0 = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        client_id: AUTH0_CLIENT_ID,
        connection: connection, // connection: 'discord'
        audience: 'https://' + AUTH0_DOMAIN + '/api/v2/'
    })
    isAuthenticated = await auth0.isAuthenticated()
}

export const handleRedirectCallback = async () => {
    await auth0.handleRedirectCallback()
    isAuthenticated = await auth0.isAuthenticated()
    window.history.replaceState({}, document.title, "/")
}

export const setProfile = async () => {
    return new Promise(async (resolve, reject) => {
        profile.set(await auth0.getUser())
        let sanityProfile = {}
        try {
            sanityProfile = await loadData(
                "*[_type == 'user' && _id == $sub][0]",
                { sub: get(profile).sub.replace(get(CONNECTION_PREFIX), "") + '-' + CYGNET_ID }
            )
            sanityProfile.roles.includes('cygnet-admin') ? isAdmin.set(true) : isAdmin.set(false)
        } catch (e) {
            console.log('Error loading profile from Sanity:', e);
            reject(e.message)
        }
        profileMeta.set(sanityProfile)
        resolve()
    })
}

export const voteMultiplier = derived(
    [profileMeta, currentCycle],
    ([$profileMeta, $currentCycle]) => {
        let vM = {
            role: 'Default',
            weight: 1
        }
        if (!$currentCycle.useVotingWeights || !$currentCycle.voteWeights || !$profileMeta || !$profileMeta.roles) return vM
        $currentCycle.voteWeights.forEach(vW => {
            console.log(vW)
            if ($profileMeta.roles.includes(vW.role)) {
                vM = vW
            }
        })
        return vM
    }
);

export const login = async () => {
    await auth0.loginWithRedirect({
        redirect_uri: window.location.origin,
    })
}

export const logout = () => {
    auth0.logout({
        returnTo: window.location.origin,
    })
}

export const getTokenSilently = async () => {
    const token = await auth0.getTokenSilently()
    return token
}
