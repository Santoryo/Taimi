import { createClient, User, UserAppMetadata, UserIdentity } from '@supabase/supabase-js';
import { Request, Response, NextFunction } from 'express';


export interface AuthGuardUserRequest extends Request {
    user: UserAppMetadata;
}

export const authGuard = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'] as string;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header is required' });
    }

    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!)
    const token = authHeader.replace("Bearer ", "");

    const { data, error } = await supabase.auth.getUser(token);
    const user = data.user;
    if (!user || error) return res.status(401).json({ error: 'Unauthorized' });
    
    req.user = user;

    next();
};