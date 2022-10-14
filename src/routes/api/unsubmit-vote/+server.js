import { error } from '@sveltejs/kit';
import { authorizedClient } from '../_authorizedClient.js';
import { verifyToken } from '../_jwt.js'

export const POST = async (request) => {
    // Parse message body
    const body = await request.request.json()
    const decodedToken = await verifyToken(body.authorization)
    if (!decodedToken.sub) throw error(403, 'Access denied');

    const userId = decodedToken.sub.replace(body.prefix, "")

    const res = await authorizedClient
        .patch(userId + '-' + body.cycleId)
        .set({ submitted: false })
        .commit()

    // Return results
    return new Response(JSON.stringify(res));
};