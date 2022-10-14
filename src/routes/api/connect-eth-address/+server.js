import { verifyToken } from '../_jwt.js'
import { authorizedClient } from '../_authorizedClient.js';

export const POST = async (request) => {
    // Parse message body
    const body = await request.request.json()
    const decodedToken = await verifyToken(body.authorization)
    const userId = decodedToken.sub.replace(body.prefix, "")
    const res = await authorizedClient
        .patch(userId)
        .set({ ethAddress: body.message.ethAddress })
        .commit()
    console.log(res)
    // Return results
    return new Response(JSON.stringify(res));
};