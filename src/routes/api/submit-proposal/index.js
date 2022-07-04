import { loadData } from "$lib/sanity.js"
import get from 'lodash/get.js'
import { verifyToken } from '../_jwt.js'
import { authorizedClient } from '../_authorizedClient.js';

export const post = async (event) => {
  const body = await event.request.json()
  // Verfiy and decode JWT
  const decodedToken = await verifyToken(body.authorization)
  // Get user ID from token
  const userId = decodedToken.sub.replace(body.prefix, "")
  // Get proposal
  const proposal = await loadData("*[_type == 'proposal' && _id == $id][0]", { id: body.proposalId })
  const authorIds = proposal.authors.map(author => author._ref)
  let res = {}
  if (authorIds.includes(userId + '-' + get(proposal, 'instance._ref', ''))) {
    res = await authorizedClient
      .patch(body.proposalId)
      .set({ submitted: true })
      .commit()
  }
  return {
    body: JSON.stringify(res)
  };
};