import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../_jwt.js'

export async function POST({ request }) {
  const body = await request.json()
  const decodedToken = await verifyToken(body.authorization)
  if (decodedToken.sub) {
    const userId = decodedToken.sub.replace(body.prefix, "") + '-' + import.meta.env.VITE_CYGNET_ID
    const currentVoteAllocation = await loadData("*[_type == 'vote' && user._ref == $userId && cycle._ref == $cycleId][0]", { userId: userId, cycleId: body.cycleId })
    return {
      body: JSON.stringify(currentVoteAllocation)
    };
  }
  return {
    body: "Error"
  };
};