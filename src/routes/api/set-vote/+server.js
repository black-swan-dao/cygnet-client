import { error } from '@sveltejs/kit';
import { authorizedClient } from '../_authorizedClient.js';
import { loadData } from "$lib/sanity.js"
import { nanoid } from 'nanoid';
import { verifyToken } from '../_jwt.js'

export const POST = async (request) => {
  console.log('Setting vote...')
  // Parse message body
  const body = await request.request.json()
  console.log('body', body)
  // Verify and decode JWT
  const decodedToken = await verifyToken(body.authorization)
  if (!decodedToken.sub) throw error(403, 'Error');

  const userId = decodedToken.sub.replace(body.prefix, "")

  const currentDoc = await loadData("*[_type == 'vote' && user._ref == $userId && cycle._ref == $cycleId][0]", { userId: userId + '-' + import.meta.env.VITE_CYGNET_ID, cycleId: body.cycleId })
  let res = currentDoc

  if (!currentDoc.submitted) {
    const doc = {
      _type: 'vote',
      _id: userId + '-' + body.cycleId,
      instance: {
        _type: "reference",
        _ref: import.meta.env.VITE_CYGNET_ID,
      },
      cycle: {
        _type: "reference",
        _ref: body.cycleId,
      },
      user: {
        _type: "reference",
        _ref: userId + '-' + import.meta.env.VITE_CYGNET_ID,
      },
      voteMultiplier: body.voteMultiplier,
      voteMultiplierRole: body.voteMultiplierRole,
      submitted: false,
      voteAllocation: []
    }

    for (const [key, value] of Object.entries(body.voteAllocation)) {
      doc.voteAllocation.push({
        _key: nanoid(),
        _type: "voteAllocation",
        voteCredits: value,
        effectiveVotes: Math.sqrt(Math.abs(value)) * (body.voteMultiplier || 1) * (value > 0 ? 1 : -1),
        proposal: {
          _type: "reference",
          _ref: key,
        }
      })
    }
    res = await authorizedClient.createOrReplace(doc)
  }

  console.log('res', res)

  // Return results
  return new Response(JSON.stringify(res));
};