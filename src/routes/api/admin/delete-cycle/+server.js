import { error } from '@sveltejs/kit';
import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../../_jwt.js'
import { authorizedClient } from '../../_authorizedClient.js';

export const POST = async (request) => {
    // Parse message body
    const body = await request.request.json()
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
    if (!user.roles.includes('cygnet-admin')) throw error(403, 'Access denied');
    // Go ahead and delete the cycle
    const res = await authorizedClient.delete(body.cycleId)
    // Return the result
    return new Response(JSON.stringify(res));
};