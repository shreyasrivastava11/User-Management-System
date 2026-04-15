import jwt from 'jsonwebtoken';

export function signAccessToken(payload, secret, expiresIn) {
  return jwt.sign(payload, secret, { expiresIn });
}
