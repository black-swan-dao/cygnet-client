import { verifyToken } from '../_jwt.js'
import { authorizedClient } from '../_authorizedClient.js';
const DISCORD_PREFIX = "oauth2|discord|"

export const post = async (event) => {
    const body = await event.request.json()
    const decodedToken = await verifyToken(body.authorization)
    const userId = decodedToken.sub.replace(DISCORD_PREFIX, "")
    const res = await authorizedClient
        .patch(userId)
        .set({ ethAddress: body.message.ethAddress })
        .commit()
    console.log(res)
    return {
        body: JSON.stringify(res)
    };
};