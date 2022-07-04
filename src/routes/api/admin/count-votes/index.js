import { loadData, } from "$lib/sanity.js"
import groupBy from "lodash/groupBy.js"
import orderBy from "lodash/orderBy.js"
import { v4 as uuidv4 } from 'uuid'
import sanityClient from '@sanity/client'
import { SANITY_ID, SANITY_TOKEN } from "$lib/cygnet-config.js"

export const authorizedClient = sanityClient({
    projectId: SANITY_ID,
    dataset: 'production',
    apiVersion: '2022-02-01', // use a UTC date string
    token: SANITY_TOKEN,
    useCdn: false // `false` if you want to ensure fresh data
})

export const post = async (event) => {
    const body = await event.request.json()
    const cycleId = body.cycleId
    if (cycleId) {
        // Prepare inital result document
        const resultObject = {
            _id: "result_" + cycleId,
            _type: "result",
            instance: {
                _ref: import.meta.env.VITE_CYGNET_ID,
                _type: "reference"
            },
            cycle: {
                _ref: cycleId,
                _type: "reference"
            },
            result: [],
            votesByUser: [],
            totalVoteCredits: 0,
            totalEffectiveVotes: 0,
            numberOfParticipants: 0,
        }
        // Get all resources for this cycle
        const resources = await loadData("*[_type == 'resource' && cycle._ref == $cycleId]", { cycleId: cycleId })
        // Get all vote documents for this cycle
        const votes = await loadData("*[_type == 'vote' && cycle._ref == $cycleId && submitted == true]", { cycleId: cycleId })
        // ====>
        const combinedVoteAllocations = votes.flatMap(vote => vote.voteAllocation)
        // ====>
        resultObject.totalVoteCredits = combinedVoteAllocations.reduce((acc, curr) => acc + curr.voteCredits, 0)
        resultObject.totalEffectiveVotes = combinedVoteAllocations.reduce((acc, curr) => acc + curr.effectiveVotes, 0)
        resultObject.numberOfParticipants = votes.length
        // ====>
        const groupedVotes = groupBy(combinedVoteAllocations, "proposal._ref")
        const finalVotes = Object.entries(groupedVotes).map(e => {
            return {
                _type: "resultItem",
                _key: uuidv4(),
                proposal: {
                    _type: "reference",
                    _ref: e[0]
                },
                effectiveVotes: e[1].reduce((acc, curr) => acc + curr.effectiveVotes, 0),
                voteCredits: e[1].reduce((acc, curr) => acc + curr.voteCredits, 0),
            }
        })
        resultObject.result = orderBy(finalVotes, ['effectiveVotes'], ['desc']);
        // ====>
        resultObject.votesByUser = votes.map(vote => {
            const temp = {}
            temp._type = 'userItem'
            temp._key = uuidv4()
            temp.user = vote.user
            temp.voteAllocation = vote.voteAllocation
            return temp
        })
        // ====>
        // TODO: COUNT PER RESOURCE
        // ====>
        authorizedClient.createOrReplace(resultObject).then((res) => {
            console.log(`Result was created, document ID is ${res._id}`)
        })

        return {
            body: JSON.stringify(resultObject),
        };
    }
    return {
        body: "ERROR",
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
    };
};