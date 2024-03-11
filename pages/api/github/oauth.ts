import type { NextApiRequest, NextApiResponse } from "next";
import { jsonRes } from "@/service/response";
import { SignatureVerification } from "@/service/signatureVerification";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  try {
    const { code, sign } = req.body;

    if (!code || !sign) {
      throw new Error("Signature verification failed");
    }

    await SignatureVerification(code, sign);

    let username = "";

    const github = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const accessToken = github.data.access_token;
    const emailRes = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    if (emailRes.data.length > 0 && emailRes.data[0].primary) {
      username = emailRes.data[0].email;
    }

    jsonRes(res, { data: username });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err,
    });
  }
}
