const sanity = require("@sanity/client")
const _ = require('lodash')
const { v4: uuidv4 } = require('uuid');

const client = sanity({
    projectId: process.env.VITE_SANITY_ID,
    dataset: "production",
    token: process.env.VITE_SANITY_TOKEN,
    useCdn: false,
})

const loadData = async (query, params) => {
    try {
        const res = await client.fetch(query, params)
        if (res === null) {
            return Promise.reject('No posts');
        }
        return res
    } catch (err) {
        return Promise.reject(new Error(404));
    }
}

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
}

exports.handler = async (event, context) => {
    const body = JSON.parse(event.body)
    console.log(body)
    const cycleId = body._id.replace('drafts.', '')
    if (cycleId) {
        // Prepare inital result document
        const resultObject = {
            _id: "result_" + cycleId,
            _type: "result",
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
        // Get all submitted votes for this cycle
        const votes = await loadData("*[_type == 'vote' && cycle._ref == $cycleId && submitted == true]", { cycleId: cycleId })
        // ====>
        const combinedVoteAllocations = votes.flatMap(vote => vote.voteAllocation)
        // ====>
        resultObject.totalVoteCredits = combinedVoteAllocations.reduce((acc, curr) => acc + curr.voteCredits, 0)
        resultObject.totalEffectiveVotes = combinedVoteAllocations.reduce((acc, curr) => acc + curr.effectiveVotes, 0)
        resultObject.numberOfParticipants = votes.length
        // ====>
        const groupedVotes = _.groupBy(combinedVoteAllocations, "proposal._ref")
        resultObject.numberOfProposals = Object.entries(groupedVotes).length
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
        resultObject.result = _.orderBy(finalVotes, ['effectiveVotes'], ['desc']);
        // ====>
        resultObject.votesByUser = votes.map(vote => {
            const temp = {}
            temp._type = 'userItem'
            temp._key = uuidv4()
            temp.user = vote.user
            temp.voteMultiplier = vote.voteMultiplier
            temp.voteMultiplierRole = vote.voteMultiplierRole
            temp.voteAllocation = vote.voteAllocation
            return temp
        })
        // ====>
        // TODO: COUNT PER RESOURCE
        // ====>
        console.log('resultObject', resultObject)
        client.createOrReplace(resultObject).then((res) => {
            console.log(`Result was created, document ID is ${res._id}`)
        })

        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify(resultObject)
        };
    }
    return {
        statusCode: 500,
        headers: HEADERS,
        body: "ERROR"
    };
}