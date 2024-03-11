import crypto from 'crypto';



const createSignature = (code: string) => {
    const secret = process.env.GOOGLE_CLIENT_SECRET
    const md5 = crypto.createHash('md5');
    md5.update(`${code}${secret}`);
    const sign = md5.digest('hex').toLowerCase();
    return sign;
};

export async function SignatureVerification(code: string, sign: string): Promise<boolean> {
    try {
        const _sign = createSignature(code);
        if (_sign !== sign) {
            return Promise.reject('Signature verification failed');
        }
        return true;
    } catch (e) {
        return Promise.reject('Unknown mistake');
    }
}