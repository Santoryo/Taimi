import { jwtVerify, createRemoteJWKSet, FlattenedJWSInput } from "jose";
import { Request } from "express";

const PROJECT_JWKS = createRemoteJWKSet(
  new URL("https://wesmflenqpaqjnqdcosk.supabase.co/auth/v1/.well-known/jwks.json")
);

export interface SupabaseJwtPayload {
  sub: string;
  role: string;
  email?: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
}

export async function verifyProjectJWT(token: string): Promise<SupabaseJwtPayload> {
  const { payload } = await jwtVerify(token, PROJECT_JWKS);
  return payload as unknown as SupabaseJwtPayload;
}
