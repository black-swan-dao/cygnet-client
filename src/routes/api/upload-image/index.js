import { authorizedClient } from '../_authorizedClient.js';

const toBuffer = (ab) => {
    const buf = Buffer.alloc(ab.byteLength);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
}

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
}

export const post = async (event) => {
    try {
        const body = await event.request.arrayBuffer()
        const imageBuffer = toBuffer(body)
        const document = await authorizedClient.assets.upload('image', imageBuffer)
        console.log('The image was uploaded!', document)
        return {
            body: JSON.stringify(document)
        };
    } catch (error) {
        console.error(error);
        return {
            body: JSON.stringify(error)
        };
    }
};
