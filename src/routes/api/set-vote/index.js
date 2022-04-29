import { authorizedClient } from '../_authorizedClient.js';
import { nanoid } from 'nanoid';
import { verifyToken } from '../_jwt.js'
const DISCORD_PREFIX = "oauth2|discord|"

export const post = async (event) => {
  const body = await event.request.json()
  const decodedToken = await verifyToken(body.authorization)
  if (!decodedToken.sub) {
    return {
      body: "error"
    }
  }
  const userId = decodedToken.sub.replace(DISCORD_PREFIX, "")

  const doc = {
    _type: 'vote',
    _id: userId + '-' + body.cycleId,
    cycle: {
      _type: "reference",
      _ref: body.cycleId,
    },
    user: {
      _type: "reference",
      _ref: userId,
    },
    voteMultiplier: body.voteMultiplier || 1,
    voteMultiplierRole: body.voteMultiplierRole || "Audience",
    submitted: body.submitted,
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

  const res = await authorizedClient.createOrReplace(doc)
  return {
    body: JSON.stringify(res)
  }
};