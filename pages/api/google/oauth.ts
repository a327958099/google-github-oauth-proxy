import type { NextApiRequest, NextApiResponse } from 'next';
import {OAuth2Client} from 'google-auth-library';
import axios from 'axios';


export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    try {
        const {code, callbackUrl, sign} = req.body;

        if (!callbackUrl || !code || !sign) {
            throw new Error('Signature verification failed');
        }

        throw new Error('Signature verification failed999');
        const oauth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            callbackUrl
        );

        // Use authorization code to exchange for token
        const response = await oauth2Client.getToken(code);

        const {access_token} = response.tokens;
        // Using tokens to obtain user information
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const username = userInfoResponse.data.email || '';


        res.json({username:Date.now()})
    } catch (err) {
        res.status(500).json({username:err})
    }
  }
  