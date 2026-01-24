'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.expressAuthentication = expressAuthentication;
const supabaseVerifyJWT_1 = require('./core/supabaseVerifyJWT');
async function expressAuthentication(request, securityName, scopes) {
  if (securityName !== 'supabase') throw new Error('Unknown security scheme');
  const authHeader = request.headers.authorization;
  if (!authHeader) throw new Error('Missing Authorization header');
  const token = authHeader.replace(/^Bearer\s+/i, '');
  let payload;
  try {
    payload = await (0, supabaseVerifyJWT_1.verifyProjectJWT)(token);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
  return payload;
}
