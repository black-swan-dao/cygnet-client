import { error } from '@sveltejs/kit';
import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../../_jwt.js'
import { v4 as uuidv4 } from 'uuid'
import { authorizedClient } from '../../_authorizedClient.js';

const slugify = str => str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-")

export const POST = async (request) => {
    // Parse message body
    const body = await request.request.json()
    // Verify and decode JWT
    const decodedToken = await verifyToken(body.authorization)
    // Get user ID from token
    const userId = decodedToken.sub.replace(body.prefix, "")
    // Get user from Sanity
    const user = await loadData("*[_type == 'user' && _id == $id][0]", { id: userId + '-' + import.meta.env.VITE_CYGNET_ID })
    // User is not admin, abort
    if (!user.roles.includes('cygnet-admin')) throw error(403, 'Not admin');

    const message = body.message

    // const currentDoc = await loadData("*[_type == 'cycle' && _id == $id][0]", { id: message.id })

    let newDoc = {
        _id: message.id || uuidv4(),
        _type: "cycle",
        title: message.title,
        instance: {
            _ref: body.instanceId,
            _type: "reference"
        },
        textLanding: {
            _type: "simpleEditor",
            content: message.textLanding
        },
        textProposal: {
            _type: "simpleEditor",
            content: message.textProposal
        },
        textVote: {
            _type: "simpleEditor",
            content: message.textVote
        },
        textResult: {
            _type: "simpleEditor",
            content: message.textResult
        },
        discordRole: message.role,
        start: message.cycleStart,
        midpoint: message.cycleMidpoint,
        end: message.cycleEnd,
        phase: message.phase,
        slug: {
            _type: "slug",
            current: slugify(message.title)
        },
    }

    // Finally, write to the database
    const result = await authorizedClient.createOrReplace(newDoc)
    console.log(result)
    // Return results
    return new Response(JSON.stringify(result));
};