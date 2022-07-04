import { authorizedClient } from '../_authorizedClient.js';
import { verifyToken } from '../_jwt.js'

export const post = async (event) => {
    const body = await event.request.json()
    const decodedToken = await verifyToken(body.authorization)
    if (!decodedToken.sub) {
        return {
            body: "error"
        }
    }
    const userId = decodedToken.sub.replace(body.prefix, "")

    const res = await authorizedClient
        .patch(userId + '-' + body.cycleId)
        .set({ submitted: true })
        .commit()

    return {
        body: JSON.stringify(res)
    }
};