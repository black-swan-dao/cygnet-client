import createAuth0Client from "@auth0/auth0-spa-js"
import { writable, get } from 'svelte/store';
import { loadData } from "$lib/sanity.js"
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "$lib/cygnet-config.js"
import { voteMultipliers } from "$lib/voting.js"

const DISCORD_PREFIX = "oauth2|discord|"
export let auth0 = null;
export let isAuthenticated = false;
export const profile = writable({})
export const profileMeta = writable({})

export const configureAuthClient = async () => {
    auth0 = await createAuth0Client({
        domain: AUTH0_DOMAIN,
        client_id: AUTH0_CLIENT_ID,
        connection: 'discord',
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
    profile.set(await auth0.getUser())
    let sanityProfile = {}
    try {
        sanityProfile = await loadData(
            "*[_type == 'user' && _id == $sub][0]",
            { sub: get(profile).sub.replace(DISCORD_PREFIX, "") }
        )
        const multiplierRole = sanityProfile.roles.find(r => Object.keys(voteMultipliers).includes(r))
        sanityProfile.voteMultiplier = voteMultipliers[multiplierRole] || 1
        sanityProfile.voteMultiplierRole = multiplierRole || false
    } catch (e) {
        console.log('Error loading profile from Sanity:', e);
        return
    }
    profileMeta.set(sanityProfile)
}

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
