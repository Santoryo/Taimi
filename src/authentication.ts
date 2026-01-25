import { Request } from 'express';
import { SupabaseJwtPayload, verifyProjectJWT } from './core/supabaseVerifyJWT';

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes?: string[],
): Promise<SupabaseJwtPayload> {
    if (securityName !== 'supabase') throw new Error('Unknown security scheme');

    const authHeader = request.headers.authorization;
    if (!authHeader) throw new Error('Missing Authorization header');

    const token = authHeader.replace(/^Bearer\s+/i, '');

    let payload: SupabaseJwtPayload;
    try {
        payload = await verifyProjectJWT(token);
    } catch (err) {
        throw new Error('Invalid or expired token');
    }

    return payload;
}
