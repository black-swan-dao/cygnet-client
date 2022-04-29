import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../_jwt.js'
import { authorizedClient } from '../_authorizedClient.js';
const DISCORD_PREFIX = "oauth2|discord|"

export const post = async (event) => {
    // Parse message body
    const body = await event.request.json()
    // Verfiy and decode JWT
    const decodedToken = await verifyToken(body.authorization)
    // Get user ID from token
    const userId = decodedToken.sub.replace(DISCORD_PREFIX, "") + '-' + import.meta.env.VITE_CYGNET_ID
    // Get proposal
    const proposal = await loadData("*[_type == 'proposal' && _id == $id][0]", { id: body.proposalId })
    const authorIds = proposal.authors.map(author => author._ref)
    let res = {}
    if (authorIds.includes(userId)) {
        res = await authorizedClient.delete(body.proposalId)
    }
    return {
        body: JSON.stringify(res)
    };
};