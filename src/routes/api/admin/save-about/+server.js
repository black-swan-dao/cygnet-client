import { error } from '@sveltejs/kit';
import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../../_jwt.js'
import { authorizedClient } from '../../_authorizedClient.js';

export const POST = async (request) => {
    // Parse message body
    const body = await request.request.json()
    // Verify and decode JWT
    const decodedToken = await verifyToken(body.authorization)
    // Get user ID from token
    const userId = decodedToken.sub.replace(body.prefix, "")
    // Get user from Sanity
    const user = await loadData("*[_type == 'user' && _id == $id][0]", { id: userId + '-' + import.meta.env.VITE_CYGNET_ID })
    // User is not admin, abort
    if (!user.roles.includes('cygnet-admin')) throw error(403, 'Not admin');

    const message = body.message

    // Patch the doc
    if (message.bigLogo && message.bigLogo.asset) {
        await authorizedClient
            .patch(body.instanceId) // Document ID to patch
            .set({ bigLogo: message.bigLogo })
            .commit()
    }

    if (message.smallLogo && message.smallLogo.asset) {
        await authorizedClient
            .patch(body.instanceId) // Document ID to patch
            .set({ smallLogo: message.smallLogo })
            .commit()
    }

    let result = await authorizedClient
        .patch(body.instanceId) // Document ID to patch
        .set({ mainColor: message.mainColor })
        .set({ highlightColor: message.highlightColor })
        .set({ preLoginText: message.preLoginText })
        .set({ landingPageText: message.landingPageText })
        .commit() // Perform the patch and return a promise

    // Return the result
    return new Response(JSON.stringify(result));
};