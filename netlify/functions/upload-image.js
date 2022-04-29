const sanity = require("@sanity/client")
const _ = require('lodash')
const busboy = require('busboy');

function parseMultipartForm(event) {
    return new Promise((resolve) => {
        // we'll store all form fields inside of this
        const fields = {};

        // let's instantiate our busboy instance!
        const bb = busboy({
            // it uses request headers
            // to extract the form boundary value (the ----WebKitFormBoundary thing)
            headers: event.headers
        });

        console.log('bb')
        console.log(bb)

        // before parsing anything, we need to set up some handlers.
        // whenever busboy comes across a file ...
        // bb.on(
        //     "file",
        //     (fieldname, filestream, filename, transferEncoding, mimeType) => {
        //         // ... we take a look at the file's data ...
        //         filestream.on("data", (data) => {
        //             // ... and write the file's name, type and content into `fields`.
        //             fields[fieldname] = {
        //                 filename,
        //                 type: mimeType,
        //                 content: data,
        //             };
        //         });
        //     }
        // );

        // // whenever busboy comes across a normal field ...
        // bb.on("field", (fieldName, value) => {
        //     // ... we write its value into `fields`.
        //     fields[fieldName] = value;
        // });

        // // once busboy is finished, we resolve the promise with the resulted fields.
        // bb.on("close", () => {
        //     console.log('fields', fields)
        //     resolve(fields)
        // });

        // // now that all handlers are set up, we can finally start processing our request!

        bb.on('file', (name, file, info) => {
            const { filename, encoding, mimeType } = info;
            console.log(
                `File [${name}]: filename: %j, encoding: %j, mimeType: %j`,
                filename,
                encoding,
                mimeType
            );
            file.on('data', (data) => {
                console.log(`File [${name}] got ${data.length} bytes`);
            }).on('close', () => {
                console.log(`File [${name}] done`);
            });
        });

        bb.on('field', (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });

        bb.on('close', () => {
            console.log('Done parsing form!');
            res.writeHead(303, { Connection: 'close', Location: '/' });
            res.end();
        });

        bb.write(event.body);
    });
}


const client = sanity({
    projectId: process.env.VITE_SANITY_ID,
    dataset: "production",
    token: process.env.VITE_SANITY_TOKEN,
    useCdn: false,
})

const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
}

exports.handler = async (event, context) => {
    console.log(event)
    // const fields = await parseMultipartForm(event)
    // console.log(fields)
    return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(event)
    };

    // try {
    //     console.log(event)
    //     // const contentType = _.get(event, 'headers["content-type"]', "image/jpeg")
    //     // console.log(contentType)
    //     // const imageBuffer = toBuffer(event.body)
    //     // if(body.isBase64Encoded) {
    //     // const imageBuffer = await Buffer.from(event.body, "base64")
    //     // console.log(imageBuffer)
    //     const document = await client.assets.upload('image', event.body)
    //     console.log('The image was uploaded!', document)
    //     return {
    //         statusCode: 200,
    //         headers: HEADERS,
    //         body: JSON.stringify(document)
    //     };
    // } catch (error) {
    //     console.error(error);
    //     return {
    //         statusCode: 500,
    //         headers: HEADERS,
    //         body: JSON.stringify(error)
    //     };
    // }
}