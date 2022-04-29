import jwksClient from 'jwks-rsa'
import jwt from 'jsonwebtoken'
import { AUTH0_JWKS_URI } from '$lib/cygnet-config.js'

const client = jwksClient({
    jwksUri: AUTH0_JWKS_URI
})

const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        const signingKey = key.publicKey || key.rsaPublicKey
        callback(null, signingKey)
    })
}

export const verifyToken = token => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, (err, decoded) => {
            if (err) {
                reject(err)
            } else {
                resolve(decoded)
            }
        })
    })
}