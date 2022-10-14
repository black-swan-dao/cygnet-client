import { error } from '@sveltejs/kit';
import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../_jwt.js'

export const POST = async (request) => {
  // Parse message body
  const body = await request.request.json()
  // Verfiy and decode JWT
  const decodedToken = await verifyToken(body.authorization)
  if (decodedToken.sub) {
    const userId = decodedToken.sub.replace(body.prefix, "") + '-' + import.meta.env.VITE_CYGNET_ID
    const currentVoteAllocation = await loadData("*[_type == 'vote' && user._ref == $userId && cycle._ref == $cycleId][0]", { userId: userId, cycleId: body.cycleId })
    // Return results
    return new Response(JSON.stringify(currentVoteAllocation));
  }
  throw error(403, 'Error');
};