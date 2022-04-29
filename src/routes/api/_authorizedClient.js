import sanityClient from '@sanity/client'
import { SANITY_ID, SANITY_TOKEN } from "$lib/cygnet-config.js"

export const authorizedClient = sanityClient({
    projectId: SANITY_ID,
    dataset: 'production',
    apiVersion: '2022-02-01',
    token: SANITY_TOKEN,
    useCdn: false
})