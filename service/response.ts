import {NextApiResponse} from 'next';

export interface ResponseType<T = any> {
    code: number;
    message: string;
    data: T;
}

export const jsonRes = <T = any>(
    res: NextApiResponse,
    props?: {
        code?: number;
        message?: string;
        data?: T;
        error?: any;
    }
) => {
    const {code = 200, message = '', data = null, error} = props || {};

    if ((code < 200 || code >= 400) && !message) {
        res.status(code).json({
            ...props,
            message:String(message||error)
        });
    }
    
    return res.json(props || {});
};

