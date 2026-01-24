'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.verifyProjectJWT = verifyProjectJWT;
const jose_1 = require('jose');
const PROJECT_JWKS = (0, jose_1.createRemoteJWKSet)(
  new URL(
    'https://wesmflenqpaqjnqdcosk.supabase.co/auth/v1/.well-known/jwks.json',
  ),
);
async function verifyProjectJWT(token) {
  const { payload } = await (0, jose_1.jwtVerify)(token, PROJECT_JWKS);
  return payload;
}
