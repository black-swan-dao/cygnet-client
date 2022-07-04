import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../../_jwt.js'
import { authorizedClient } from '../../_authorizedClient.js';

export const post = async (event) => {
    // Parse message body
    const body = await event.request.json()
    // Verify and decode JWT
    console.log('body.authorization', body.authorization)
    const decodedToken = await verifyToken(body.authorization)
    // Get user ID from token
    console.log('body.prefix', body.prefix)
    const userId = decodedToken.sub.replace(body.prefix, "")
    // Get user from Sanity
    const user = await loadData("*[_type == 'user' && _id == $id][0]", { id: userId + '-' + import.meta.env.VITE_CYGNET_ID })
    console.log('user', user)
    // User is not admin, abort
    if (!user.roles.includes('cygnet-admin')) {
        return {
            status: 403
        };
    }
    const message = body.message
    console.log(message)

    console.log(body.instanceId)

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

    console.log(result)

    return {
        body: JSON.stringify(result)
    };
};