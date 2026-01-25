declare namespace Express {
    export interface Request {
        user: SupabaseUser;
    }
    export interface Response {
        user: any;
    }
}

interface SupabaseUser {
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;
    email: string;
    phone: string;
    app_metadata: {
        provider: string;
        providers: string[];
    };
    user_metadata: {
        email_verified: boolean;
    };
    role: string;
    aal: string;
    amr: {
        method: string;
        timestamp: number;
    }[];
    session_id: string;
    is_anonymous: boolean;
}
