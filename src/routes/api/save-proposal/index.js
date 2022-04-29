import { loadData } from "$lib/sanity.js"
import { verifyToken } from '../_jwt.js'
import { authorizedClient } from '../_authorizedClient.js';
import { v4 as uuidv4 } from 'uuid'
import uniqBy from 'lodash/uniqBy.js'
const DISCORD_PREFIX = "oauth2|discord|"
const slugify = str => str.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, "-")

export const post = async (event) => {
    // Parse message body
    const body = await event.request.json()
    // Verfiy and decode JWT
    console.log('body.authorization', body.authorization)
    const decodedToken = await verifyToken(body.authorization)
    // Get user ID from token
    const userId = decodedToken.sub.replace(DISCORD_PREFIX, "")
    // Get user from Sanity
    const user = await loadData("*[_type == 'user' && _id == $id][0]", { id: userId })
    console.log('user', user)
    // const imgRes = await client.assets.upload("image", fs.createReadStream('./uploads/' + req.file.filename, { contentType: req.file.mimetype, filename: req.file.filename }))
    // console.log(imgRes)
    const message = body.message
    // Avoid slug collisions
    const id = message.id ? message.id : uuidv4()
    const slug = slugify(message.title) + '-' + id.split('-')[0]
    // Create the proposal document
    let doc = {
        _type: 'proposal',
        _id: id,
        title: message.title,
        slug:
        {
            _type: "slug",
            current: slug,
        },
        cycle: {
            _type: "reference",
            _ref: message.cycleId,
        },
        authors: [
            {
                _type: "author",
                _ref: user._id,
                _key: uuidv4()
            }
        ],
        resources: [],
        content: message.content,
    }

    if (message.imageId) {
        doc.mainImage = {
            _type: "image",
            asset: {
                _ref: message.imageId,
                _type: "reference"
            }
        }
    }

    // Add peers as authors
    const peers = message.peers
    if (peers && Array.isArray(peers)) {
        peers.forEach(p => {
            doc.authors.push({
                _type: "author",
                _ref: p.value._id,
                _key: uuidv4()
            })
        })
    }

    // Add resources
    const resources = message.resources
    if (resources && Array.isArray(resources)) {
        resources.forEach(r => {
            doc.resources.push({
                _type: "resource",
                _ref: r.value._id,
                _key: uuidv4()
            })
        })
    }

    // De-deduplicate authors
    doc.authors = uniqBy(doc.authors, '_ref')

    // Finally, write to the database
    const result = await authorizedClient.createOrReplace(doc)
    console.log(result)
    return {
        body: JSON.stringify(result)
    };
};