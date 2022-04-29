import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../_jwt.js'
const DISCORD_PREFIX = "oauth2|discord|"

export const post = async (event) => {
  const body = await event.request.json()
  const decodedToken = await verifyToken(body.authorization)
  if (decodedToken.sub) {
    const userId = decodedToken.sub.replace(DISCORD_PREFIX, "")
    const currentVoteAllocation = await loadData("*[_type == 'vote' && user._ref == $userId && cycle._ref == $cycleId][0]", { userId: userId, cycleId: body.cycleId })
    return {
      body: JSON.stringify(currentVoteAllocation)
    };
  }
  return {
    body: "Error"
  };
};